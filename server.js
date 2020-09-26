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

var stats = {
    "users_cnt": 0,
    "messages_cnt": 0,
};

var history = [];

function update_stats() {
    io.emit('stats', stats);    // to all
};


// socket.emit() == to current client
// socket.broadcast.emit() == to all, excluding current client
// io.emit() == to all, including current client
io.on('connection', (socket) => {
    console.log('new connection as %s', socket.id);
    //socket.broadcast.emit('system-message', 'New user connected: '+socket.id);
    stats.users_cnt++;
    update_stats();

    // send full history to this new client:
    for (var i=0; i < history.length; i++) {
        socket.emit('chat-message-server', history[i]);
    };

    socket.on('disconnect', () => {
        console.log('%s disconnected', socket.id);
        //io.emit('system-message', 'User disconnected: '+socket.id);
        stats.users_cnt--;
        update_stats();
    });

    socket.on('chat-message-client', (data) => {
        // when client sends a message, add it to history and send it to all including him/her

        console.log('%s: got message "%o"', socket.id, data);
        io.emit('chat-message-server', data);

        // keep history
        history.push(data);
        if (history.length > 100) {
            history.shift();
        }
        //console.debug('history: %o', history);
        stats.messages_cnt++;
        update_stats();
    });
});

