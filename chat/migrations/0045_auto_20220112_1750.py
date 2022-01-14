# Generated by Django 3.2 on 2022-01-12 09:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0044_auto_20220111_1024'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dialogue',
            name='dialog',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='dialogue',
            name='game',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game'),
        ),
        migrations.AlterField(
            model_name='dialogue',
            name='sub',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='game',
            name='story',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='gameevent',
            name='content',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='gameevent',
            name='game',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game'),
        ),
        migrations.AlterField(
            model_name='gamerole',
            name='game',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game'),
        ),
        migrations.AlterField(
            model_name='gamerole',
            name='gender',
            field=models.CharField(blank=True, max_length=1, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='player_list',
            field=models.JSONField(blank=True, default=list, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='room',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.room'),
        ),
        migrations.AlterField(
            model_name='photo',
            name='uploader',
            field=models.CharField(blank=True, max_length=8, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='city',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.city', to_field='name'),
        ),
        migrations.AlterField(
            model_name='player',
            name='game',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game'),
        ),
        migrations.AlterField(
            model_name='player',
            name='gender',
            field=models.CharField(blank=True, choices=[('m', 'male'), ('f', 'female')], max_length=1, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='imgUrl_adult',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='isAdult',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='isHetero',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='match',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.match'),
        ),
        migrations.AlterField(
            model_name='player',
            name='name',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='room',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.room'),
        ),
        migrations.AlterField(
            model_name='player',
            name='school',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.school'),
        ),
        migrations.AlterField(
            model_name='player',
            name='tag_int',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='tag_json',
            field=models.JSONField(blank=True, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='player',
            name='user',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='profile', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='player',
            name='waiting_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='room',
            name='answer',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AlterField(
            model_name='room',
            name='city',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.city', to_field='name'),
        ),
        migrations.AlterField(
            model_name='room',
            name='game',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.game'),
        ),
        migrations.AlterField(
            model_name='room',
            name='onoff_dict',
            field=models.JSONField(blank=True, default=dict, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='room',
            name='player_dict',
            field=models.JSONField(blank=True, default=dict, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='room',
            name='school',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat.school'),
        ),
    ]
