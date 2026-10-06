const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const app = require('./app');

connectDB()
  .then(() => {
    const server = http.createServer(app);

    const clientUrls = process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
      : [];

    const io = new Server(server, {
      cors: {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          const normalizedOrigin = origin.replace(/\/$/, '');
          if (
            clientUrls.includes(normalizedOrigin) ||
            process.env.NODE_ENV !== 'production' ||
            normalizedOrigin.includes('localhost') ||
            normalizedOrigin.includes('127.0.0.1')
          ) {
            return callback(null, true);
          }
          return callback(null, false);
        },
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

      // ✅ Real-time live typing indicators
      socket.on('typing', ({ receiverId }) => {
        if (!receiverId) return;
        const receiverSocketId = userSocketMap[String(receiverId)];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('typing', {
            senderId: String(userId),
          });
        }
      });

      socket.on('stopTyping', ({ receiverId }) => {
        if (!receiverId) return;
        const receiverSocketId = userSocketMap[String(receiverId)];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('stopTyping', {
            senderId: String(userId),
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
      });
    });

    // ✅ Make io & userSocketMap available in controllers
    app.set('io', io);
    app.set('userSocketMap', userSocketMap);

    const PORT = process.env.PORT || 9000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting DB:', err?.message || err);
    if (!process.env.MONGODB_ATLAS_URL) {
      console.error('⚠️ MONGODB_ATLAS_URL environment variable is missing in production!');
    }
    process.exit(1);
  });
