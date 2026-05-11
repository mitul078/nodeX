FROM node:20

WORKDIR /app

COPY shared/ ./shared/
COPY auth/ .

RUN npm install --production

EXPOSE 4001
CMD ["node", "server.js"]