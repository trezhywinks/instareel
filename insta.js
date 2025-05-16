const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'instagram')));

app.get('/download', (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({ error: 'URL not provided' });
    }

    //const videoId = uuidv4();
         const videoFileName = `${uuidv4()}.mp4`; 
    const videoPath = path.join('/tmp', videoFileName); 
    //const videoFileName = `${videoId}.mp4`;
    //const videoPath = path.join(__dirname, 'downloads', videoFileName);

    if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
        fs.mkdirSync(path.join(__dirname, 'downloads'));
    }


exec(`python3 -m yt_dlp -f best -o "${videoPath}" ${url}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error downloading video: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao baixar o vídeo' });
    }

    console.log(`yt-dlp stdout: ${stdout}`);
    console.error(`yt-dlp stderr: ${stderr}`);

    res.download(videoPath, (err) => {
        if (err) {
            console.error('Erro no download:', err);
        }

        fs.unlink(videoPath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting temporary file:', unlinkErr);
            }
        });
    });
});

});

app.listen(port, () => {
    console.log(`Server running  http://localhost:${port}`);
});
