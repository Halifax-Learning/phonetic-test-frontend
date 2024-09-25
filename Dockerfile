# Use a lightweight server to serve the static files.
FROM nginx:alpine

# Copy built files from the previous stage to the nginx directory.
COPY ./dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port for the server.
EXPOSE 80

# Command to run Nginx.
CMD ["nginx", "-g", "daemon off;"]
