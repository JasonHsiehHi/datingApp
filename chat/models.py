from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Room(models.Model):
    create_date = models.DateTimeField(default=timezone.now)
    city = models.ForeignKey('City', null=True, blank=True, on_delete=models.SET_NULL, default=None, to_field='name')
    game = models.ForeignKey('Game', null=True, blank=True, on_delete=models.SET_NULL, default=None)

    player_dict = models.JSONField(null=True, blank=True, default=dict)
    onoff_dict = models.JSONField(null=True, blank=True, default=dict)
    answer = models.JSONField(null=True, blank=True, default=dict)

    def __str__(self):
        return "room-%s" % self.id


class Match(models.Model):
    room = models.ForeignKey('Room', null=True, blank=True, on_delete=models.SET_NULL, default=None)
    player_list = models.JSONField(null=True, blank=True, default=list)

    def __str__(self):
        return "match-%s" % self.id


class Player(models.Model):
    GENDER_TYPE = (
        ('m', 'male'),
        ('f', 'female')
    )

    uuid = models.UUIDField(primary_key=True)
    create_date = models.DateTimeField(default=timezone.now)
    name = models.CharField(max_length=25, null=True, blank=True)
    imgUrl_adult = models.URLField(null=True, blank=True)
    status = models.IntegerField(default=0)  # change to CharField
    isBanned = models.BooleanField(default=False)

    city = models.ForeignKey('City', null=True, blank=True, on_delete=models.SET_NULL, default=None, to_field='name')
    room = models.ForeignKey('Room', null=True, blank=True, on_delete=models.SET_NULL, default=None)
    match = models.ForeignKey('Match', null=True, blank=True, on_delete=models.SET_NULL, default=None)

    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL, default=None, related_name='profile')
    gender = models.CharField(max_length=1, choices=GENDER_TYPE, null=True, blank=True)

    isAdult = models.BooleanField(null=True, blank=True, default=True)
    isHetero = models.BooleanField(null=True, blank=True, default=True)
    game = models.ForeignKey('Game', null=True, blank=True, on_delete=models.SET_NULL, default=None, to_field='game_id')

    waiting_time = models.DateTimeField(null=True, blank=True)
    isPrepared = models.BooleanField(default=False)
    isOn = models.BooleanField(default=False)

    tag_int = models.IntegerField(null=True, blank=True)
    tag_json = models.JSONField(null=True, blank=True)

    def __str__(self):
        return '{0} ({1})'.format(self.name, self.uuid)


class Game(models.Model):
    name = models.CharField(max_length=30)
    game_id = models.CharField(max_length=25, unique=True)
    isAdult = models.BooleanField()
    isHetero = models.BooleanField()
    best_ratio = models.JSONField(max_length=10)  # 異性配對才有比例 同性配對則不需要 異性為[5,1] 同性為[5:0]
    threshold_ratio = models.JSONField(max_length=10)  # 有分最合適比例與及格配對比例兩種 差別在於等待時間
    story = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.game_id


class GameRole(models.Model):  # 角色數量一定要多過遊戲人數 才不會抽不到人
    name = models.CharField(max_length=25)
    gender = models.CharField(max_length=1, null=True, blank=True)
    game = models.ForeignKey('Game', null=True, blank=True, on_delete=models.SET_NULL, default=None)
    group = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class GameEvent(models.Model):
    name = models.CharField(max_length=30)
    content = models.TextField(null=True, blank=True)
    game = models.ForeignKey('Game', null=True, blank=True, on_delete=models.SET_NULL, default=None)
    group = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Dialogue(models.Model):
    dialog = models.JSONField(null=True, blank=True)  # list: sentences
    game = models.ForeignKey('Game', null=True, blank=True, on_delete=models.SET_NULL, default=None)
    action = models.CharField(max_length=10)
    sub = models.CharField(max_length=10, null=True, blank=True)
    number = models.IntegerField()

    def __str__(self):
        return '{0}-{1}'.format(self.action, self.number)


class City(models.Model):
    name = models.CharField(max_length=25, unique=True)  # other model:foreignKey to_field:name

    roomNum = models.IntegerField(default=0)
    femaleNumForMale = models.IntegerField(default=0)
    maleNumForFemale = models.IntegerField(default=0)
    femaleNumForFemale = models.IntegerField(default=0)
    maleNumForMale = models.IntegerField(default=0)

    def __str__(self):
        return self.name


'''
class School(models.Model):
    name = models.CharField(max_length=10, unique=True)

    roomNum = models.IntegerField(default=0)
    femaleNumForMale = models.IntegerField(default=0)
    maleNumForFemale = models.IntegerField(default=0)
    femaleNumForFemale = models.IntegerField(default=0)
    maleNumForMale = models.IntegerField(default=0)

    def __str__(self):
        return self.name
'''


class Photo(models.Model):
    image = models.ImageField(upload_to='photo/', blank=False, null=False)
    uploader = models.CharField(max_length=32, null=True, blank=True)  # 同一位上傳者禁止連續上傳 且相同match應限制上傳數量
    isForAdult = models.BooleanField(default=False)
    upload_date = models.DateTimeField(default=timezone.now)

    @property
    def name(self):
        return '{0}{1}'.format(self.uploader, self.upload_date.strftime('%m%d%H%M%S%f'))

    def __str__(self):
        return self.name
