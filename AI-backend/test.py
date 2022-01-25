from PIL import Image

import os
path = 'C:\\Users\\tianhang\\Desktop\\cs3237\\lab4\\flower_photos'



for root, subdirectories, files in os.walk(path):
    for file in files:
    	fn = os.path.join(root, file)
    	if ".jfif" in fn: 
	    	im = Image.open(fn)
	    	print(fn)
	    	fn = fn.replace(".jfif",".jpg")
	    	print(fn)
	    	im.save(fn)
