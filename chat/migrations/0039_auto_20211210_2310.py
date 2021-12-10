# Generated by Django 3.2 on 2021-12-10 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0038_auto_20211210_2306'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dialogue',
            name='game',
        ),
        migrations.RemoveField(
            model_name='gameevent',
            name='game',
        ),
        migrations.RemoveField(
            model_name='gamerole',
            name='game',
        ),
        migrations.RemoveField(
            model_name='player',
            name='game',
        ),
        migrations.RemoveField(
            model_name='room',
            name='game',
        ),
        migrations.AlterField(
            model_name='game',
            name='gameId',
            field=models.CharField(max_length=20, primary_key=True, serialize=False),
        ),
    ]
