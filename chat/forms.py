from django import forms
from .models import Photo, Player, School
import sys


class PhotoModelForm(forms.ModelForm):  # 不再使用 上線部署前刪掉

    class Meta:
        model = Photo
        fields = ('image', 'uploader',)


class PostNameForm(forms.ModelForm):  # 不再使用 上線部署前刪掉

    class Meta:
        model = Player
        fields = ('name',)

    def clean_name(self):
        name = self.cleaned_data.get('name')
        if len(name) > 20:
            raise forms.ValidationError("the length of name is more than 20 characters.")
        return name


class PostSchoolForm(forms.ModelForm):  # 不再使用 上線部署前刪掉

    class Meta:
        model = School
        fields = ('name',)

    def clean_school(self):
        name = self.cleaned_data.get('name')
        filter_result = School.objects.filter(name__exact=name)
        if len(filter_result) == 0:
            raise forms.ValidationError("the school hasn't been available yet.")
        return name
