# Use Node.js image for the frontend
FROM node:16

# Set the working directory for the frontend
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files for frontend
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the frontend source code
COPY . .

# Build the frontend (React app or similar)
RUN npm run build
# Run tests during build


# Expose the frontend port
EXPOSE 3000

# Command to run the frontend
CMD ["npm", "run", "start:frontend"]
