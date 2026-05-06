# STAGE 1: Builder
# Use the official Node.js Alpine image as the base for building
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies cleanly
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Pass build arguments (e.g., API URL) to Vite during the build phase
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the Vite application for production
RUN npm run build


# STAGE 2: Production Server
# Use Nginx Alpine, an incredibly lightweight web server, for the final image
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled static files from the builder stage to Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
