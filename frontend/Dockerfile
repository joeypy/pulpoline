# Frontend Dockerfile
FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve
RUN npm install -g vite 

CMD ["serve", "-s", "dist", "-l", "3000"]
