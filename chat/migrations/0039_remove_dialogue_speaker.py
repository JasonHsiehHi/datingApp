# Generated by Django 3.2 on 2021-12-10 16:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0038_alter_game_game_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dialogue',
            name='speaker',
        ),
    ]