FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

CMD ["sh", "-c", "npm run start:$NODE_ENV"]
