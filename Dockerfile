# Use the Node.js base image
FROM node:16

# Install yt-dlp dependencies
RUN apt-get update && apt-get install -y python3-pip ffmpeg

# Install yt-dlp
RUN pip3 install -U yt-dlp

# Set the working directory
WORKDIR /app

# Copy the application code into the container
COPY . .

# Install Node.js application dependencies
RUN npm install

# Expose the port on which the application will run
EXPOSE 3000

# Set the command to run the application
CMD ["npm", "start"]
