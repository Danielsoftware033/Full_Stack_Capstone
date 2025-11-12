from app.extensions import ma 
from app.models import ForumPosts
from app.blueprints.users.schemas import UserSchema


class ForumPostSchema(ma.SQLAlchemyAutoSchema):
    user = ma.Nested(UserSchema)

    class Meta:
        model = ForumPosts
        include_fk = True

forum_post_schema = ForumPostSchema(exclude=['user_id']) 
forum_posts_schema = ForumPostSchema(many=True, exclude=['user_id'])