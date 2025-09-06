const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const app = require('./app');

connectDB()
  .then(() => {
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: [process.env.CLIENT_URL],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    const userSocketMap = {};

    io.on('connection', (socket) => {
      console.log('✅ User connected:', socket.id);

      const userId = socket.handshake.query.userId;
      if (userId) {
        userSocketMap[userId] = socket.id;
      }

      io.emit('getOnlineUsers', Object.keys(userSocketMap));

      socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
      });
    });

    // ✅ Make io & userSocketMap available in controllers
    app.set('io', io);
    app.set('userSocketMap', userSocketMap);

    server.listen(process.env.PORT || 9000, () => {
      console.log(`🚀 Server running at port ${process.env.PORT || 9000}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting DB:', err);
    process.exit(1);
  });
