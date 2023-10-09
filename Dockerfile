FROM node:alpine as development

WORKDIR /user/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run start:dev

FROM node:alpine as production

WORKDIR /user/app

COPY package.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /user/app/dist ./dist

CMD [ "node", "dist/main.js" ]