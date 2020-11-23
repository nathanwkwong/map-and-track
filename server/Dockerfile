FROM node:10
WORKDIR "/app/server"
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start:prod"]