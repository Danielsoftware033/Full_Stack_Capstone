from app.extensions import ma 
from app.models import ForumPosts


class ForumPostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ForumPosts
        include_fk = True

forum_post_schema = ForumPostSchema() 
forum_posts_schema = ForumPostSchema(many=True)