#  create a post, all posts for a topic (paginated), update a post (user only), delete a post (user only), search posts by keyword
from app.blueprints.forum_posts import forum_posts_bp
from .schemas import forum_post_schema, forum_posts_schema
from flask import request, jsonify
from marshmallow import ValidationError
from app.models import ForumPosts, Users, db
from app.util.auth import token_required
from sqlalchemy import select



@forum_posts_bp.route('', methods=['POST'])
@token_required
def create_post():
    user = db.session.get(Users, request.user_id)

    try:
        data = forum_post_schema.load(request.json)  
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_post = ForumPosts(**data, user_id=user.id)   #used copilot to know how to use token_required in unpacking user's data 
    db.session.add(new_post)
    db.session.commit()

    return jsonify({
        "message": "Successfully created post",
        "posts": forum_posts_schema.dump(user.posts)
    }), 201



@forum_posts_bp.route('/topic/<int:topic_id>', methods=['GET'])
def get_posts_by_topic(topic_id):
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        query = select(ForumPosts).where(ForumPosts.topic_id == topic_id)
        posts = db.paginate(query, page=page, per_page=per_page)
        return forum_posts_schema.jsonify(posts), 200
    except:
        posts = db.session.query(ForumPosts).filter(ForumPosts.topic_id == topic_id).all()
        return forum_posts_schema.jsonify(posts), 200



@forum_posts_bp.route('/<int:post_id>', methods=['PUT'])
@token_required
def update_post(post_id):
    post = db.session.get(ForumPosts, post_id)
    user_id = request.user_id

    if not post:
        return jsonify({"message": "Post not found"}), 404

    if user_id != post.user_id:
        return jsonify({"error": "Access denied"}), 403

    try:
        data = forum_post_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    for key, value in data.items():
        setattr(post, key, value)

    db.session.commit()
    return jsonify({
        "message": "Successfully updated post",
        "post": forum_post_schema.dump(post)
    }), 200



@forum_posts_bp.route('/<int:post_id>', methods=['DELETE'])
@token_required
def delete_post(post_id):
    post = db.session.get(ForumPosts, post_id)
    user_id = request.user_id

    if not post:
        return jsonify({"message": "Post not found"}), 404

    if user_id != post.user_id:
        return jsonify({"error": "Access denied"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Successfully deleted post"}), 200



@forum_posts_bp.route('/search', methods=['GET'])
def search_posts():
    keyword = request.args.get('q')
    
    posts = db.session.query(ForumPosts).where(ForumPosts.content.ilike(f"%{keyword}%")).all()

    return forum_posts_schema.jsonify(posts), 200








