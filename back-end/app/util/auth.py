import os
from jose import jwt, exceptions 
import jose
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify



SECRET_KEY = os.environ.get('SECRET_KEY') or 'super secret secrets'


def encode_token(user_id):
    payload = {
        'exp': datetime.now(timezone.utc) + timedelta(hours=1),  # expiration, issued at, user_id
        'iat': datetime.now(timezone.utc),                      
        'sub': str(user_id)                                      
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]  

        if not token:
            return jsonify({"error": "Token missing from headers"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = int(data['sub'])  #getting the user_id from the token
        except exceptions.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 403
        except exceptions.JWTError:
            return jsonify({'message': 'Invalid token'}), 403

        return f(*args, **kwargs)
    return decorated






