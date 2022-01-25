import json

from requests import request
from main import config


def identify_images(filename):
    return json.loads(__send_request('POST', __get_recommendation_url(),
                                          json.dumps({
                                              "image": config['S3_BUCKET_BASE_URL'] + filename
                                          })).text)["place_id"]


def __get_recommendation_url():
    return config['AI_API_BASE_URL'] + 'predict'


def __send_request(method, url, body):
    headers = {
        "Connection": "keep-alive",
        "Content-Type": "application/json"
    }

    response = request(method, headers=headers, url=url, data=body)
    return response
