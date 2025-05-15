const express = require('express');
const app = express();
const port = "4040";

app.use(express.static('instagram'));
app.listen(port, () => {
console.log('Server running...')
});
