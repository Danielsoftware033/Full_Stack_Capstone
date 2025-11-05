from flask import Blueprint

forum_topics_bp = Blueprint('forum_topics_bp', __name__)

from . import routes     