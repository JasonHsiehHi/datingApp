# Generated by Django 3.2 on 2021-11-28 11:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0021_auto_20211128_1707'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='tag_int',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='room',
            name='femaleNeeded',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='room',
            name='game',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game'),
        ),
        migrations.AddField(
            model_name='room',
            name='isFull',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='room',
            name='maleNeeded',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='room',
            name='onoff_list',
            field=models.JSONField(max_length=25, null=True),
        ),
        migrations.AddField(
            model_name='room',
            name='player_list',
            field=models.JSONField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='anonName',
            field=models.CharField(max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='name',
            field=models.CharField(max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='testResult',
            field=models.JSONField(max_length=30, null=True),
        ),
    ]