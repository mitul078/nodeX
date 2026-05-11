FROM node:20

WORKDIR /app

COPY shared/ ./shared/
COPY billing/ .

RUN npm install --production

EXPOSE 4005
CMD ["node", "server.js"]