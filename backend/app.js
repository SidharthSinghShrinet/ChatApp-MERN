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
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
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

app.use(express.static(path.join(_dirname, "frontend", "dist")));

app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.use(error);

module.exports = app;