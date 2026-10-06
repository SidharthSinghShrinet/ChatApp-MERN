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


const allowedOrigins = [
  "https://chat-app-mern-lime.vercel.app",
  "https://chatapp-k5cy.onrender.com",
  "https://chatapp-mern-3xqn.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return true;
  if (/^https:\/\/chat-app-mern.*\.vercel\.app$/.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true); // ✅ allow
      } else {
        callback(null, false); // ❌ block silently instead of throwing
      }
    },
    credentials: true, // allow cookies/tokens
  })
);


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