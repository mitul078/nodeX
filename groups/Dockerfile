FROM node:20

WORKDIR /app

COPY shared/ ./shared/
COPY groups/ .

RUN npm install --production

EXPOSE 4003
CMD ["node", "server.js"]