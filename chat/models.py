from django.db import models
from django.utils import timezone


class Room(models.Model):
    ROOM_MATCH_TYPE = (
        ('mf', 'male->female'),
        ('mm', 'male->male'),
        ('ff', 'female->female')
    )
    id = models.CharField(max_length=20, primary_key=True)
    userNum = models.IntegerField(default=0)
    matchType = models.CharField(max_length=2, choices=ROOM_MATCH_TYPE)
    school = models.CharField(max_length=10)

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
    create_date = models.DateTimeField(default=timezone.now)
    anonName = models.CharField(max_length=50, null=True, default=None)
    name = models.CharField(max_length=50, null=True, default=None)
    matchType = models.CharField(max_length=2, choices=MATCH_TYPE, null=True, default=None)
    imgUrl_adult = models.URLField(null=True, default=None)

    isBanned = models.BooleanField(default=False)
    status = models.IntegerField(default=0)

    room = models.ForeignKey('Room', null=True, on_delete=models.SET_NULL, default=None)
    school = models.ForeignKey('School', null=True, on_delete=models.SET_NULL, default=None)

    testResult = models.JSONField(max_length=100, null=True, default=None)
    score = models.FloatField(default=None, null=True)
    waiting_time = models.DateTimeField(null=True, default=None)

    def __str__(self):
        return '{0} ({1})'.format(self.name, self.uuid)


class School(models.Model):
    name = models.CharField(max_length=10, primary_key=True)

    roomNum = models.IntegerField(default=0)
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


class Dialogue(models.Model):
    dialog = models.JSONField(null=True)  # list: sentences could be more than one
    action = models.CharField(max_length=10)
    sub = models.CharField(max_length=20, null=True, default=None)
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
    uploader = models.CharField(max_length=8, null=True, default=None)  # todo 同一位上傳者禁止連續上傳 且房間中要限制上傳數量
    isForAdult = models.BooleanField(default=False)
    upload_date = models.DateTimeField(default=timezone.now)

    @property
    def name(self):
        return '{0}{1}'.format(self.uploader, self.upload_date.strftime('%m%d%H%M%S%f'))

    def __str__(self):
        return self.name
