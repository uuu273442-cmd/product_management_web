# stage 1: import libraries on enviroment builder
FROM node:18-alpine as builder

# set the working directory
WORKDIR /project/website/product_management

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies version in package.json
RUN npm ci

# copy all files to the working directory
COPY . .

# stage 2: import libraries on production enviroment
FROM node:18-alpine as production

# set the working directory
WORKDIR /project/website/product_management

# copy package.json and package-lock.json
COPY --from=builder /project/website/product_management/package*.json ./

# install dependencies version in package.json
RUN npm ci --omit=dev

# copy all files to the working directory
COPY --from=builder --chown=node:node /project/website/product_management .

# set the user to node
USER node

# expose the port
EXPOSE 3000

# run the application
CMD ["node", "index.js"]