# Generated by Django 3.2 on 2021-10-25 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0011_auto_20211011_1522'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dialogue',
            name='action',
            field=models.CharField(max_length=10),
        ),
        migrations.AlterField(
            model_name='dialogue',
            name='sub',
            field=models.CharField(default=None, max_length=20, null=True),
        ),
    ]