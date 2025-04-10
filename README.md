# 🔗 Link Analytics Dashboard (Micro-SaaS)

A full-stack **URL Shortener + Analytics Dashboard** inspired by Bitly. Built as a Micro-SaaS project with features like link creation, click tracking, QR codes, and charts for device/browser analytics.

## 🚀 Live Demo

Frontend: [https://link-analytics-dashboard.vercel.app](https://your-frontend-link.vercel.app)  
Backend: [https://link-analytics-backend-8xgu.onrender.com/](https://your-backend-api.onrender.com)

---

## 📸 Features

- ✅ **Shorten URLs** with optional custom alias and expiration
- ✅ **Dashboard** with charts and metrics
- ✅ **Click Tracking** (async logging)
- ✅ **QR Code generation** for each link
- ✅ **Copy-to-clipboard** and link previews
- ✅ **Browser/Device Analytics** (via User-Agent)
- ✅ **JWT Authentication** (admin-only, hardcoded)
- ✅ **Pagination, Search, and Delete Links**
- 🔐 Protected routes using token-based auth

---

## 🛠️ Tech Stack

### Frontend
- [React.js](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [Chart.js](https://www.chartjs.org/) (for charts)
- [react-qr-code](https://www.npmjs.com/package/react-qr-code)

### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Render](https://render.com/) (for deployment)

---

## 📂 Project Structure

micro-saas-link-analytics/ ├── client/ # React frontend ├── server/ # Express backend └── README.

## 🧑‍💻 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/link-analytics-dashboard.git
cd link-analytics-dashboard
2. Setup Backend (Express)
bash
Copy
Edit
cd server
npm install
Create a .env file inside server/:

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
Run backend:

bash
Copy
Edit
npm run dev
3. Setup Frontend (React)
bash
Copy
Edit
cd ../client
npm install
Create a .env file inside client/:

env
Copy
Edit
REACT_APP_BASE_URL=http://localhost:5000
Run frontend:

bash
Copy
Edit
npm start
