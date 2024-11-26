const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const Message = require("./models/Message");
const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Connect to MongoDB
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process if DB connection fails
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

let onlineUsers = {};

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Add user to online list
  socket.on("user-online", (username) => {
    onlineUsers[username] = socket.id;
    console.log(`User online: ${username} with socket ID: ${socket.id}`);
  });

  // Handle sending messages
  socket.on("send-message", async ({ sender, receiver, content }) => {
    console.log("Message received:", { sender, receiver, content });

    // Validate the received data
    if (!sender || !receiver || !content) {
      console.error("Invalid message data:", { sender, receiver, content });
      return socket.emit("error", { message: "Invalid message data." });
    }

    try {
      // Save the message to MongoDB
      const message = new Message({ sender, receiver, content });
      await message.save();
      console.log("Message saved to MongoDB:", message);

      // Notify receiver if online
      if (onlineUsers[receiver]) {
        io.to(onlineUsers[receiver]).emit("receive-message", { sender, content });
      }
    } catch (error) {
      console.error("Error saving message to MongoDB:", error);
      socket.emit("error", { message: "Message could not be sent." });
    }
  });

  // Notify clients about user disconnection
  socket.on("disconnect", () => {
    for (let username in onlineUsers) {
      if (onlineUsers[username] === socket.id) {
        delete onlineUsers[username];
        console.log(`User disconnected: ${username}`);
      }
    }
  });
});

// API route for fetching message history
app.get("/api/messages/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;

  // Log the request
  console.log(`Fetching messages between ${sender} and ${receiver}`);

  try {
    // Query MongoDB to find messages
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 }); // Sort by oldest to newest

    // Log the fetched messages
    console.log("Messages fetched:", messages);

    // Send the messages in the response
    res.json(messages);
  } catch (error) {
    // Log error if fetching messages fails
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Could not fetch messages." });
  }
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
