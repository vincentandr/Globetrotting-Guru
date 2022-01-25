import uuid

import boto3
import flask_bcrypt as bcrypt
import numpy as np
from boto3.dynamodb.conditions import Key
from flask import json
from flask import request
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required

from ai_api_client import identify_images
from cache import update_generated_recommendations
from main import app, config
from profile import get_user_profile
from recommendation import get_top_recommendation
from s3_client import upload_image
from carparkAPI import carparkAPI
from utils import convert_decimal_values_to_int

dynamodb_session = boto3.Session(
    aws_access_key_id=config['DYNAMODB_AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=config['DYNAMODB_AWS_SECRET_ACCESS_KEY'],
    aws_session_token=config['DYNAMODB_AWS_SESSION_TOKEN'])

dynamodb = dynamodb_session.resource('dynamodb')

jwt = JWTManager(app)

carpark_api = carparkAPI()

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/users/authenticate', methods=['POST'])
def authenticate():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user_table = dynamodb.Table('user')

    query = user_table.query(  # create GSI named usernameIndex on username attribute first before this
        ProjectionExpression='user_id, first_name, last_name, password',
        IndexName='usernameIndex',
        KeyConditionExpression=Key('username').eq(username),
    )

    if query['Count'] > 0:
        res = query['Items'][0]
        password_match = bcrypt.check_password_hash(res['password'],
                                                    password)  # check hashed password in db and request password
        if password_match:
            token = create_access_token(identity=res['user_id'])  # generate token

            response = {
                'id': res['user_id'],
                'first_name': res['first_name'],
                'last_name': res['last_name'],
                'username': username,
                'token': token
            }

            return json.jsonify(response), 200

    return json.jsonify({"msg": "Bad username or password"}), 400


@app.route('/users/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    first_name = data['first_name']
    last_name = data['last_name']

    user_table = dynamodb.Table('user')

    query = user_table.query(  # check if username exists
        IndexName='usernameIndex',  # create GSI named usernameIndex on username attribute first before querying
        KeyConditionExpression=Key('username').eq(username),
    )

    if query['Count'] == 0:
        user_id = uuid.uuid4().hex  # create uuid

        user_table.put_item(  # put user login info into table
            Item={
                'user_id': user_id,
                'username': username,
                'password': bcrypt.generate_password_hash(password).decode('utf-8'),
                'first_name': first_name,
                'last_name': last_name
            }
        )
    else:
        return json.jsonify({"msg": "Username is taken"}), 400

    return json.jsonify({"msg": "Registered"}), 200


@app.route('/profile/<string:user_id>', methods=['GET', 'POST', 'PATCH'])
@jwt_required()
def profile(user_id):
    user_table = dynamodb.Table('user')
    if request.method == 'GET':
        response = get_user_profile(user_id, user_table)

        return json.jsonify(response), 200

    elif request.method == 'POST':
        data = request.json
        budget = data.get('budget', {})
        interests = data.get('interests', [])
        places = data.get('places', {})

        try:
            user_table.update_item(  # create budget or places attribute if they don't exist
                Key={'user_id': user_id},
                UpdateExpression=('set #b= if_not_exists(#b, :empty_map),'
                                  '#p= if_not_exists(#p, :empty_map)'),
                ConditionExpression='attribute_not_exists(#b) OR attribute_not_exists(#p)',
                ExpressionAttributeNames={
                    '#b': 'budget',
                    '#p': 'places'
                },
                ExpressionAttributeValues={
                    ':empty_map': {}
                }
            )
        except:
            pass  # attribute budget or place already exists

        query = user_table.update_item(  # update document
            Key={'user_id': user_id},
            UpdateExpression='set budget.#min=:min, budget.#max=:max, interests=:i, places.likes=:l, places.dislikes=:d',
            ExpressionAttributeNames={
                '#min': 'min',
                '#max': 'max'
            },
            ExpressionAttributeValues={
                ':min': budget['min'],
                ':max': budget['max'],
                ':i': interests,
                ':l': places.get('likes', []),
                ':d': places.get('dislikes', [])
            }
        )

        return json.jsonify({"msg": "Success"}), 200

    else:  # PATCH
        data = request.json
        places = data.get('places', {})

        try:
            user_table.update_item(  # create places attribute if it doesn't exist
                Key={'user_id': user_id},
                UpdateExpression='set #p= if_not_exists(#p, :empty_map)',
                ConditionExpression='attribute_not_exists(#p)',
                ExpressionAttributeNames={
                    '#p': 'places'
                },
                ExpressionAttributeValues={
                    ':empty_map': {}
                }
            )
        except:
            pass  # attribute place already exists

        res = user_table.update_item(
            Key={'user_id': user_id},
            UpdateExpression='set places.likes=:l, places.dislikes=:d',
            ExpressionAttributeValues={
                ':l': places['likes'],
                ':d': places['dislikes']
            }
        )

        return json.jsonify({"msg": "Success"}), 200


@app.route('/profile/available')
@jwt_required()
def get_available():
    interests_table = dynamodb.Table('interests')
    places_table = dynamodb.Table('places')

    interests_res = interests_table.scan()
    places_res = places_table.scan()

    interests = list(map(lambda i: i['name'], interests_res['Items']))
    places = list(map(lambda i: i['name'], places_res['Items']))

    response = {
        'interests': interests,
        'places': places
    }
    return json.jsonify(response), 200


@app.route('/recommendation', methods=['GET', 'POST'])
def recommendation_get():
    places_table = dynamodb.Table('places')

    if request.method == 'GET':
        query = places_table.scan()

        index = np.random.randint(0, query['Count'])

        res = convert_decimal_values_to_int(query['Items'][index])

        res['carpark_available'] = carpark_api.get_lots_available(dynamodb, res.get('carpark_id', None))

        return json.jsonify(res), 200
    else:
        img = request.files['file']
        if img:
            items = places_table.scan()['Items']

            upload_image(img)
            identified_place = identify_images(img.filename)

            new_recommendation = get_top_recommendation(uuid.uuid4().hex,
                                                        items,
                                                        list(filter(lambda i: i['place_id'] == identified_place, items)),
                                                        {},
                                                        {})

            new_recommendation['carpark_available'] = carpark_api.get_lots_available(dynamodb,
                                                                            new_recommendation.get('carpark_id', None))

            return json.jsonify(new_recommendation)
        else:
            return json.jsonify({"msg": "No image provided"}), 400
        pass


@app.route('/recommendation/<string:user_id>')
@jwt_required()
def recommendation(user_id):
    rec_table = dynamodb.Table('places')
    user_table = dynamodb.Table('user')

    items = rec_table.scan()['Items']
    user_profile = get_user_profile(user_id, user_table)

    if request.method == 'GET':
        new_recommendation = get_top_recommendation(user_id,
                                                    items,
                                                    user_profile.get("interests", []),
                                                    user_profile.get("places", {}),
                                                    user_profile.get("budget", {}))
        update_generated_recommendations(user_id, new_recommendation['place_id'])
        return json.jsonify(new_recommendation)
