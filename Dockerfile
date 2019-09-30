FROM node:10.15-alpine
ENV APP_DIR /usr/src/app/
WORKDIR $APP_DIR
COPY package*.json $APP_DIR
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "start" ]
