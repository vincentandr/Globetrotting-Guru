import os

import boto3

from main import config

s3 = boto3.client('s3',
                  aws_access_key_id=config['S3_AWS_ACCESS_KEY_ID'],
                  aws_secret_access_key=config['S3_AWS_SECRET_ACCESS_KEY'])


def upload_image(img):
    img.save(img.filename)
    s3.upload_file(
        Bucket=config['S3_BUCKET'],
        Filename=img.filename,
        Key=img.filename,
        ExtraArgs={'ACL': 'public-read'}
    )
    os.remove(img.filename)
