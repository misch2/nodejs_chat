const express = require('express')
const app = express()

// expose everything in this folder for serving over http:
app.use(express.static(__dirname + '/public'));
// manage special '/' URL (otherwise we would get just a 'Cannot GET /' error message):
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8000, () => {
    console.log('Started server');
});

