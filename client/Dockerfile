FROM node:10
WORKDIR "/app/client"
COPY ./package.json ./
RUN yarn
COPY . .
CMD ["yarn", "build"]

FROM nginx
EXPOSE 3050
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/client/build /usr/share/nginx/html