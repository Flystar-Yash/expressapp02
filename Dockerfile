# Use Node.js image from Docker Hub
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . ./

# Expose the port the app will run on
EXPOSE 8080

# Start the app
CMD ["node", "app.js"]

