from django.shortcuts import render


def home(request, message=None):
    """
    Serves up the homepage
    """
    content = {'message': message}
    return render(request, 'index.html', context=content)

def services(request, message=None):
    """
    Serves up the services page
    """
    content = {'message': message}
    return render(request, 'services.html', context=content)

def contact(request, message=None):
    """
    Serves up the contact page
    """
    content = {'message': message}
    return render(request, 'contact.html', context=content)

def form_handler(request, message=None):
    """
    Take form inputs
    """
    name = request.POST['name']
    email = request.POST['email']
    phone_number = request.POST['phone_number']
    city = request.POST['city']
    state = request.POST['state']
    zip = request.POST['zip']
    subject = request.POST['subject']
    form_message = request.POST['message']

    message = {'status': 'success', 'content': 'Thank you for reaching out! We will be in touch soon'}

    content = {'message': message}
    return render(request, 'index.html', context=content)

