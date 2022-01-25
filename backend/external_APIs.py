# run this file after adding new places to generate reviews and carpark_ids

import boto3
import numpy as np
from main import config
from requests import request
from haversine import haversine_vector

dynamodb_session = boto3.Session(
    aws_access_key_id=config['DYNAMODB_AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=config['DYNAMODB_AWS_SECRET_ACCESS_KEY'],
    aws_session_token=config['DYNAMODB_AWS_SESSION_TOKEN'])

dynamodb = dynamodb_session.resource('dynamodb')

def assign_latlong_and_carpark_id_places():
    # assign carpark within max 1 km
    MAX_KM = 1

    places_table = dynamodb.Table('places')

    items = places_table.scan()['Items']

    # search place latlong in onemap API
    place_latlong = list(filter(lambda i: i is not None, map(lambda i: search_place_onemap(i['name'])
                if i.get('longitude', None) is None or i.get('latitude', None) is None
                else (float(i['latitude']), float(i['longitude'])), items)))

    # get carpark data from carpark API
    response = get_carpark_data()

    carpark_ids = list(map(lambda i: i['CarParkID'], response))
    carpark_latlong = list(map(lambda i: (float(i['Location'].split(' ')[0]), float(i['Location'].split(' ')[1])),
                               response))

    # calculate distance between each place and car park
    distance = haversine_vector(carpark_latlong, place_latlong, comb=True)

    # get nearest carpark within 1km
    nearest_carpark_within_1km = list(map(lambda i: np.argmin(i) if np.min(i) <= MAX_KM else None, distance))

    carpark_ids_within_1km = [carpark_ids[idx] if idx is not None else '' for idx in nearest_carpark_within_1km]

    # update carpark id and place latlong in db
    for i in range(len(place_latlong)):
        if place_latlong[i] is not None:
            try:
                places_table.update_item(  # create latlong & carpark attribute if they don't exist
                    Key={'place_id': items[i]['place_id']},
                    UpdateExpression=('set #lat= if_not_exists(#lat, :empty_str),'
                                      '#long= if_not_exists(#long, :empty_str),'
                                      '#car= if_not_exists(#car, :empty_str)'),
                    ConditionExpression='attribute_not_exists(#lat) OR attribute_not_exists(#long)'
                                        'OR attribute_not_exists(#car)',
                    ExpressionAttributeNames={
                        '#lat': 'latitude',
                        '#long': 'longitude',
                        '#car': 'carpark_id'
                    },
                    ExpressionAttributeValues={
                        ':empty_str': ''
                    }
                )
            except:
                pass

            places_table.update_item(  # update document
                Key={'place_id': items[i]['place_id']},
                UpdateExpression='set #lat=:lat, #long=:long, #car=:cp_id',
                ExpressionAttributeNames={
                    '#lat': 'latitude',
                    '#long': 'longitude',
                    '#car': 'carpark_id'
                },
                ExpressionAttributeValues={
                    ':lat': str(place_latlong[i][0]),
                    ':long': str(place_latlong[i][1]),
                    ':cp_id': carpark_ids_within_1km[i]
                }
            )

def assign_places_reviews():
    REVIEW_URL = "https://tih-api.stb.gov.sg/content/v1/search/all"
    REVIEW_AUTH_KEY = "1gGOhagB5eb1JC7lOaWm0ONYoCfg0MAw"

    data = {"dataset": "accommodation, attractions, shops, tour, food_beverages, venue",
            "apikey": REVIEW_AUTH_KEY,
            "keyword": ""}

    places_table = dynamodb.Table('places')

    items = places_table.scan()['Items']

    attr_to_get = ('rating', 'text', 'authorName', 'time')

    # for each place get reviews from TIH tour API
    for item in items:
        # if there are already reviews of the item from db then skip
        if item.get('reviews', None) and len(item.get('reviews', None)) > 0:
            continue

        data['keyword'] = item['name']

        response = request('GET', url=REVIEW_URL, params=data).json()

        item['reviews'] = []

        if response.get('data', None):
            response = response['data']['results'][0]

            # get attributes in attr_to_get
            if response.get('reviews', None):
                for review in response['reviews']:
                    item['reviews'].append({k:v for k,v in review.items() if k in set(attr_to_get)})

    # update reviews data in db
    for item in items:
        try:
            places_table.update_item(  # create reviews attribute if they don't exist
                Key={'place_id': item['place_id']},
                UpdateExpression='set #rev= if_not_exists(#rev, :empty_list)',
                ConditionExpression='attribute_not_exists(#rev)',
                ExpressionAttributeNames={
                    '#rev': 'reviews'
                },
                ExpressionAttributeValues={
                    ':empty_list': []
                }
            )
        except:
            pass

        places_table.update_item(  # update document
            Key={'place_id': item['place_id']},
            UpdateExpression='set #rev=:rev',
            ExpressionAttributeNames={
                '#rev': 'reviews'
            },
            ExpressionAttributeValues={
                ':rev': item['reviews']
            }
        )

def get_carpark_data():
    CARPARK_URL = "http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2"
    CARPARK_PARAM = "?$skip="

    headers = {
        "Connection": "keep-alive",
        "Content-Type": "application/json",
        "AccountKey": "XB192r+0QRmIyXfTPjmAmQ==",
        "accept": "application/json"
    }

    skip = ["0", "500", "1000", "1500", "2000"]

    res = []

    for s in skip:
        response = request('GET', headers=headers, url=CARPARK_URL + CARPARK_PARAM + s)

        res.extend(response.json()['value'])

    return res

def search_place_onemap(name):
    ONEMAP_URL = "http://developers.onemap.sg/commonapi/search?searchVal=" + name + "&returnGeom=Y&getAddrDetails=N"

    response = request('GET', url=ONEMAP_URL)

    res = response.json()['results']

    result = (float(res[0]['LATITUDE']), float(res[0]['LONGITUDE'])) if len(res) > 0 else None

    return result

if __name__ == "__main__":
    assign_latlong_and_carpark_id_places()
    assign_places_reviews()
