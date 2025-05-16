# Use a Node.js base image
FROM node:16

# Install yt-dlp dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install -U yt-dlp

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (para cache de dependências)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
