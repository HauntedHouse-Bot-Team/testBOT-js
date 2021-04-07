FROM python:3

ADD . /usr/app/
WORKDIR /usr/app

RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000

CMD [ "python", "src/inspection/main.py" ]