FROM node:lts-slim

COPY . /opt/app
WORKDIR /opt/app
RUN npm install

CMD ["node", "bot.js"]