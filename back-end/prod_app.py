from app.models import db
from app import create_app

app = create_app('ProductionConfig') #remember that create_app takes in the config type

with app.app_context():
	# db.drop_all()
	db.create_all() #Creating our database tables
	

