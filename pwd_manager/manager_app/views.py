import base64
import json
import os

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import HttpResponseRedirectBase, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, ExternalPassword, MasterKey

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            search_string = request.POST["sitesearch"].strip()
            saved_passwords = ExternalPassword.objects.filter(user=request.user, domain__icontains=search_string).order_by("domain")

            paginator = Paginator(saved_passwords, 5)
            page_number = request.GET.get("page")
            page_obj = paginator.get_page(page_number)

            return render(request, "manager/index.html", {
                "page_obj": page_obj
            })

        else:
            saved_passwords = ExternalPassword.objects.filter(user=request.user).order_by("domain")

            paginator = Paginator(saved_passwords, 5)
            page_number = request.GET.get("page")
            page_obj = paginator.get_page(page_number)

            return render(request, "manager/index.html", {
                "page_obj": page_obj
            })

    return render(request, "manager/index.html")


def login_view(request):
    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "manager/login.html",
                {"message": "Invalid username and/or password."}
            )
    else:
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse("index"))
        return render(request, "manager/login.html")
    

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def derive_key(passphrase, salt):
        passphrase_enc = passphrase.encode()

        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256,
            length=32,
            salt=salt,
            iterations=100_000
        )

        pass_derived_key = base64.urlsafe_b64encode(kdf.derive(passphrase_enc))

        return pass_derived_key


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        #Get password and passphrase
        password = request.POST["password"]
        passphrase = request.POST["passphrase"]

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
        except IntegrityError:
            return render(
                request, "manager/register.html", {"message": "Username already taken."}
            )
        
        # Create key that will be used to encrypt stored passwords and then encrypt that key using a passphrase-derived key.
        master_key = Fernet.generate_key()
        salt = os.urandom(16) #Generate salt for deriving key from passphrase

        pass_derived_key = derive_key(passphrase, salt)
        f = Fernet(pass_derived_key)
        encr_master_key = f.encrypt(master_key)

        new_key_record = MasterKey.objects.create(
            user=user,
            salt=salt,
            encryp_key=encr_master_key
        )

        login(request, user)

        return HttpResponseRedirect(reverse("index"))
    else:
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse("index"))
        return render(request, "manager/register.html")


@login_required
def check_passphrase(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    user_info = MasterKey.objects.get(user=request.user)
    salt = user_info.salt

    data = json.loads(request.body)
    passphrase = data["passphrase"]

    pass_derived_key = derive_key(passphrase, salt)
    f = Fernet(pass_derived_key)

    try:
        master_key = f.decrypt(user_info.encryp_key)
        return JsonResponse({"message": "Correct passphrase."}, status=200)
    except InvalidToken:
        return JsonResponse({"error": "Incorrect passphrase."}, status=400)


@login_required
def add_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    user_info = MasterKey.objects.get(user=request.user)
    salt = user_info.salt
    
    data = json.loads(request.body)
    site = data["site"]
    username = data["username"]
    password = data["password"]
    passphrase = data["passphrase"]

    pass_derived_key = derive_key(passphrase, salt)
    f = Fernet(pass_derived_key)

    try:
        master_key = f.decrypt(user_info.encryp_key)
    except InvalidToken:
        return JsonResponse({"error": "Incorrect passphrase."}, status=400)

    #Encrypt saved password with master key
    g = Fernet(master_key)
    encryp_pwd = g.encrypt(password.encode())

    #Create new password record
    saved_pwd = ExternalPassword.objects.create(
        user=request.user,
        domain=site,
        domain_username=username,
        domain_password=encryp_pwd
        
    )
    return JsonResponse({"message": "Password added!"}, status=200)


@login_required
def get_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    user_info = MasterKey.objects.get(user=request.user)
    salt = user_info.salt

    data = json.loads(request.body)
    passphrase = data["passphrase"]
    pwd_id = int(data["id"])

    pass_derived_key = derive_key(passphrase, salt)
    f = Fernet(pass_derived_key)

    master_key = f.decrypt(user_info.encryp_key)
    g = Fernet(master_key)

    ext_pwd = ExternalPassword.objects.get(pk=pwd_id)
    decryp_pwd = g.decrypt(ext_pwd.domain_password)
    decode_pwd = decryp_pwd.decode()

    return JsonResponse({"password": decode_pwd}, status=200)


@login_required
def delete_password(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    pwd_id = int(data["id"])

    ext_pwd = ExternalPassword.objects.get(pk=pwd_id)
    ext_pwd.delete()

    return HttpResponse(status=204)
    