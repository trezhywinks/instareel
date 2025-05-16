FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js, Python3, pip, and ffmpeg
RUN apt-get update && \
    apt-get install -y curl python3 python3-pip ffmpeg && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install -U yt-dlp

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port (Render uses the PORT environment variable)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
