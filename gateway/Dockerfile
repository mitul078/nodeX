FROM node:20

WORKDIR /app

COPY gateway/ .

RUN npm install --production

EXPOSE 4000
CMD ["node", "server.js"]