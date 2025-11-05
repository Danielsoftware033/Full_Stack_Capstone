from app.extensions import ma 
from app.models import ForumTopics


class ForumTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ForumTopics  
        include_fk = True

forum_topic_schema = ForumTopicSchema() 
forum_topics_schema = ForumTopicSchema(many=True)
create_topic_schema = ForumTopicSchema(exclude=['user_id'])
create_topics_schema = ForumTopicSchema(exclude=['user_id'])