FROM node:8

# Create the app directory
RUN mkdir -p /usr/src/db-handler
WORKDIR /usr/src/db-handler

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g gulp
# RUN npm install gulp

# private repo
RUN echo "registry=http://18.233.7.57:4873/" >> ~/.npmrc
RUN echo "//18.233.7.57:4873/:_authToken=3aVYmNyZdXDHOTRjahuhFQ80lOvHnAsetoKC7hKIouE=" >> ~/.npmrc

RUN npm install

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3002
CMD [ "gulp", "assets" ]
CMD [ "gulp", "watch" ]
CMD [ "gulp", "scripts" ]
CMD [ "npm", "run", "prod" ]