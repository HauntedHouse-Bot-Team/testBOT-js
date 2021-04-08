from flask import Flask, jsonify, request
import inspection

image_DIR = 'blacklist/*'
imageinspection = inspection.InspectionImage(image_DIR)

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False 

@app.route("/inspection", methods=['POST'])
def inspection():
  imageurl = request.json['url']
  # fileName = request.json['fileName']
  inspectionResult = imageinspection.check(imageurl)
  return jsonify({'inspectionResult' : inspectionResult})

if __name__ == "__main__":
    app.run()