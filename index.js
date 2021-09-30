const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const router = require('./router');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
});

app.use(router);

io.on('connect', (socket) => {
    console.log('User has joined');

    socket.on('disconnect', () => {
        console.log('User has just disconnected');
    });
});

server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
