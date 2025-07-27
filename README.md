# Socket Stream 

Welcome to **Socket Stream**, a real-time chat application designed to deliver a seamless messaging experience using modern web technologies. This project is crafted for learning, experimentation, and as a foundation for building more advanced communication solutions.

---

## 🚀 Features

- **Real-Time Messaging**: Instantly send and receive messages with the power of Socket.IO.
- **Delivery & Read Receipts**: Know exactly when your message is delivered and read.
- **User Presence**: See who's online and available to chat.
- **Typing Indicators**: Get notified when someone is typing a reply.
- **Notification Support**: Browser notifications for new messages.
- **Authentication**: User registration and secure login.
- **Persistent Message Storage**: All messages are saved in MongoDB for reliable chat history.

---

## 🏗️ Tech Stack & Architecture

The project is built using a modern, full-stack JavaScript ecosystem, combining the following tools and frameworks:

- **React** (bootstrapped with [Create React App](https://github.com/facebook/create-react-app)) for the frontend UI
- **React Router** for navigation and routing
- **Socket.IO** (client & server) for real-time, bidirectional communication
- **Axios** for HTTP API requests from the frontend
- **Jest & React Testing Library** for frontend testing
- **Tailwind CSS** for styling and layout
- **Node.js** with **Express.js** for the backend server and REST APIs
- **MongoDB** (with **Mongoose** ODM) for persistent data storage
- **CORS & Body-Parser** middleware for secure and structured API handling
- **JWT** (JSON Web Tokens) for secure authentication (implied from typical structure)
- **Babel/Webpack/ESLint** (via Create React App) for code transformation and linting
- **Environment Variables** (supported in CRA and Node for configuration)

---

## 💡 How It Works

This app lets you chat with another user in real time, just like your favorite messaging platforms. When you send a message, it's stored in a database and immediately delivered if your friend is online. You'll see when your message is delivered and when it's read. If your chat partner is typing, you'll know. Even if you close your browser, your chat history is safe and waiting for you when you return.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js & npm installed
- MongoDB instance running locally or in the cloud

### 1. Clone the Repository

```bash
git clone https://github.com/leksialevin7700/socket-stream.git
cd socket-stream
```

### 2. Install Server Dependencies

```bash
npm install
```

### 3. Setup Environment

Configure your MongoDB URI and any other environment variables, typically in a `.env` file (see `config/db.js`).

### 4. Start the Backend Server

```bash
node server.js
```

### 5. Setup and Start the Frontend

```bash
cd chatclient
npm install
npm start
```

The React app will run at [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing

- **Frontend**: Run `npm test` in `chatclient` for React component tests.
- **Backend**: Use tools like Postman or direct API calls to test endpoints.

---
