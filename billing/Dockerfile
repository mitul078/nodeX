FROM node:18/alpine

WORKDIR /app

COPY ../shared ./shared
COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 4005

CMD ["node" , "server.js"]