"""
Development settings for boomslang

These settings are defined explicitly for when the project is running in
a development environment.
"""

import os
from .base import BASE_DIR


# Set server to run in debug mode
DEBUG = True

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
