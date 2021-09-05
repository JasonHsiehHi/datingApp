from django import forms
from .models import Photo


class PhotoModelForm(forms.ModelForm):

    class Meta:
        model = Photo
        fields = ('image', 'uploader',)
        widgets = {
            'image': forms.FileInput(attrs={'class': 'form-control-file'}),
            'uploader': forms.TextInput(attrs={'class': 'form-control'}),
        }
