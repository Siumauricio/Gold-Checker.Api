FROM node:16-alpine
WORKDIR /Gold-Checker
COPY . .

RUN  npm install

CMD ["npm", "start"]