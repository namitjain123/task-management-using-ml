# Use Node.js image for the backend
FROM node:16

# Set the working directory for the backend
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files for backend
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the backend source code
COPY . .
# Run tests during build - if tests fail, build fails
RUN npm test

# Expose the backend port
EXPOSE 5000

# Command to run the backend
CMD ["npm", "run", "start:backend"]
