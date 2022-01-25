The ML model file is excluded in the zip because of its size(678MB)
Please approach Liu Tianhang (e0175471@u.nus.edu) for the file if needed.

For run of the backend AI server
pip install -r requirements.txt
export FLASK_APP=app.py 
flask run --host=0.0.0.0 #ensure port is open to external traffic



simple test case:

post the following json to ec2 address:port/predict (e.g : http://ec2-18-138-255-76.ap-southeast-1.compute.amazonaws.com:5000/predict)
the image url is replaceable with any s3 url images
{
	"image": "https://a0167038-nus-03022021.s3.amazonaws.com/flower_photos/reflectionsatkeppelbay/download+(7).jpg"
}

Return object:
{"place_id": "525d17e0c07142dfbc02e95a445e77c0"}
It will return the place id(hash value) of the object
