FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .

EXPOSE 3000
CMD ["node", "dist/server.js"]
