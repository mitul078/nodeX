FROM node:20

WORKDIR /app

COPY shared/ ./shared/
COPY users/ .

RUN npm install --production

EXPOSE 4002
CMD ["node", "server.js"]