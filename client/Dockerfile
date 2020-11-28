FROM node:12.18.4-alpine

WORKDIR "/app/client"
COPY ./package.json ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx
EXPOSE 3050
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/client/dist /usr/share/nginx/html