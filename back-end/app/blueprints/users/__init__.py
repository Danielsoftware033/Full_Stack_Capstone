from flask import Blueprint
#make an instance of blueprint class
users_bp = Blueprint('users_bp', __name__)

from . import routes       # from folder, import routes (the period means folder I'm in)