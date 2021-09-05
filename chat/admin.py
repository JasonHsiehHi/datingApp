from django.contrib import admin
from .models import Room, Player, Question, School, Dialogue


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('group_name', 'school', 'matchType', 'userNum')
    ordering = ('school', 'matchType',)
    search_fields = ('school',)

    exclude = ('userNum',)


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('uuid', 'name', 'matchType', 'school', 'score', 'isWaiting', 'inRoom')
    ordering = ('school', 'matchType', '-score')
    search_fields = ('school',)


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'femaleNumForMale', 'maleNumForFemale', 'femaleNumForFemale', 'maleNumForMale')
    ordering = ('-femaleNumForMale', '-maleNumForFemale')
    search_fields = ('name',)

    exclude = ('femaleNumForMale', 'maleNumForFemale', 'femaleNumForFemale', 'maleNumForMale')


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'content', 'choice')
    ordering = ('id', 'type')
    search_fields = ('id',)


@admin.register(Dialogue)
class DialogueAdmin(admin.ModelAdmin):
    list_display = ('action', 'number', 'dialog')
    ordering = ('action', 'number')
    search_fields = ('action', )

