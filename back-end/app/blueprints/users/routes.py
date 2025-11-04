from app.blueprints.users import users_bp
from .schemas import user_schema, users_schema, login_schema, articles_schema
from flask import request, jsonify, render_template
from marshmallow import ValidationError
from app.models import Users, Articles, db
from werkzeug.security import generate_password_hash, check_password_hash
from app.util.auth import encode_token, token_required



@users_bp.route('/login', methods=['POST'])
def login():
    try:
        data = login_schema.load(request.json)  
    except ValidationError as e:
        return jsonify(e.messages), 400

    user = db.session.query(Users).where(Users.email == data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = encode_token(user.id)
        return jsonify({
            "message": f"Welcome {user.username}",
            "token": token
        }), 200

    return jsonify({"message": "Invalid email or password!"}), 403



@users_bp.route('', methods=['POST'])
def create_user():
    try:
        data = user_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    # Check if email is taken
    if db.session.query(Users).where(Users.email == data['email']).first():
        return jsonify({"message": "Email is already taken"}), 400

    # Hash password
    data['password'] = generate_password_hash(data['password'])

    new_user = Users(**data)
    db.session.add(new_user)
    db.session.commit()
    return user_schema.jsonify(new_user), 201



@users_bp.route('', methods=['GET'])
def read_users():
    users = db.session.query(Users).all()
    return users_schema.jsonify(users), 200



@users_bp.route('/profile', methods=['GET'])
@token_required
def read_user():
    user_id = request.user_id
    user = db.session.get(Users, user_id)
    return user_schema.jsonify(user), 200



@users_bp.route('', methods=['PUT'])
@token_required
def update_user():
    user_id = request.user_id
    user = db.session.get(Users, user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        user_data = user_schema.load(request.json)
    except ValidationError as e:
        return jsonify({"message": e.messages}), 400

    if 'password' in user_data:
        user_data['password'] = generate_password_hash(user_data['password'])

    for key, value in user_data.items():
        setattr(user, key, value)

    db.session.commit()
    return user_schema.jsonify(user), 200



@users_bp.route('', methods=['DELETE'])
def delete_user():
    user_id = request.user_id
    user = db.session.get(Users, user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"Successfully deleted user {user_id}"}), 200



@users_bp.route('/<int:user_id>/save-article/<int:article_id>', methods=['PUT'])
def save_article(user_id, article_id):
    user = db.session.get(Users, user_id)
    article = db.session.get(Articles, article_id)

    if article not in user.saved_articles:  
        user.saved_articles.append(article) 
        db.session.commit()
        return jsonify({
            'message': f'Successfully saved "{article.title}" for {user.username}',
            'user': user_schema.dump(user),
            'saved_articles': articles_schema.dump(user.saved_articles)
        }), 200

    return jsonify("This article is already saved"), 400


@users_bp.route('/<int:user_id>/remove-article/<int:article_id>', methods=['PUT'])
def remove_saved_article(user_id, article_id):
    user = db.session.get(Users, user_id)
    article = db.session.get(Articles, article_id)

    if article in user.saved_articles: 
        user.saved_articles.remove(article)  
        db.session.commit()
        return jsonify({
            'message': f'Successfully removed "{article.title}" from {user.username}\'s saved articles',
            'user': user_schema.dump(user),
            'saved_articles': articles_schema.dump(user.saved_articles)
        }), 200

    return jsonify("This article is not in saved articles"), 400