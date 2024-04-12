FROM node:alpine
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE $PORT
CMD ["npm","run-script","run"]