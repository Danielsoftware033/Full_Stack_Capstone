from flask import Flask
from .models import db  # .models means it's coming from same folder/ db means import db from that models file
from .extensions import ma

def create_app(config_name): #the config_name can be like development, testing, ect.
		
		app = Flask(__name__) #creating base app
		
		app.config.from_object(f'config.{config_name}')
		#initialize extensions (plugging them in)
		
		db.init_app(app)  
		ma.init_app(app)
		
		return app  