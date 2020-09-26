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

const port = process.env.PORT || 8000
server.listen(port, () => {
    console.log('Started server on http://localhost:%d/', port);
});

io.on('connection', (socket) => {
    console.log('new connection as %s', socket.id);
    socket.emit('system-message', 'New user connected: '+socket.id);    // to all, excluding me

    socket.on('disconnect', () => {
        console.log('%s disconnected', socket.id);
        io.emit('system-message', 'User disconnected: '+socket.id);
    });

    socket.on('chat-message-client', (data) => {
        console.debug('%s: got message "%o"', socket.id, data);
        io.emit('chat-message-server', data);   // to all, including me
    });
});

