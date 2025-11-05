from flask import Flask
from .models import db  # .models means it's coming from same folder/ db means import db from that models file
from .extensions import ma
from .blueprints.users import users_bp
from .blueprints.articles import articles_bp
from .blueprints.forum_topics import forum_topics_bp
from .blueprints.forum_posts import forum_posts_bp


def create_app(config_name): #the config_name can be like development, testing, ect.
		
		app = Flask(__name__) #creating base app
		
		app.config.from_object(f'config.{config_name}')
		
		db.init_app(app)  
		ma.init_app(app)

		app.register_blueprint(users_bp, url_prefix='/users') #the url prefix is the plural form of class tables 
		app.register_blueprint(articles_bp, url_prefix='/articles')
		app.register_blueprint(forum_topics_bp, url_prefix='/forum_topics')
		app.register_blueprint(forum_posts_bp, url_prefix='/forum_posts')
		
		return app  