FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./
# Server frontend files
COPY ../NTU-FYP-Chatbot-frontend/dist /app/fe-dist
RUN yarn install --production

COPY . .

EXPOSE 3000
CMD ["node", "dist/server.js"]
