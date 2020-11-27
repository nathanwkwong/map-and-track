FROM node:10-alpine
WORKDIR "/app/server"
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]