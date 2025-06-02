const io = require('socket.io-client');

const statsSocket = io('http://localhost:3300/stats'); 

statsSocket.on('connect', () => {
  console.log('Connected to stats namespace');

  statsSocket.emit('subscribeToStats', { quizId: 1 });

  statsSocket.on('statsUpdate', (data) => {
    console.log('📊 Stats update:', data);
  });

  statsSocket.on('statsError', (err) => {
    console.error('Stats error:', err);
  });
});
