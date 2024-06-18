const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Movies catalog
const movies = [
  { id: 1, title: 'Movie 1', url: '/movies/movie1.mp4' },
  { id: 2, title: 'Movie 2', url: '/movies/movie2.mp4' },
  { id: 3, title: 'Movie 3', url: '/movies/movie3.mp4' }
];

// WebSocket handlers
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createRoom', (data) => {
    const { roomId, movieId } = data;
    socket.join(roomId);
    io.in(roomId).emit('movieSelected', { movieId });
    console.log(`Room ${roomId} created with movie ${movieId}`);
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on('play', (data) => {
    const { roomId, time } = data;
    socket.to(roomId).emit('play', time);
  });

  socket.on('pause', (data) => {
    const { roomId, time } = data;
    socket.to(roomId).emit('pause', time);
  });

  socket.on('seek', (data) => {
    const { roomId, time } = data;
    socket.to(roomId).emit('seek', time);
  });

  socket.on('sync', (data) => {
    const { roomId, time } = data;
    socket.to(roomId).emit('sync', time);
  });

  socket.on('selectMovie', (data) => {
    const { roomId, movieId } = data;
    socket.to(roomId).emit('movieSelected', { movieId });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
