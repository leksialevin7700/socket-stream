import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserList from "./components/UserList";
import Chat from "./components/Chat";
import "./components/Login.css";

const App = () => {
    const [currentUser, setCurrentUser] = React.useState(null); // Track the logged-in user
    const [receiver, setReceiver] = React.useState(null); // Track selected receiver for chat

    return (
        <Router>
            <Routes>
                {/* Default route redirects to Login */}
                <Route path="/" element={<Navigate to="/login" />} />
                
                {/* Registration page */}
                <Route path="/register" element={<Register />} />

                {/* Login page */}
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />

                {/* UserList (Home) page - accessible only if logged in */}
                <Route
                    path="/users"
                    element={
                        currentUser ? (
                            <UserList currentUser={currentUser} setReceiver={setReceiver} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Chat page - accessible only if logged in */}
                <Route
                    path="/chat"
                    element={
                        currentUser && receiver ? (
                            <Chat currentUser={currentUser} receiver={receiver} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
