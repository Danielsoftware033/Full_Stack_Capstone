from app.blueprints.articles import articles_bp
from .schemas import article_schema, articles_schema
from flask import request, jsonify, render_template
from app.models import Articles, db
from app.util.auth import encode_token, token_required
import requests, os 
from datetime import datetime

bias_map = {
    "ABC News": "Left-Leaning",
    "AlterNet": "Left-Leaning",
    "The Atlantic": "Left-Leaning",
    "Bloomberg": "Left-Leaning",
    "CBS News": "Left-Leaning",
    "CNN": "Left-Leaning",
    "Democracy Now": "Left-Leaning",
    "Huffpost": "Left-Leaning",
    "Insider": "Left-Leaning",
    "Jacobin": "Left-Leaning",
    "Mother Jones": "Left-Leaning",
    "MSNBC": "Left-Leaning",
    "NPR": "Left-Leaning",
    "POLITICO": "Left-Leaning",
    "ProPublica": "Left-Leaning",
    "Slate": "Left-Leaning",
    "The Daily Beast": "Left-Leaning",
    "The Guardian": "Left-Leaning",
    "The Intercept": "Left-Leaning",
    "The Nation": "Left-Leaning",
    "The New Yorker": "Left-Leaning",
    "The New York Times": "Left-Leaning",
    "The Washington Post": "Left-Leaning",
    "TIME Magazine": "Left-Leaning",
    "USA Today": "Left-Leaning",
    "Vox": "Left-Leaning",
    "Yahoo News": "Left-Leaning",
    "The Associated Press News": "Left-Leaning",
    "Axios": "Center",
    "BBC News": "Center",
    "The Christian Science Monitor": "Center",
    "Forbes": "Center",
    "MarketWatch": "Center",
    "NewsNation": "Center",
    "Newsweek": "Center",
    "RealClearPolitics": "Center",
    "Reuters": "Center",
    "The Hill": "Center",
    "The Wall Street Journal": "Center",
    "The American Conservative": "Right-Leaning",
    "The American Spectator": "Right-Leaning",
    "The Christian Broadcasting Network": "Right-Leaning",
    "The Daily Caller": "Right-Leaning",
    "The Daily Mail": "Right-Leaning",
    "The Daily Wire": "Right-Leaning",
    "The Dispatch": "Right-Leaning",
    "The Epoch Times": "Right-Leaning",
    "Fox Business": "Right-Leaning",
    "Fox News": "Right-Leaning",
    "Independent Journal Review": "Right-Leaning",
    "Reason": "Right-Leaning",
    "The Federalist": "Right-Leaning",
    "The New York Post": "Right-Leaning",
    "The New York Post-Opinion": "Right-Leaning",
    "The Wall Street Journal-Opinion": "Right-Leaning",
    "The Washington Examiner": "Right-Leaning",
    "The Washington Free Beacon": "Right-Leaning",
    "The Washington Times": "Right-Leaning",
    "Newsmax": "Right-Leaning",
    "One America News Network": "Right-Leaning",
    "The Post Millennial": "Right-Leaning",
    "Breitbart": "Right-Leaning",
    "Blaze Media": "Right-Leaning"
}



@articles_bp.route('/homepage', methods=['GET'])
def get_homepage_articles():
    articles = db.session.query(Articles).filter(Articles.bias_category != 'Unknown').all()
    return articles_schema.jsonify(articles), 200



@articles_bp.route('/bias/<string:bias>', methods=['GET'])
def get_articles_by_bias(bias):
    # Example: /articles/bias/Left
    articles = db.session.query(Articles).filter(Articles.bias_category.ilike(f"%{bias}%")).all()
    return articles_schema.jsonify(articles), 200



@articles_bp.route('/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article = db.session.get(Articles, article_id)
    if not article:
        return jsonify({"message": "Article not found"}), 404
    return article_schema.jsonify(article), 200



@articles_bp.route('/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    article = db.session.get(Articles, article_id)
    if not article:
        return jsonify({"message": "Article not found"}), 404

    db.session.delete(article)
    db.session.commit()
    return jsonify({"message": f"Successfully deleted article {article_id}"}), 200



@articles_bp.route('/fetch', methods=['GET'])    # used a combination of gnews.io documents, myself and copilot suggestion for the api function
def fetch_articles():

    # api_key = os.getenv("GNEWS_API_KEY")
    api_key = '3874d035209a3cb9b3bcaade67a45222'


    url = f'https://gnews.io/api/v4/top-headlines?category=nation&lang=en&country=us&apikey={api_key}'
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"message": "Failed to fetch news"}), response.status_code

    data = response.json().get('articles', [])
    if not data:
        return jsonify({"message": "No articles found"}), 404

    articles_added = []

    for a in data:
        source_name = a.get('source', {}).get('name', '')
        bias = bias_map.get(source_name, 'Unknown')

        published_str = a.get('publishedAt')
        published_at = None
        if published_str:         #copilot suggestion to parse given api date format to a datetime object as defined in my articles model
            try:
                published_at = datetime.strptime(published_str, "%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                published_at = None  

        new_article = Articles(    #new instance of Articles class
            title=a.get('title'),
            source_name=source_name,
            url=a.get('url'),
            description=a.get('description'),
            content=a.get('content'),
            image_url=a.get('image'),
            published_at=published_at,
            bias_category=bias

        )
        db.session.add(new_article)
        articles_added.append(new_article)

    db.session.commit()
    return articles_schema.jsonify(articles_added), 201



@articles_bp.route('/search', methods=['GET'])     # used a combination of gnews.io documents, myself and copilot suggestion for the api function
def search_articles():
    query = request.args.get('q')
    if not query:
        return jsonify({"message": "Please provide a search query"}), 400

    api_key = '3874d035209a3cb9b3bcaade67a45222'

    url = f'https://gnews.io/api/v4/search?q={query}&lang=en&country=us&max=20&apikey={api_key}'
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"message": "Failed to fetch news"}), response.status_code

    data = response.json().get('articles', [])
    if not data:
        return jsonify({"message": "No articles found"}), 404

    articles_added = []


    for a in data:
        source_name = a.get('source', {}).get('name', '')
        bias = bias_map.get(source_name, 'Unknown')

        published_str = a.get('publishedAt')
        published_at = None
        if published_str:
            try:
                published_at = datetime.strptime(published_str, "%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                published_at = None

        existing_article = db.session.query(Articles).filter(Articles.url == a.get('url')).first()
        if existing_article:
            articles_added.append(existing_article)
            continue

        new_article = Articles(
            title=a.get('title'),
            source_name=source_name,
            url=a.get('url'),
            description=a.get('description'),
            content=a.get('content'),
            image_url=a.get('image'),
            published_at=published_at,
            bias_category=bias
        )
        db.session.add(new_article)
        articles_added.append(new_article)

    db.session.commit()
    return articles_schema.jsonify(articles_added), 201


# @articles_bp.route('', methods=['POST'])      #maybe will use in the future for admin purposes
# def create_article():
#     try:
#         data = article_schema.load(request.json)
#     except ValidationError as e:
#         return jsonify(e.messages), 400

#     # Assign bias if source matches known outlets
#     source_name = data.get('source', '')
#     data['bias'] = bias_map.get(source_name, 'Unknown')

#     new_article = Articles(**data)
#     db.session.add(new_article)
#     db.session.commit()
#     return article_schema.jsonify(new_article), 201



# @articles_bp.route('', methods=['GET'])      #maybe will use in the future for admin purposes
# def get_articles():
#     articles = db.session.query(Articles).all()
#     return articles_schema.jsonify(articles), 200



# @articles_bp.route('/<int:article_id>', methods=['PUT'])  #maybe to fix content on the article
# def update_article(article_id):
#     article = db.session.get(Articles, article_id)
#     if not article:
#         return jsonify({"message": "Article not found"}), 404

#     try:
#         data = article_schema.load(request.json)
#     except ValidationError as e:
#         return jsonify(e.messages), 400

#     source_name = data.get('source', '')
#     data['bias'] = bias_map.get(source_name, 'Unknown')

#     for key, value in data.items():
#         setattr(article, key, value)

#     db.session.commit()
#     return article_schema.jsonify(article), 200