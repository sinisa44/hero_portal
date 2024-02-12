# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Pre-build the bcrypt module on the host machine
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "start:dev]