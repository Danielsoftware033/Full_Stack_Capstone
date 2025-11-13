import os 

class DevelopmentConfig():
	SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
	DEBUG = True     
  #notice that it said .config on the main app file
##create TestingConfig and ProductionConfig classes as placeholders and use pass


class ProductionConfig():
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') or 'sqlite:///dev.db'