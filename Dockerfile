FROM node:16-bullseye 
# Install yt-dlp dependencies 
RUN apt-get update && \ apt-get install -y python3-pip ffmpeg && \ apt-get clean && rm -rf /var/lib/apt/lists/*
# Install yt-dlp 
RUN pip3 install -U yt-dlp 
# Create working directory 
WORKDIR /app 
# Copy dependencies 
COPY package*.json ./ 
# Install Node.js dependencies 
RUN npm install 
# Copy project files 
COPY . . 
# Expose the correct port 
EXPOSE 3000 
# Command to start the application 
CMD ["npm", "start"]
