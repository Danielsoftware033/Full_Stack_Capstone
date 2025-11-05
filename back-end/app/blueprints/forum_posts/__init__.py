from flask import Blueprint

forum_posts_bp = Blueprint('forum_posts_bp', __name__)

from . import routes     