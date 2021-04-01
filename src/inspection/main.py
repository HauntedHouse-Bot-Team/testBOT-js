from flask import Flask, jsonify, request
from PIL import Image
import imagehash
import glob
import io
import requests
import os

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False 


def calculation_hash(url, image_DIR):
  absPath = os.path.dirname(__file__) + '/' + image_DIR
  blacklist_images = glob.glob(absPath)
  r = requests.get(url)
  data = Image.open(io.BytesIO(r.content))
  data_hash = imagehash.phash(data)

  for file in blacklist_images:
    image_hash = imagehash.phash(Image.open(file))
    result = image_hash - data_hash
    if result <= 10:
      break
  else:
    result = 64

  return result
    

@app.route("/inspection", methods=['POST'])
def inspection():
  imageURL = request.json['url']
  # fileName = request.json['fileName']
  inspectionResult = calculation_hash(imageURL, 'blacklist/*')
  calculation_hash(imageURL, 'blacklist/*')
  return jsonify({'inspectionResult' : inspectionResult})

if __name__ == "__main__":
    app.run()