from flask import Blueprint

articles_bp = Blueprint('articles_bp', __name__)

from . import routes       # from folder, import routes (the period means folder I'm in)