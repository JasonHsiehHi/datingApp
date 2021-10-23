from django.db import models
from django.utils import timezone


class Room(models.Model):
    ROOM_MATCH_TYPE = (
        ('mf', 'male->female'),
        ('mm', 'male->male'),
        ('ff', 'female->female')
    )
    userNum = models.IntegerField(default=0)  # todo room_id要改成創建者uuid+創立時間 才不會透露目前房間數
    matchType = models.CharField(max_length=2, choices=ROOM_MATCH_TYPE)
    school = models.CharField(max_length=30)

    def __str__(self):
        return "room-%s" % self.id


class Player(models.Model):
    MATCH_TYPE = (
        ('mf', 'male->female'),
        ('fm', 'female->male'),
        ('mm', 'male->male'),
        ('ff', 'female->female')
    )

    uuid = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=50, null=True, default=None)
    matchType = models.CharField(max_length=2, choices=MATCH_TYPE, null=True, default=None)
    create_date = models.DateTimeField(default=timezone.now)

    isBanned = models.BooleanField(default=False)
    status = models.IntegerField(default=0)

    anonName = models.CharField(max_length=50, null=True, default=None)
    room = models.ForeignKey('Room', null=True, on_delete=models.SET_NULL, default=None)
    school = models.ForeignKey('School', null=True, on_delete=models.SET_NULL, default=None)

    testResult = models.JSONField(max_length=100, null=True, default=None)
    score = models.FloatField(default=0)
    waiting_time = models.DateTimeField(null=True, default=None)

    def __str__(self):
        return '{0} ({1})'.format(self.name, self.uuid)


class School(models.Model):
    name = models.CharField(max_length=10, primary_key=True)

    femaleNumForMale = models.IntegerField(default=0)
    maleNumForFemale = models.IntegerField(default=0)
    femaleNumForFemale = models.IntegerField(default=0)
    maleNumForMale = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Question(models.Model):
    id = models.CharField(max_length=5, primary_key=True)
    type = models.CharField(max_length=1)
    content = models.CharField(max_length=200)
    choice = models.JSONField(max_length=200)

    def __str__(self):
        return self.id


class Dialogue(models.Model):  # todo 修改成能生成動態資訊 像是哪個地區使用者多...
    dialog = models.JSONField(null=True)  # list, sentences could be more than one
    action = models.CharField(max_length=30)
    sub = models.CharField(max_length=10, null=True, default=None)  # todo 刪除sub
    number = models.IntegerField()
    speaker = models.ForeignKey('Robot', null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return '{0}-{1}'.format(self.action, self.number)


class Robot(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Photo(models.Model):
    image = models.ImageField(upload_to='photo/', blank=False, null=False)
    uploader = models.CharField(max_length=8, null=True, default=None)  # todo 同一位上傳者要限制數量 且禁止連續上傳
    upload_date = models.DateTimeField(default=timezone.now)

    @property
    def name(self):
        return '{0}{1}'.format(self.uploader, self.upload_date.strftime('%m%d%H%M%S%f'))

    def __str__(self):
        return self.name
