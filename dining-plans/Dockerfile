FROM node:alpine

# Set the working directory within the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json .

# Install project dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Start the Nest.js application in development mode
CMD ["npm", "run", "start:dev"]