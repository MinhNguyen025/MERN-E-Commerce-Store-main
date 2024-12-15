# Sử dụng Node.js làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ mã nguồn
COPY . .

# Expose port mà backend sử dụng 
EXPOSE 5000

# Start server
CMD ["npm", "start"]
