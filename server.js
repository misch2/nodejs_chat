const express = require('express')
const app = express()

// obsluha '/' URL:
app.get('/', (req, res) => {
    res.send('Ahoj, testuji češtinu');
});
app.get('/soubor', (req, res) => {
    res.sendFile(__dirname + '/example.html');
});

app.listen(8000, () => {
    console.log('Started server');
});

