from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Column, Date, Integer, String, ForeignKey, DateTime, Table, Text 
from datetime import date, datetime, timezone


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class = Base)

#association table
saved_articles = Table(
    'saved_articles',
    Base.metadata,
    Column('user_id', ForeignKey('users.id'), primary_key=True),
    Column('article_id', ForeignKey('articles.id'), primary_key=True),
    Column('saved_at', DateTime, default=datetime.now(timezone.utc))
)


class Users(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    username: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(250), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    political_leaning: Mapped[str] = mapped_column(String(20), nullable=True)  # left-leaning, center, right-leaning, uncertain 
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), nullable=False) #used copilot suggestion to add timezone info


    saved_articles: Mapped[list['Articles']] = relationship('Articles', secondary=saved_articles, back_populates='users_saved')
    topics: Mapped[list['ForumTopics']] = relationship('ForumTopics', back_populates='user')
    posts: Mapped[list['ForumPosts']] = relationship('ForumPosts', back_populates='user')


class Articles(Base):
    __tablename__ = 'articles'

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=True)   #Copilot suggested I use Text datatype for content field, since it can be longer without limit.
    source_name: Mapped[str] = mapped_column(String(300), nullable=True)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    bias_category: Mapped[str] = mapped_column(String(20), nullable=True)  
    published_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)


    users_saved: Mapped[list['Users']] = relationship('Users', secondary=saved_articles, back_populates='saved_articles')


class ForumTopics(Base):
    __tablename__ = 'forum_topics'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc), nullable=False)


    user: Mapped['Users'] = relationship('Users', back_populates='topics')
    posts: Mapped[list['ForumPosts']] = relationship('ForumPosts', back_populates='topic')


#association model
class ForumPosts(Base):
    __tablename__ = 'forum_posts'

    id: Mapped[int] = mapped_column(primary_key=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey('forum_topics.id'), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(timezone.utc))


    topic: Mapped['ForumTopics'] = relationship('ForumTopics', back_populates='posts')
    user: Mapped['Users'] = relationship('Users', back_populates='posts')