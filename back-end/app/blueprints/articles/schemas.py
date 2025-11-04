from app.extensions import ma 
from app.models import Articles


class ArticleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Articles  
article_schema = ArticleSchema() 
articles_schema = ArticleSchema(many=True)