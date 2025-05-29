const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('instagram'));

app.use(express.static(path.join(__dirname, 'downloads')));

// Função genérica para baixar vídeo
function downloadVideo(url, folder, res) {
    if (!url) {
        return res.status(400).json({ error: 'URL não fornecida' });
    }

    const videoFileName = `${uuidv4()}.mp4`;
    const videoPath = path.join(__dirname, 'downloads', folder);

    if (!fs.existsSync(videoPath)) {
        fs.mkdirSync(videoPath, { recursive: true });
    }

    const fullVideoPath = path.join(videoPath, videoFileName);

    exec(`python3 -m yt_dlp -f best -o "${fullVideoPath}" ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao baixar vídeo: ${error.message}`);
            return res.status(500).json({ error: 'Erro ao baixar o vídeo' });
        }

        console.log(`yt-dlp stdout: ${stdout}`);
        console.error(`yt-dlp stderr: ${stderr}`);

        res.download(fullVideoPath, (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
            }

            fs.unlink(fullVideoPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Erro ao deletar o arquivo:', unlinkErr);
                }
            });
        });
    });
}

// Endpoint para Instagram
app.get('/download/instagram', (req, res) => {
    const url = req.query.url;
    downloadVideo(url, 'instagram', res);
});

// Endpoint para YouTube
app.get('/download/youtube', (req, res) => {
    const url = req.query.url;
    downloadVideo(url, 'youtube', res);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
