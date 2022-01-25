from flask import Flask
from flask_caching import Cache
from dotenv import load_dotenv
import secrets
import os

load_dotenv('.env')

config = {
    "CACHE_TYPE": "simple",
    "CACHE_DEFAULT_TIMEOUT": 60 * 60 * 24,
    "JWT_SECRET_KEY": secrets.token_urlsafe(),
    "JWT_ACCESS_TOKEN_EXPIRES": False,
    "S3_AWS_ACCESS_KEY_ID": os.environ['S3_AWS_ACCESS_KEY_ID'],
    "S3_AWS_SECRET_ACCESS_KEY": os.environ['S3_AWS_SECRET_ACCESS_KEY'],
    "DYNAMODB_AWS_ACCESS_KEY_ID": os.environ['DYNAMODB_AWS_ACCESS_KEY_ID'],
    "DYNAMODB_AWS_SECRET_ACCESS_KEY": os.environ['DYNAMODB_AWS_SECRET_ACCESS_KEY'],
    "DYNAMODB_AWS_SESSION_TOKEN": os.environ['DYNAMODB_AWS_SESSION_TOKEN'],
    "AI_API_BASE_URL": os.environ['AI_API_BASE_URL'],
    "S3_BUCKET_BASE_URL": os.environ['S3_BUCKET_BASE_URL'],
    "S3_BUCKET": os.environ['S3_BUCKET'],
    "S3_BUCKET_BASE_URL": os.environ['S3_BUCKET_BASE_URL'],
}

app = Flask(__name__)
app.config.from_mapping(config)
cache = Cache(app)

from controller import *

if __name__ == "__main__":
    app.run()