FROM node:18-alpine

WORKDIR /bot
COPY . .
RUN npm ci

CMD [ "node", "/bot/dist/index.js" ]
