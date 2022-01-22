FROM node:latest

WORKDIR /server

COPY ["package.json", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]
