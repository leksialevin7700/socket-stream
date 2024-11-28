const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  delivered: {
    type: Boolean,
    default: false, // Initially not delivered
  },
  seenBy: {
    type: Array, // Stores user IDs of those who have seen the message
    default: [], // Empty array by default
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets creation time
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically updates
  },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
