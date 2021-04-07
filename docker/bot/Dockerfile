FROM node:lts

ADD . /usr/app
WORKDIR /usr/app/

RUN npm install --production

CMD [ "node", "src/bot.js" ]