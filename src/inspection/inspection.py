from PIL import Image
import imagehash
import glob
import io
import requests
import os

class InspectionImage:

    def __init__(self, image_DIR):
        self.blacklist_hash = []
        self.absPath = os.path.dirname(__file__) + '/' + image_DIR

        if not self.absPath:
            raise ValueError('dir error!')
        
        blacklist_images = glob.glob(absPath)
        for i in blacklist_images:
            h = imagehash.phash(Image.open(i))
            self.blacklist_hash.append(h)
        
        self.blacklist_hash = list(set(self.blacklist_hash))

    def addBlacklist(self, url):
        file_name = os.path.join(self.absPath, url.split('/')[-1])
        res = requests.get(url)
        image = res.content

        if res.status_code == 200:
            with open(file_name, 'wb') as file:
                file.write(image)
        
            blacklist_images = glob.glob(absPath)
            for i in blacklist_images:
                h = imagehash.phash(Image.open(i))
                self.blacklist_hash.append(h)
            
            self.blacklist_hash = list(set(self.blacklist_hash))

    def calculate(self, url):
        res = requests.get(url)
        image = res.content

        if res.status_code == 200:
            image_hash = imagehash.phash(Image.open(io.BytesIO(res.content)))
            return image_hash
        elif 400 <= res.status_code <= 505:
            raise Exception('download error!')
        else raise Exception('unknown error!')

    def check(self, url):
        res = requests.get(url)
        data = Image.open(io.BytesIO(res.content))
        image_hash = imagehash.phash(data)
        for i in self.blacklist_hash:
            result = image_hash - i
            if result <= 10:
                    break
            else:
                result = 64
        
        return result