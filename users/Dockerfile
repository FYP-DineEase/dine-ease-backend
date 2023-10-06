FROM node:alpine

# Set the working directory within the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the Nest.js CLI globally within the container
RUN npm install -g @nestjs/cli

# Install project dependencies (excluding dev dependencies)
RUN npm install

# Copy the application code to the container
COPY . .

# Start the Nest.js application in development mode
CMD ["npm", "run", "start:dev"]