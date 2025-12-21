FROM node:18-slim

# Install basic tools
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    xz-utils \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app code
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
