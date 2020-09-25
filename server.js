const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server); // will also server socket.io.js to client side

// expose everything in this folder for serving over http
app.use(express.static(__dirname + '/public'));
// manage special '/' URL (otherwise we would get just a 'Cannot GET /' error message)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 8000, () => {
    console.log('Started server');
});

io.on('connection', (socket) => {
    console.log('new connection as %s', socket.id);

    socket.on('disconnect', () => {
        console.log('%s disconnected', socket.id);
    });

    socket.on('chat-message', (user, msg) => {
        console.log('got message "%s" from "%s"', msg, user);
    });
});

