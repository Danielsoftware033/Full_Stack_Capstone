from app.extensions import ma #from app 1st because extensions is within app folder
from app.models import Users


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Users      #Creates a schema that validates the data as defined by our Users Model
user_schema = UserSchema() #Creating an instance of my schema that I can actually use to validate, deserialize, and serialize JSON
users_schema = UserSchema(many=True) #Allows this schema to handle a list of users
login_schema = UserSchema(exclude=['username','DOB','address','role'])