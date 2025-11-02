from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Date, Integer, String, ForeignKey
from datetime import date

class Base(DeclarativeBase):
    pass

#Instantiate db and set Base model
db = SQLAlchemy(model_class=Base)


