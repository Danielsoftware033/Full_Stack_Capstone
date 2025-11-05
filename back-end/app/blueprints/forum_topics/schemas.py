from app.extensions import ma #from app 1st because extensions is within app folder
from app.models import ForumTopics


class ForumTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ForumTopics  
        include_fk = True

forum_topic_schema = ForumTopicSchema() 
forum_topics_schema = ForumTopicSchema(many=True)