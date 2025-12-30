# 📍 Tracking System

A modern **full-stack tracking system** built to track users or devices in real time with a clean, responsive interface.  
This project demonstrates real-world usage of frontend–backend integration, location tracking, and scalable system design.

🔗 **Live Demo:** https://tracking-system-phi-eight.vercel.app/  
📂 **GitHub Repository:** https://github.com/Grm-gh/Tracking-system

---

## 🚀 Features

- 📡 Real-time tracking system
- 👥 Multiple users can join a group using a shared link
- 🧭 Live location updates
- 📍 Interactive map interface
- 📏 Distance calculation between users
- 🔄 Handles user join, leave, and refresh cases
- 💻 Responsive UI (desktop & mobile)
- 🌐 Deployed frontend

---

## 🧑‍💻 Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5 & CSS3
- Tailwind CSS
- Map APIs (Google Maps / Leaflet – as used)

### Backend
- Node.js
- Express.js
- WebSockets / Socket.IO (for live updates)
- REST APIs

### Deployment
- Frontend: **Vercel**
- Backend: **Node server (local / cloud hosted)**

---

## 📁 Project Structure

Tracking-system/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── utils/
│ │ └── App.js
│ └── package.json
│
├── backend/
│ ├── routes/
│ ├── controllers/
│ ├── server.js
│ └── package.json
│
├── README.md
└── .gitignore




---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
git clone https://github.com/Grm-gh/Tracking-system.git
cd Tracking-system

2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside backend:
PORT=5000
Start the backend server:
npm start

3️⃣ Frontend Setup
cd ../frontend
npm install


Create a .env file inside frontend:

REACT_APP_BACKEND_URL=http://localhost:5000


Start the frontend:

npm start

