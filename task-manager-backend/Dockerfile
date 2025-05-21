# Use Node.js image for the backend
FROM node:16

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Run tests during build, fail build if tests fail
RUN npm test

# Expose the backend port
EXPOSE 5000

# Command to run the backend server
CMD ["npm", "run", "start:backend"]
