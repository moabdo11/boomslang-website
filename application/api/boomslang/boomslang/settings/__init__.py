from .base import *

try:
    from .development import *
    production = False
    print('DEV ENV')
except Exception as e:
    production = True
if production:
    from .production import *
    print('PROD ENV')
