from django import forms
from .models import Photo


class PhotoModelForm(forms.ModelForm):  # 不再使用 上線部署前刪掉

    class Meta:
        model = Photo
        fields = ('image', 'uploader',)
        widgets = {
            'image': forms.FileInput(attrs={'class': 'form-control-file'}),
            'uploader': forms.TextInput(attrs={'class': 'form-control'}),
        }
