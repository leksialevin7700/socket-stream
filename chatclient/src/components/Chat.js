import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:5000");

const Chat = () => {
    const location = useLocation();
    const receiver = location.state?.receiver;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [newMessages, setNewMessages] = useState(0);

    const messageRefs = useRef([]);

    // Request notification permission on component mount
    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    console.log("Notification permission granted");
                } else {
                    console.log("Notification permission denied");
                }
            });
        }

        if (receiver) {
            console.log(`Chatting with ${receiver}`);
        }

        fetch(`http://localhost:5000/api/messages/${localStorage.getItem("username")}/${receiver}`)
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error("Error fetching messages:", err));
            socket.on("notification", (data) => {
                if (data.type === "new-message") {
                  console.log(`New message from ${data.sender}: ${data.content}`);
                  // Display a popup or update the UI
                } else if (data.type === "message-read") {
                  console.log(`Your message to ${data.receiver} has been read.`);
                  // Update the UI to show the read status
                }
              });
              

        socket.on("user-typing", (username) => {
            setTypingUser(username);
            setIsTyping(true);
        });

        socket.on("message-delivered", (messageId) => {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === messageId ? { ...msg, delivered: true } : msg))
            );
        });

        socket.on("message-read", (messageId) => {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === messageId ? { ...msg, read: true } : msg))
            );
        });

        return () => {
            socket.off("receive-message");
            socket.off("user-typing");
            socket.off("message-delivered");
            socket.off("message-read");
        };
    }, [receiver]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Mark the message as read when it comes into view
                    const messageId = entry.target.dataset.id;
                    if (messageId) {
                        socket.emit("message-seen", { messageId, userId: localStorage.getItem("username") });
                    }
                }
            });
        }, {
            threshold: 0.5,
        });

        messageRefs.current.forEach((msgRef) => {
            if (msgRef) {
                observer.observe(msgRef);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [messages]);

    const handleSendMessage = () => {
        const sender = localStorage.getItem("username");

        if (!sender) {
            alert("You must be logged in to send a message.");
            return;
        }

        if (!message.trim()) {
            alert("Message content cannot be empty.");
            return;
        }

        const newMessage = { sender, receiver, content: message };

        socket.emit("send-message", newMessage);

        setMessages((prev) => [
            ...prev,
            { ...newMessage, _id: Date.now().toString(), delivered: false, read: false, createdAt: new Date(), updatedAt: new Date() }
        ]);

        setMessage("");
    };

    const handleTyping = () => {
        const sender = localStorage.getItem("username");
        if (sender) {
            socket.emit("user-typing", sender);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat with {receiver}</h2>
            </div>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        ref={(el) => (messageRefs.current[index] = el)}
                        data-id={msg._id}
                        className={`chat-message ${msg.sender === localStorage.getItem("username") ? "sent" : "received"}`}
                    >
                        <strong>{msg.sender}: </strong>{msg.content}
                        <div className="message-status">
                            {msg.delivered && <span className="delivered-status">Seen</span>}
                            {msg.read && <span className="read-status">Read</span>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <div className="typing-indicator">
                {isTyping && typingUser !== localStorage.getItem("username") && (
                    <span>{typingUser} is typing...</span>
                )}
            </div>
            {newMessages > 0 && <div className="new-message-notification">New messages: {newMessages}</div>}
        </div>
    );
};

export default Chat;
