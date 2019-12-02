"""
Production settings for Boomslang.

These settings are defined explicitly for when the project is running in a
production environment.
"""

import os


DEBUG = False

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['POSTGRES_DB_NAME'],
        'USER': os.environ['POSTGRES_DB_USER'],
        'PASSWORD': os.environ['POSTGRES_DB_PASSWORD'],
        'HOST': 'postgresql',
        'PORT': 5432
    }
}
