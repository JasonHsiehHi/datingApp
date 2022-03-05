"""
Django settings for datingApp project.
Generated by 'django-admin startproject' using Django 3.2.
"""

import os
from json import loads
from pathlib import Path

DEBUG = os.getenv('DEBUG', None)

if DEBUG is None:
    from dotenv import load_dotenv
    load_dotenv()
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True if os.getenv('DEBUG') == 'True' else False

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

DOMAIN_NAME = os.getenv('DOMAIN_NAME')
DOMAIN = 'http://' + DOMAIN_NAME
DOMAIN_IP = os.getenv('DOMAIN_IP', '')

WEB_SERVER_HOST = os.getenv('WEB_SERVER_HOST', '')

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    WEB_SERVER_HOST,
    DOMAIN_NAME,
    DOMAIN_IP
]

ROOT_URLCONF = 'datingApp.urls'

ADMIN_ENABLED = True if os.getenv('ADMIN_ENABLED') == 'True' else False
ADMIN_PATH = os.getenv('ADMIN_PATH')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',
    'chat'  # chat.apps.ChatConfig
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.getenv('CACHE_LOCATION'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient'
        },
        "KEY_PREFIX": "caches"
    }
}

WSGI_APPLICATION = 'datingApp.wsgi.application'

ASGI_APPLICATION = 'datingApp.asgi.application'

# channel redis
'''
    CHANNEL_LAYERS = {
        'default': {
            "BACKEND": "channels.layers.InMemoryChannelLayer",
        }
    }
'''

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [(os.getenv('CHANNEL_HOST'), 6379)],
        },
    },
}

# Database
'''
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
'''
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv('POSTGRES_NAME'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST'),
        'PORT': 5432,
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Taipei'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)

if DEBUG is True:
    STATICFILES_DIRS = [
        BASE_DIR / 'static'
    ]
    STATICFILES_FINDERS = [
        'django.contrib.staticfiles.finders.FileSystemFinder',
        'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    ]
else:
    STATICFILES_DIRS = []
    STATIC_ROOT = BASE_DIR / 'static'

STATIC_URL = os.getenv('STATIC_URL')

MEDIA_ROOT = BASE_DIR / 'media'  # that haven't been used

MEDIA_URL = os.getenv('MEDIA_URL')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# for chat app - greet
CROWDED_ROOM_NUM = 20  # if more than that, the GREET will recommend the city
PLENTY_ROOM_NUM = 10

SECONDS_FOR_CACHE_GREET = None  # keep cache permanently

# for chat app - photo
DELETE_PHOTO_LEAVING_ROOM = False
DELETE_PHOTO_AFTER_TIME = False
CERTAIN_TIME_FOR_DELETE_PHOTO = 24 * 15  # the all photos in room are removed every 15 days
MAXIMUM_FOR_DELETE_PHOTO = 30  # each players in single room at most save 30 pieces of photo

# for SMTP
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('GMAIL')
EMAIL_HOST_PASSWORD = os.getenv('GMAIL_FOR_MAC_MAIL')
EMAIL_FROM = 'A-LARP管理員 <'+EMAIL_HOST_USER+'>'

# for chat app - signup
SECONDS_FOR_CACHE_TOKEN = 1800  # for activate
SECONDS_FOR_CACHE_EMAIL = 600  # for signup mail and reset_pwd mail

# for chat app - roomtime
ROOMTIME_MIN = {  # only 2 players in game, they(could be male and female) can stay in room 60 mins
    2: int(os.getenv('ROOMTIME_MIN_2_PLR')),
    3: int(os.getenv('ROOMTIME_MIN_3_PLR')),
    4: int(os.getenv('ROOMTIME_MIN_4_PLR')),
    5: int(os.getenv('ROOMTIME_MIN_5_PLR')),
    6: int(os.getenv('ROOMTIME_MIN_6_PLR')),
    7: int(os.getenv('ROOMTIME_MIN_7_PLR')),
    8: int(os.getenv('ROOMTIME_MIN_8_PLR')),
    100: 1  # for test mode
}

# for chat app - prologtime
PROLOG_SEC = 12  # use prolog time to introduce the game rule
PROLOG_SEC_PER_PLAYER = 4  # more are players, longer prolog time is.

# for chat app - num of questions
QUESTION_NUM = 5
QUESTION_INTERVAL_SEC = 60
REPLY_INTERVAL_SEC = 30
