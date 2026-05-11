FROM node:20

WORKDIR /app

COPY shared/ ./shared/
COPY media/ .

RUN npm install --production

EXPOSE 4004
CMD ["node", "server.js"]