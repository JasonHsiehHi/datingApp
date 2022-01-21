# Generated by Django 3.2 on 2022-01-21 05:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10, unique=True)),
                ('roomNum', models.IntegerField(default=0)),
                ('femaleNumForMale', models.IntegerField(default=0)),
                ('maleNumForFemale', models.IntegerField(default=0)),
                ('femaleNumForFemale', models.IntegerField(default=0)),
                ('maleNumForMale', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('game_id', models.CharField(max_length=20, unique=True)),
                ('isAdult', models.BooleanField()),
                ('isHetero', models.BooleanField()),
                ('best_ratio', models.JSONField(max_length=10)),
                ('threshold_ratio', models.JSONField(max_length=10)),
                ('story', models.JSONField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player_list', models.JSONField(blank=True, default=list, max_length=25, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='photo/')),
                ('uploader', models.CharField(blank=True, max_length=8, null=True)),
                ('isForAdult', models.BooleanField(default=False)),
                ('upload_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('player_dict', models.JSONField(blank=True, default=dict, max_length=200, null=True)),
                ('onoff_dict', models.JSONField(blank=True, default=dict, max_length=25, null=True)),
                ('answer', models.JSONField(blank=True, default=dict, null=True)),
                ('city', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.city', to_field='name')),
                ('game', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game')),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('uuid', models.UUIDField(primary_key=True, serialize=False)),
                ('create_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('name', models.CharField(blank=True, max_length=25, null=True)),
                ('imgUrl_adult', models.URLField(blank=True, null=True)),
                ('status', models.IntegerField(default=0)),
                ('isBanned', models.BooleanField(default=False)),
                ('gender', models.CharField(blank=True, choices=[('m', 'male'), ('f', 'female')], max_length=1, null=True)),
                ('isAdult', models.BooleanField(blank=True, default=True, null=True)),
                ('isHetero', models.BooleanField(blank=True, default=True, null=True)),
                ('waiting_time', models.DateTimeField(blank=True, null=True)),
                ('isPrepared', models.BooleanField(default=False)),
                ('isOn', models.BooleanField(default=False)),
                ('tag_int', models.IntegerField(blank=True, null=True)),
                ('tag_json', models.JSONField(blank=True, max_length=25, null=True)),
                ('city', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.city', to_field='name')),
                ('game', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game', to_field='game_id')),
                ('match', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.match')),
                ('room', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.room')),
                ('user', models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='match',
            name='room',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.room'),
        ),
        migrations.CreateModel(
            name='GameRole',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10)),
                ('gender', models.CharField(blank=True, max_length=1, null=True)),
                ('group', models.IntegerField(default=0)),
                ('game', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game')),
            ],
        ),
        migrations.CreateModel(
            name='GameEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('content', models.TextField(blank=True, null=True)),
                ('group', models.IntegerField(default=0)),
                ('game', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game')),
            ],
        ),
        migrations.CreateModel(
            name='Dialogue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dialog', models.JSONField(blank=True, null=True)),
                ('action', models.CharField(max_length=10)),
                ('sub', models.CharField(blank=True, max_length=20, null=True)),
                ('number', models.IntegerField()),
                ('game', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game')),
            ],
        ),
    ]
