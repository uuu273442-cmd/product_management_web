# import libraries on production enviroment
FROM node:18-alpine as production

# set the working directory
WORKDIR /project/website/product_management

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies version in package.json
RUN npm ci --omit=dev

# copy all files to the working directory
COPY . .

# set the user to node
USER node

# expose the port
EXPOSE 3000

# run the application
CMD ["node", "index.js"]

# multi stage
# # Stage 1: Builder (Chỉ để cài đặt và build)
# FROM node:18-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci  # Cài full thư viện (kể cả dev)
# COPY . .
# # (Nếu có bước build, ví dụ: RUN npm run build)

# # Stage 2: Production (Chỉ chứa những gì cần thiết để chạy)
# FROM node:18-alpine as production
# WORKDIR /app

# # Copy file package.json từ builder sang
# COPY --from=builder /app/package*.json ./

# # Cài đặt CHỈ thư viện production ở stage này
# RUN npm ci --omit=dev

# # QUAN TRỌNG: Chỉ copy source code, KHÔNG copy node_modules từ builder
# # Cách 1: Copy từng thư mục cụ thể
# COPY --from=builder /app/controllers ./controllers
# COPY --from=builder /app/models ./models
# COPY --from=builder /app/routes ./routes
# COPY --from=builder /app/views ./views
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/helper ./helper
# COPY --from=builder /app/middlewares ./middlewares
# COPY --from=builder /app/validates ./validates
# COPY --from=builder /app/config ./config
# COPY --from=builder /app/index.js ./index.js

# USER node
# EXPOSE 3000
# CMD ["node", "index.js"]