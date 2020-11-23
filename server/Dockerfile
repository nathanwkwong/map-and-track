FROM node
WORKDIR "/app/server"
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3080
CMD ["npm", "run", "start:prod"]