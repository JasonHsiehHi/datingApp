# Generated by Django 3.2 on 2021-12-31 14:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0042_auto_20211217_1649'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='match',
            name='match_id',
        ),
        migrations.RemoveField(
            model_name='player',
            name='anonName',
        ),
        migrations.RemoveField(
            model_name='player',
            name='matchType',
        ),
        migrations.RemoveField(
            model_name='player',
            name='score',
        ),
        migrations.RemoveField(
            model_name='player',
            name='testResult',
        ),
        migrations.RemoveField(
            model_name='room',
            name='matchType',
        ),
        migrations.RemoveField(
            model_name='room',
            name='playerNum',
        ),
        migrations.RemoveField(
            model_name='room',
            name='room_id',
        ),
        migrations.RemoveField(
            model_name='room',
            name='userNum',
        ),
    ]
