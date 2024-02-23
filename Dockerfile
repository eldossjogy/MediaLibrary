FROM node:alpine
COPY . /app
WORKDIR /app
RUN npm install
RUN npx prisma db push
EXPOSE $PORT
CMD ["npm","run-script","run"]