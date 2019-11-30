#!/bin/bash
#
# Remove the development settings, migrate the database and configure the admin
#

rm project/settings/development.py

sleep 2s

python3 manage.py makemigrations
python3 manage.py migrate

sleep 2s

echo 'from django.contrib.auth.models import User; \
      User.objects.create_superuser('\""$ADMIN_USER"\"', \
                                    '\""$ADMIN_USER_EMAIL"\"', \
                                    '\""$ADMIN_USER_PASSWORD"\"')' \
      | python3 manage.py shell

# Kick off UWSGI
/usr/local/bin/uwsgi --ini /opt/argos/uwsgi.ini
