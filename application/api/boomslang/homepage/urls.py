from django.conf.urls import url

from . import views as homepage


urlpatterns = [
    url('', homepage.home)
]
