from django.shortcuts import render


def home(request):
    """
    Serves up the homepage
    """
    content = {}
    return render(request, 'index.html', context=content)

def services(request):
    """
    Serves up the services page
    """
    content = {}
    return render(request, 'services.html', context=content)
