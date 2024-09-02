FROM node:18 as development

WORKDIR /app

COPY ./marvel_api/package*.json /app

COPY ./marvel_api /app


RUN npm install
# RUN npm run build

CMD [ "npm", "run", "start:dev" ]

