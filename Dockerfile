FROM node:dubnium AS dist
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG PORT=3000

EXPOSE $PORT

CMD [ "npm", "run","start:dev" ]

