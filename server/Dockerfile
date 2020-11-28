FROM node:12.18.4-alpine
WORKDIR "/app/server"
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]