# Generated by Django 3.2.3 on 2021-12-10 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manager_app', '0002_externalpassword_masterkey'),
    ]

    operations = [
        migrations.AlterField(
            model_name='externalpassword',
            name='domain_password',
            field=models.BinaryField(),
        ),
    ]