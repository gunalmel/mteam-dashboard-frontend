# Use Node.js to build the React app
FROM node:22.12.0 AS builder
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy the build output to Nginx's HTML folder
COPY --from=builder /usr/src/app/dist .

# Configure Nginx for reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80


# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
