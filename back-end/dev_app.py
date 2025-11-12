from app.models import db
from app import create_app
from app.blueprints.articles.routes import fetch_articles


app = create_app('DevelopmentConfig') #remember that create_app takes in the config type


with app.app_context():
	# db.drop_all()
	db.create_all() #Creating our database tables


    
app.run()
