from django.db import models
from django.utils import timezone


class Room(models.Model):
    ROOM_MATCH_TYPE = (
        ('mf', 'male->female'),
        ('mm', 'male->male'),
        ('ff', 'female->female')
    )
    userNum = models.IntegerField(default=0)
    matchType = models.CharField(max_length=2, choices=ROOM_MATCH_TYPE, default='mf')
    school = models.CharField(max_length=30)

    @property
    def group_name(self, room_name=None):
        if room_name is None:
            return "room-%s" % self.id
        else:
            return "room-%s" % room_name

    def __str__(self):
        return self.group_name


class Player(models.Model):
    MATCH_TYPE = (
        ('mf', 'male->female'),
        ('fm', 'female->male'),
        ('mm', 'male->male'),
        ('ff', 'female->female')
    )

    uuid = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=100, null=True, default=None)
    create_date = models.DateTimeField(default=timezone.now)

    isBanned = models.BooleanField(default=False)
    isWaiting = models.BooleanField(default=False)
    inRoom = models.BooleanField(default=False)

    room = models.ForeignKey('Room', null=True, on_delete=models.SET_NULL, default=None)
    school = models.ForeignKey('School', null=True, on_delete=models.SET_NULL, default=None)
    matchType = models.CharField(max_length=2, choices=MATCH_TYPE, null=True, default=None)

    result = models.JSONField(max_length=100, null=True, default=None)
    waitingTime = models.FloatField(default=0)
    score = models.FloatField(default=0)

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
    content = models.CharField(max_length=200)
    id = models.CharField(max_length=5, primary_key=True)
    type = models.CharField(max_length=1)
    choice = models.JSONField(max_length=200)

    def __str__(self):
        return self.id


class Dialogue(models.Model):
    dialog = models.JSONField(null=True)  # list, sentences could be more than one
    action = models.CharField(max_length=30)
    sub = models.CharField(max_length=10, null=True, default=None)
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
    uploader = models.ForeignKey('Player', null=True, on_delete=models.SET_NULL, default=None)
    upload_date = models.DateTimeField(default=timezone.now)

    @property
    def name(self):
        return '{0}{1}'.format(self.uploader.uuid, self.upload_date.strftime('%m%d%H%M%S'))

    def __str__(self):
        return self.name
