from django.urls import path, re_path
from . import views

urlpatterns = [
    path("", views.index, name = "index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("addpass", views.add_password, name="add_pass"),
    path("checkphrase", views.check_passphrase, name="check_phrase"),
    path("getpwd", views.get_password, name="get_password"),
    path("deletepass", views.delete_password, name="del_password")
]