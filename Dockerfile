# Use an official Node.js runtime as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (use ci for reproducible builds)
RUN npm ci
#RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose app port
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

