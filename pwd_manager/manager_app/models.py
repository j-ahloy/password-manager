from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey

# Create your models here.
class User(AbstractUser):
    pass


class ExternalPassword(models.Model):
    user = ForeignKey(User, on_delete=models.CASCADE)
    domain = models.TextField()
    domain_username = models.TextField()
    domain_password = models.BinaryField()


class MasterKey(models.Model):
    user = ForeignKey(User, on_delete=models.CASCADE)
    salt = models.BinaryField(max_length=16)
    encryp_key = models.BinaryField()