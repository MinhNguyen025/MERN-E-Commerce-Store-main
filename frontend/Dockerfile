# Stage 1: Build the React application
FROM node:18-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN npm run build

# Stage 2: Serve ứng dụng bằng Nginx
FROM nginx:stable-alpine

# Copy build từ stage trước vào thư mục mặc định của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy cấu hình Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
