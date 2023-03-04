FROM node:18
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm i

# Bundle app source
COPY . .

# expose koa port
EXPOSE 3030

# start the server
CMD ["npm", "run", "start-koa"]