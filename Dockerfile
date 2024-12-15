# Use official Node.js LTS image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Build the Next.js app for production
RUN npm run build

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Command to start the Next.js app in production mode
CMD ["npm", "start"]
