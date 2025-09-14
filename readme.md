# 💬 Real-Time Chat Application (MERN + Socket.io)

A real-time chat application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.io** for instant messaging.  
This project demonstrates how to build a modern chat system with **authentication, live communication, and chat history**.

---

## ✨ Features
- 🔐 **User Authentication** (JWT-based login & signup)
- 🔑 **Passwords stored securely** in the database using **bcrypt.js** encryption  
- 💬 **One-to-One Real-Time Messaging** using Socket.io
- 👥 **Online/Offline User Status** indicator
- 🕒 **Message timestamps & persistence** (stored in MongoDB)
- 🕒 **Message & chat persistence**: All messages remain even if the page is reloaded  
- ⚠️ **Note:** Responsiveness for mobile devices is under development

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Context API / Redux, CSS / Material-UI  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Real-time Communication:** Socket.io  
- **Authentication:** JWT, bcrypt  
- **Deployment:** Render (frontend & backend), MongoDB Atlas (DB)

---

## 📂 Project Structure
ChatApp/
├── backend/ # Express + Node.js server
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes (auth, messages, users)
│ ├── controllers/ # Route logic
│ ├── server.js # Entry point
│ └── socket.js # Socket.io events
│
├── frontend/ # React client
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # Auth & Chat pages
│ │ ├── context/ # State management
│ │ └── App.js
│ └── package.json
│
└── README.md

---

## ⚡ Installation & Setup

### 1. Clone the repository
**Terminal**
git clone https://github.com/SidharthSinghShrinet/ChatApp-MERN.git
cd ChatApp-MERN

### 2.Install Dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

### 3. Setup environment variables

# Create a .env file inside the backend folder:

PORT=port_number
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

### 4. Run the application
# Run backend
cd backend
npm run dev

# Run frontend
cd ../frontend
npm run dev

## 🌐 Try it Live
Experience the chat app in real-time!  
Click here to open the app: [Live Demo](https://chatapp-mern-3xqn.onrender.com/login)

> **Note:** You can also try the app live using the deployed frontend link, without running it locally.


### 📌 Future Enhancements

# ✅ Mobile responsiveness (currently in progress)

# ✅ Group chat support

# ✅ File sharing (images, documents)

# ✅ Emoji & GIF support

# ✅ Push notifications

# ✅ Voice / Video call integration

- 🌙 **Dark/Light mode support** (if enabled)

- 🔔 **Instant notifications** for new messages

### For any queries, feedback, or help regarding this project, feel free to reach out: 
👤 Author

Sidharth Singh Shrinet
💼 [LinkedIn](https://www.linkedin.com/in/sidharth-singh-b3aaa623b)

🐙 [GitHub](https://github.com/SidharthSinghShrinet)
