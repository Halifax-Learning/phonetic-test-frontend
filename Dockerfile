# Use an official Nginx image to serve the app
FROM nginx:alpine

# Copy the built files from your local dist directory to the Nginx HTML directory
COPY ./dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 443 for SSL
EXPOSE 443

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
