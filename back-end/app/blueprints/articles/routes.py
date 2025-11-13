from app.blueprints.articles import articles_bp
from .schemas import article_schema, articles_schema
from app.blueprints.users.schemas import user_schema
from flask import request, jsonify, render_template
from app.models import Articles, Users, db, saved_articles
from app.util.auth import encode_token, token_required
import requests, os 
from datetime import datetime, timedelta, timezone
from sqlalchemy import func



bias_map = {
    "ABC News": "Left-Leaning",
    "Associated Press": "Center",
    "AP News": "Left-Leaning",
    "Bloomberg": "Left-Leaning",
    "Business Insider": "Left-Leaning",
    "CBS News": "Left-Leaning",
    "CNBC": "Left-Leaning",
    "CNN": "Left-Leaning",
    "Fox News": "Right-Leaning",
    "Fox Business": "Right-Leaning",
    "The Guardian": "Left-Leaning",
    "The New York Times": "Left-Leaning",
    "The Washington Post": "Left-Leaning",
    "NPR": "Center",
    "Newsweek": "Center",
    "Reuters": "Center",
    "U.S. News & World Report": "Center",
    "Politico": "Left-Leaning",
    "The Atlantic": "Left-Leaning",
    "The Boston Globe": "Left-Leaning",
    "Los Angeles Times": "Left-Leaning",
    "The Dallas Morning News": "Center",
    "Washington Examiner": "Right-Leaning",
    "Newsmax": "Right-Leaning",
    "Breitbart News Network": "Right-Leaning",
    "The American Conservative": "Right-Leaning",
    "New York Post": "Right-Leaning",
    "The Dispatch": "Right-Leaning",
    "Slate": "Left-Leaning",
    "The Daily Beast": "Left-Leaning",
    "Rolling Stone": "Left-Leaning",
    "ABC17News.com": "Center",
    "ABC7 Chicago": "Center",
    "AL.com": "Center",
    "Activist Post": "Right-Leaning",
    "Al Jazeera": "Left-Leaning",
    "Atlanta Black Star": "Left-Leaning",
    "BBC": "Center",
    "Baltimore News": "Center",
    "Block Club Chicago": "Left-Leaning",
    "Boulder Daily Camera": "Center",
    "Deadline": "Left-Leaning",
    "EL PAÍS": "Center",
    "Essentially Sports": "Center",
    "Euronews.com": "Center",
    "Forbes": "Center",
    "Fortune": "Center",
    "Hartford Courant": "Center",
    "HuffPost": "Left-Leaning",
    "International Business Times": "Left-Leaning",
    "KABC-TV": "Center",
    "KFF Health News": "Left-Leaning",
    "KHOU": "Center",
    "Live 5 News WCSC": "Center",
    "MLive.com": "Center",
    "MSNBC": "Left-Leaning",
    "NBC 5 Chicago": "Center",
    "NBC News": "Left-Leaning",
    "NBC10 Boston": "Center",
    "NJ.com": "Center",
    "Natural News": "Right-Leaning",
    "New Jersey Globe": "Center",
    "Norfolk Virginian-Pilot": "Center",
    "Oregon Public Broadcasting - OPB": "Center",
    "OregonLive.com": "Center",
    "PBS News": "Center",
    "Pittsburgh Tribune-Review": "Right-Leaning",
    "Raw Story": "Left-Leaning",
    "Reading Eagle": "Center",
    "Santa Ana Orange County Register": "Center",
    "Shaw Local Enewspapers": "Center",
    "Spectrum Bay News 9": "Center",
    "Springfield News-Leader": "Center",
    "St. Paul Pioneer Press": "Center",
    "Star Tribune": "Center",
    "Staten Island Advance": "Center",
    "Talking Points Memo": "Left-Leaning",
    "The Associated Press": "Center",
    "The Atlanta Journal-Constitution": "Left-Leaning",
    "The Boston Herald": "Right-Leaning",
    "The Mercury News": "Center",
    "The Philadelphia Inquirer": "Left-Leaning",
    "The Texas Tribune": "Center",
    "The Times of India": "Center",
    "UPI News": "Center",
    "USA TODAY": "Center",
    "WDIV ClickOnDetroit": "Center",
    "WEAU": "Center",
    "WHAS11": "Center",
    "WHIO-TV": "Center",
    "WIRED": "Left-Leaning",
    "WIS10": "Center",
    "WJLA": "Center",
    "WTOP": "Center",
    "ZeroHedge": "Right-Leaning",
    "abcnews.go.com": "Left-Leaning",
    "cleveland.com": "Center",
    "dw.com": "Center",
    "syracuse.com": "Center",
    "vox.com": "Left-Leaning"
}


# @articles_bp.route('/homepage', methods=['GET'])
# def get_homepage_articles():
#     articles = db.session.query(Articles).filter(Articles.bias_category != 'Unknown').all()
#     return articles_schema.jsonify(articles), 200



@articles_bp.route('/bias/<string:bias>', methods=['GET'])
def get_articles_by_bias(bias):
    articles = db.session.query(Articles).filter(Articles.bias_category.ilike(f"%{bias}%")).all()
    return articles_schema.jsonify(articles), 200



@articles_bp.route('', methods=['GET'])
@token_required
def get_saved_articles():
    user = db.session.get(Users, request.user_id)

    return jsonify({
        "message": "Successfully fetched saved articles",
        "user": user_schema.dump(user),
        "saved_articles": articles_schema.dump(user.saved_articles)
    }), 200



@articles_bp.route('/add/<int:article_id>', methods=['PUT'])
@token_required
def add_saved_article(article_id):
    user = db.session.get(Users, request.user_id)
    article = db.session.get(Articles, article_id)

    if article not in user.saved_articles:
        user.saved_articles.append(article)
        db.session.commit()
        return jsonify({
            'message': f'Successfully added "{article.title}" to saved articles',
            'user': user_schema.dump(user),
            'saved_articles': articles_schema.dump(user.saved_articles)
        }), 200

    return jsonify("This article is already in saved articles"), 400


@articles_bp.route('/remove/<int:article_id>', methods=['PUT'])
@token_required
def remove_saved_article(article_id):
    user = db.session.get(Users, request.user_id)
    article = db.session.get(Articles, article_id)

    if article in user.saved_articles:
        user.saved_articles.remove(article)
        db.session.commit()
        return jsonify({
            'message': f'Successfully removed "{article.title}" from saved articles',
            'user': user_schema.dump(user),
            'saved_articles': articles_schema.dump(user.saved_articles)
        }), 200

    return jsonify("This article is not in saved articles"), 400


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


@articles_bp.route('/remove-duplicates', methods=['GET', 'POST'])
def remove_duplicates():
    """Remove duplicate articles from database, keeping only the most recent one for each URL"""
    # Find all URLs that have duplicates
    duplicate_urls = db.session.query(Articles.url, func.count(Articles.id).label('count'))\
        .group_by(Articles.url)\
        .having(func.count(Articles.id) > 1)\
        .all()
    
    removed_count = 0
    
    for url, count in duplicate_urls:
        # Get all articles with this URL, ordered by ID (keep the first/oldest one)
        articles = db.session.query(Articles)\
            .filter(Articles.url == url)\
            .order_by(Articles.id.asc())\
            .all()
        
        # Delete all but the first one
        for article in articles[1:]:
            db.session.delete(article)
            removed_count += 1
    
    db.session.commit()
    
    return jsonify({
        "message": "Duplicates removed successfully",
        "duplicate_urls_found": len(duplicate_urls),
        "articles_removed": removed_count
    }), 200


@articles_bp.route('/fetch', methods=['GET'])
def fetch_articles():

    api_key = os.getenv("GNEWS_API_KEY")

    url = f'https://gnews.io/api/v4/top-headlines?category=nation&lang=en&country=us&max=50&apikey={api_key}'
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"message": "Failed to fetch news"}), response.status_code

    data = response.json().get('articles', [])
    if not data:
        return jsonify({"message": "No articles found"}), 404

    articles_added = []
    duplicates_skipped = 0

    for a in data:
        article_url = a.get('url')
        
        # Check if article already exists by URL
        existing_article = db.session.query(Articles).filter(Articles.url == article_url).first()
        if existing_article:
            duplicates_skipped += 1
            continue
        
        source_name = a.get('source', {}).get('name', '')
        bias = bias_map.get(source_name, 'Unknown')

        published_str = a.get('publishedAt')
        published_at = None
        if published_str:
            try:
                published_at = datetime.strptime(published_str, "%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                published_at = None  

        new_article = Articles(    #new instance of Articles class
            title=a.get('title'),
            source_name=source_name,
            url=article_url,
            description=a.get('description'),
            content=a.get('content'),
            image_url=a.get('image'),
            published_at=published_at,
            bias_category=bias
        )
        db.session.add(new_article)
        articles_added.append(new_article)

    db.session.commit()
    return jsonify({
        "message": "Fetch complete",
        "added": len(articles_added),
        "duplicates_skipped": duplicates_skipped,
        "articles": articles_schema.dump(articles_added)
    }), 201


@articles_bp.route('/search', methods=['GET'])     # used a combination of gnews.io documents, myself and copilot suggestion for the api function
def search_articles():
    query = request.args.get('q')
    if not query:
        return jsonify({"message": "Please provide a search query"}), 400

    api_key = os.getenv("GNEWS_API_KEY")

    url = f'https://gnews.io/api/v4/search?q={query}&lang=en&country=us&max=50&apikey={api_key}'
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




# copilot helped me figure out how to implement the refresh endpoint
@articles_bp.route('/refresh', methods=['POST'])
@token_required
def refresh_articles():
#    Refresh articles in the DB.

#     - Deletes articles older than 24 hours that are not saved by any user.
#     - Fetches up to `target_total` fresh articles from GNews (paged), avoids duplicates by URL.

#     Protected by token_required; consider restricting to admin users in production.
  
    # Configurable parameters
    try:
        target_total = int(request.args.get('target', 1000))
    except ValueError:
        target_total = 1000
    per_page = int(request.args.get('per_page', 50))
    max_pages = int(request.args.get('max_pages', (target_total // per_page) + 1))

    # 1) Delete old (24h) articles that are not saved by any user
    cutoff = datetime.now(timezone.utc) - timedelta(days=1)
    # subquery of saved article ids
    saved_ids = db.session.query(saved_articles.c.article_id).distinct()
    # delete articles older than cutoff and not in saved_ids
    old_q = db.session.query(Articles).filter(Articles.published_at != None)
    old_q = old_q.filter(Articles.published_at < cutoff)
    old_q = old_q.filter(~Articles.id.in_(saved_ids))
    deleted = old_q.delete(synchronize_session=False)

    db.session.commit()

    # 2) Fetch fresh articles from GNews in pages until we hit target_total
    api_key = os.getenv('GNEWS_API_KEY') 
    inserted = 0
    seen_urls = set(r[0] for r in db.session.query(Articles.url).all())

    for page in range(1, max_pages + 1):
        if inserted >= target_total:
            break
        params = {
            'category': 'nation',
            'lang': 'en',
            'country': 'us',
            'max': per_page,
            'page': page,
            'apikey': api_key
        }
        try:
            resp = requests.get('https://gnews.io/api/v4/top-headlines', params=params, timeout=10)
        except Exception as e:
            return jsonify({'message': 'Failed to contact GNews', 'error': str(e)}), 502

        if resp.status_code != 200:
            break

        items = resp.json().get('articles', [])
        if not items:
            break

        for a in items:
            if inserted >= target_total:
                break
            u = a.get('url')
            if not u or u in seen_urls:
                continue

            source_name = a.get('source', {}).get('name', '')
            bias = bias_map.get(source_name, 'Unknown')
            published_str = a.get('publishedAt')
            published_at = None
            if published_str:
                try:
                    published_at = datetime.strptime(published_str, "%Y-%m-%dT%H:%M:%SZ")
                except ValueError:
                    published_at = None

            new_article = Articles(
                title=a.get('title'),
                source_name=source_name,
                url=u,
                description=a.get('description'),
                content=a.get('content'),
                image_url=a.get('image'),
                published_at=published_at,
                bias_category=bias
            )
            db.session.add(new_article)
            seen_urls.add(u)
            inserted += 1

        # commit per-page to avoid too large transactions
        db.session.commit()

    return jsonify({'message': 'Refresh complete', 'inserted': inserted, 'deleted_old': deleted}), 200

# copilot helped me figure out how to implement the homepage balanced endpoint, we've replaced my original fetch articles function
@articles_bp.route('/homepage_balanced', methods=['GET'])
def homepage_balanced():
    """Return a balanced selection from DB: take N per bias category (recent first).

    Query params:
      left, center, right -> integers for how many from each (default 5)
    """
    # If caller provided explicit left/center/right, use those values.
    left_arg = request.args.get('left')
    center_arg = request.args.get('center')
    right_arg = request.args.get('right')

    if left_arg is not None or center_arg is not None or right_arg is not None:
        left_n = int(request.args.get('left', 5))
        center_n = int(request.args.get('center', 5))
        right_n = int(request.args.get('right', 5))
    else:
        # Proportional mode: compute available counts and use the minimum available across
        # Left, Center, Right so each category shows at most that many articles.
        count_left = db.session.query(func.count(Articles.id)).filter(Articles.bias_category == 'Left-Leaning').scalar() or 0
        count_center = db.session.query(func.count(Articles.id)).filter(Articles.bias_category == 'Center').scalar() or 0
        count_right = db.session.query(func.count(Articles.id)).filter(Articles.bias_category == 'Right-Leaning').scalar() or 0

        # If none are available, return empty list
        if count_left == 0 and count_center == 0 and count_right == 0:
            return articles_schema.jsonify([]), 200

        # Use the smallest non-zero count as the proportional target; if one of them is zero,
        # use the smallest of the non-zero counts so we still show some items.
        counts = [c for c in (count_left, count_center, count_right) if c > 0]
        if counts:
            min_count = int(min(counts))
        else:
            min_count = 0

        left_n = min_count
        center_n = min_count
        right_n = min_count

    # Query the DB for the selected counts
    left = db.session.query(Articles).filter(Articles.bias_category == 'Left-Leaning').order_by(Articles.published_at.desc()).limit(left_n).all()
    center = db.session.query(Articles).filter(Articles.bias_category == 'Center').order_by(Articles.published_at.desc()).limit(center_n).all()
    right = db.session.query(Articles).filter(Articles.bias_category == 'Right-Leaning').order_by(Articles.published_at.desc()).limit(right_n).all()

    selected = []
    selected.extend(left)
    selected.extend(center)
    selected.extend(right)

    # If we have shortfalls (e.g., not enough in one category), fill from Unknown by recency
    total_needed = left_n + center_n + right_n
    if len(selected) < total_needed:
        needed = total_needed - len(selected)
        unknown = db.session.query(Articles).filter((Articles.bias_category == None) | (Articles.bias_category == 'Unknown')).order_by(Articles.published_at.desc()).limit(needed).all()
        for u in unknown:
            if len(selected) >= total_needed:
                break
            selected.append(u)

    return articles_schema.jsonify(selected), 200










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