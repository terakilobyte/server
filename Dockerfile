FROM node:9.4.0

WORKDIR /usr/app
COPY package*.json ./
RUN npm install --silent

COPY . .

EXPOSE 8000

RUN npm install -g nodemon
