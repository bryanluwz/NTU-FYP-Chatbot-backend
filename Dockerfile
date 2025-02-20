FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production
RUN yarn add --dev @types/cors @types/mime-types @types/bcryptjs @types/jsonwebtoken @types/uuid @types/multer @types/bcrypt

COPY . .

EXPOSE 3000
RUN yarn build

CMD ["node", "dist/server.js"]
