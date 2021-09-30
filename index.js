const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const router = require('./router');

const {
addUser, removeUser, getUser, getUserInRoom,
} = require('./users');

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

io.on('connection', (socket) => {
    console.log('User has joined');

    socket.on('join', (name, room, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

        socket.join(user.room);

        callback();
    });

    socket.on('disconnect', () => {
        console.log('User has just disconnected');
    });
});

server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
