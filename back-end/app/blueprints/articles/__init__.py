from flask import Blueprint

articles_bp = Blueprint('articles_bp', __name__)

from . import routes       