from app.blueprints.forum_topics import forum_topics_bp
from .schemas import forum_topic_schema, forum_topics_schema
from flask import request, jsonify, render_template
from marshmallow import ValidationError
from app.models import ForumTopics, Users, db
from app.util.auth import encode_token, token_required



@forum_topics_bp.route('', methods=['POST'])
@token_required
def create_topic():
    user = db.session.get(Users, request.user_id)

    try:
        data = forum_topic_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_topic = ForumTopics(**data, user_id=user.id)
    db.session.add(new_topic)
    db.session.commit()

    return jsonify({
        "message": f"Successfully created topic",
        "topics": forum_topics_schema.dump(user.forum_topics)
    }), 201




@forum_topics_bp.route('', methods=['GET'])
def get_topics():
    try:
        page = int(request.args.get('page'))
        per_page = int(request.args.get('per_page'))
        query = db.select(ForumTopics)
        topics = db.paginate(query, page=page, per_page=per_page)
        return forum_topics_schema.jsonify(topics), 200
    
    except:
        topics = db.session.query(ForumTopics).all()
        return forum_topics_schema.jsonify(topics), 200


@forum_topics_bp.route('/<int:topic_id>', methods=['GET'])
def get_topic(topic_id):

    topic = db.session.get(ForumTopics, topic_id)

    return forum_topic_schema.jsonify(topic), 200



@forum_topics_bp.route('/<int:topic_id>', methods=['PUT'])
@token_required
def update_topic(topic_id):
    topic = db.session.get(ForumTopics, topic_id)
    user_id = request.user_id

    if not topic:
        return jsonify({"message": "Invalid topic_id"}), 404

    if user_id != topic.user_id:
        return jsonify({"error": "access denied"})

    try:
        data = forum_topic_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    for key, value in data.items():
        setattr(topic, key, value)

    db.session.commit()
    return jsonify({
        "message": f"Successfully updated topic",
        "topic": forum_topic_schema.dump(topic)
    }), 200



@forum_topics_bp.route('/<int:topic_id>', methods=['DELETE'])
@token_required
def delete_topic(topic_id):
    topic = db.session.get(ForumTopics, topic_id)
    user_id = request.user_id
    user = db.session.get(Users, user_id)

    if user_id != topic.user_id:
        return jsonify({"error": "access denied"})

    if topic:
        db.session.delete(topic)
        db.session.commit()
        return jsonify({
            "message": f"Successfully deleted topic",
            "topics": forum_topics_schema.dump(user.forum_topics)}), 200
    return jsonify({"error": "invalid topic id"}), 404



@forum_topics_bp.route('/search', methods=['GET'])
def search_topic():
    title = request.args.get('title')

    topics = db.session.query(ForumTopics).where(ForumTopics.title.ilike(f"%{title}%")).all()

    return forum_topics_schema.jsonify(topics), 200




