import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./Chat.css"; // Import the Chat.css file

const socket = io("http://localhost:5000"); // Connect to the server

const Chat = () => {
    const location = useLocation();
    const receiver = location.state?.receiver;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (receiver) {
            console.log(`Chatting with ${receiver}`);
        }

        // Fetch chat history
        fetch(`http://localhost:5000/api/messages/${localStorage.getItem("username")}/${receiver}`)
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error("Error fetching messages:", err));

        // Listen for incoming messages
        socket.on("receive-message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receive-message");
        };
    }, [receiver]);

    const handleSendMessage = () => {
        const sender = localStorage.getItem("username");
        socket.emit("send-message", { sender, receiver, content: message });
        setMessages((prev) => [...prev, { sender, content: message }]);
        setMessage(""); // Clear input after sending
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
                        className={`chat-message ${msg.sender === localStorage.getItem("username") ? "sent" : "received"}`}
                    >
                        <strong>{msg.sender}: </strong>{msg.content}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
