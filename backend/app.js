require('dotenv').config();
const express = require('express');
const error = require('./src/middlewares/error.middlewares');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./src/routes/user.routes');
const messageRoutes = require('./src/routes/message.routes');
const path = require('path');
const app = express();

const _dirname = path.resolve();

app.use(cookieParser());

// const corsOption={
//     origin:[process.env.CLIENT_URL,"http://localhost:5173"],
//     credentials:true
// };
// app.use(cors(corsOption)); 


const clientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : [];

const corsOptions = {
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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/messages',messageRoutes);

const fs = require('fs');
const frontendDist = path.join(_dirname, "frontend", "dist");

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.resolve(frontendDist, "index.html"));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).send("PulseChat API Server is running");
  });
}

app.use(error);

module.exports = app;