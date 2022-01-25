# Serve model as a flask application

import pickle
import numpy as np
import urllib.request
from flask import Flask, request
from tensorflow import keras
import json
model = None
app = Flask(__name__)
import cv2
result = ['Apricot','Banana','artsciencemuseum']
place_id = [  'e9afa636a2ab41caa42e8ef552c5b754',  '?????????????' ,         '38138920002f4bfdb5f9e9b6cd17a851'    ,  '8bcd5c088bfa43efb4a91244d7a0675a'  , 'c94e1b985feb403e99befdd9f2aa5661',   'f9485399845b4838a3e62d27ee2e6f3f',        'da6aeb083863422097a5e628efc580df'   ,  '18e34a58188d4cab9a5e070eb9ba907c', '3864af5356b34a538a8128b5d11f9006' , 'ca58dfaddc3a47e696d02f25fe462cfe',  'e939358a9d3c4f6ca79be8dacabf9d3f',   '525d17e0c07142dfbc02e95a445e77c0' ,'68f022fa203c416b8a2eccff50ff5f9e','6c68f985509d431896682024422d2781'      ]
placeid = []
# def load_model():
#     global model
#     # model variable refers to the global variable
model = keras.models.load_model('/home/ubuntu/deploy-ml-model-master/flowers.hd5')


@app.route('/')
def home_endpoint():
    return 'Hello World!'


@app.route('/predict', methods=['POST'])
def get_prediction():
    # Works only for a single sample
    if request.method == 'POST':
        jsonPacket = request.get_json() 
        photolink = jsonPacket['image']
        print(photolink)
         # Get data posted as a json
        # resp = urllib.request.urlopen("https://a0167038-nus-03022021.s3.amazonaws.com/26.jpg")
        resp = urllib.request.urlopen(photolink)
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        img = cv2.imdecode(image, cv2.IMREAD_COLOR)
        # data = np.array(data)[np.newaxis, :]  # converts shape from (4,) to (1, 4)
        img = cv2.resize(img,(512,512))
        img = np.reshape(img,[1,512,512,3])
        prediction = model.predict(img)  # runs globally loaded model on the data
        preds_cls_idx = prediction.argmax(axis=-1)
        print(preds_cls_idx)
    return json.dumps({
                                                      "place_id": place_id[preds_cls_idx[0]] })


if __name__ == '__main__':
    load_model()  # load model at the beginning once only
    app.run(host='0.0.0.0', port=80)
