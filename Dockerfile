#@IgnoreInspection BashAddShebang
FROM node:0.12.7-wheezy

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app
COPY ./package.json /usr/src/app/
COPY bin/localhost.pfx /

RUN npm install && \
    npm install -g gulp && \
    gulp build

EXPOSE 3001
EXPOSE 3002

CMD [ "npm", "start" ]
