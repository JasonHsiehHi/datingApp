from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Room(models.Model):
    ROOM_MATCH_TYPE = (
        ('mf', 'male->female'),
        ('mm', 'male->male'),
        ('ff', 'female->female')
    )
    room_id = models.CharField(max_length=20, null=True)  # 刪掉 用預設id即可
    userNum = models.IntegerField(default=0)  # 刪掉
    matchType = models.CharField(max_length=2, choices=ROOM_MATCH_TYPE)  # 刪掉

    create_date = models.DateTimeField(default=timezone.now)
    school = models.ForeignKey('School', null=True, on_delete=models.SET_NULL, default=None)
    game = models.ForeignKey('Game', null=True, on_delete=models.SET_NULL, default=None)

    playerNum = models.IntegerField(default=0)
    player_dict = models.JSONField(max_length=200, null=True, default=dict)
    onoff_dict = models.JSONField(max_length=25, null=True, default=dict)
    answer = models.JSONField(max_length=30, null=True, default=dict)

    def __str__(self):
        return "room-%s" % self.room_id


class Match(models.Model):
    match_id = models.CharField(max_length=20, null=True)  # 刪掉 用預設id即可
    player_list = models.JSONField(max_length=200, null=True, default=list)
    room = models.ForeignKey('Room', null=True, on_delete=models.SET_NULL, default=None)

    def __str__(self):
        return "match-%s" % self.match_id


class Player(models.Model):
    MATCH_TYPE = (  # 刪掉
        ('mf', 'male->female'),
        ('fm', 'female->male'),
        ('mm', 'male->male'),
        ('ff', 'female->female')
    )
    GENDER_TYPE = (
        ('m', 'male'),
        ('f', 'female')
    )

    uuid = models.UUIDField(primary_key=True)
    create_date = models.DateTimeField(default=timezone.now)
    name = models.CharField(max_length=25, null=True)
    anonName = models.CharField(max_length=25, null=True)  # 刪掉 可用match.player_list取代
    imgUrl_adult = models.URLField(null=True)
    status = models.IntegerField(default=0)  # 之後修改成CharField
    isBanned = models.BooleanField(default=False)

    school = models.ForeignKey('School', null=True, on_delete=models.SET_NULL, default=None)
    room = models.ForeignKey('Room', null=True, on_delete=models.SET_NULL, default=None)
    match = models.ForeignKey('Match', null=True, on_delete=models.SET_NULL, default=None)

    matchType = models.CharField(max_length=2, choices=MATCH_TYPE, null=True)  # 刪掉
    testResult = models.JSONField(max_length=30, null=True)  # 刪掉
    score = models.FloatField(null=True)  # 刪掉

    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL, default=None, related_name='profile')
    isRegistered = models.BooleanField(default=False)

    gender = models.CharField(max_length=1, choices=GENDER_TYPE, null=True)
    isAdult = models.BooleanField(null=True, default=True)
    isHetero = models.BooleanField(null=True, default=True)
    # game = models.ForeignKey('Game', null=True, on_delete=models.SET_NULL, default=None)

    waiting_time = models.DateTimeField(null=True)
    isPrepared = models.BooleanField(default=False)
    isOn = models.BooleanField(default=False)

    tag_int = models.IntegerField(null=True)  # 針對特定角色才有用 偵探：需要紀錄自己審問的人
    tag_json = models.JSONField(max_length=25, null=True)

    def __str__(self):
        return '{0} ({1})'.format(self.name, self.uuid)


class Game(models.Model):
    name = models.CharField(max_length=20)
    gameId = models.CharField(primary_key=True, max_length=20)
    isAdult = models.BooleanField()
    isHetero = models.BooleanField()
    best_ratio = models.JSONField(max_length=10)  # 異性配對才有比例 同性配對則不需要 異性為[5,1] 同性為[5:0]
    threshold_ratio = models.JSONField(max_length=10)  # 有分最合適比例與及格配對比例兩種 差別在於等待時間

    def __str__(self):
        return self.gameId


class GameRole(models.Model):  # 角色數量一定要多過遊戲人數 才不會抽不到人
    name = models.CharField(max_length=10)
    gender = models.CharField(max_length=1, null=True)
    # game = models.ForeignKey('Game', null=True, on_delete=models.SET_NULL, default=None)
    group = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class GameEvent(models.Model):
    name = models.CharField(max_length=20)
    content = models.TextField(null=True)
    # game = models.ForeignKey('Game', null=True, on_delete=models.SET_NULL, default=None)
    group = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Dialogue(models.Model):
    dialog = models.JSONField(null=True)  # list: sentences
    # game = models.ForeignKey('Game', null=True, on_delete=models.SET_NULL, default=None)
    action = models.CharField(max_length=10)
    sub = models.CharField(max_length=20, null=True)
    number = models.IntegerField()
    speaker = models.ForeignKey('Robot', null=True, on_delete=models.SET_NULL)  # 刪掉

    def __str__(self):
        return '{0}-{1}'.format(self.action, self.number)


class School(models.Model):  # 換成City
    name = models.CharField(max_length=10, primary_key=True)

    roomNum = models.IntegerField(default=0)
    femaleNumForMale = models.IntegerField(default=0)
    maleNumForFemale = models.IntegerField(default=0)
    femaleNumForFemale = models.IntegerField(default=0)
    maleNumForMale = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Question(models.Model):  # 刪掉
    id = models.CharField(max_length=5, primary_key=True)  # 換成q_id 不要蓋過預設的id
    type = models.CharField(max_length=1)
    content = models.CharField(max_length=200)
    choice = models.JSONField(max_length=200)

    def __str__(self):
        return self.id


class Robot(models.Model):  # 刪掉
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Photo(models.Model):
    image = models.ImageField(upload_to='photo/', blank=False, null=False)
    uploader = models.CharField(max_length=8, null=True)  # todo 同一位上傳者禁止連續上傳 且房間中要限制上傳數量
    isForAdult = models.BooleanField(default=False)
    upload_date = models.DateTimeField(default=timezone.now)

    @property
    def name(self):
        return '{0}{1}'.format(self.uploader, self.upload_date.strftime('%m%d%H%M%S%f'))

    def __str__(self):
        return self.name
