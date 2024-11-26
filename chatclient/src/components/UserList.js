
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserList = ({ currentUser, setReceiver }) => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth/users");
                setUsers(res.data.filter((user) => user.username !== currentUser));
            } catch (error) {
                console.error("Error fetching user list:", error);
            }
        };
        fetchUsers();
    }, [currentUser]);

    const handleChatStart = (receiver) => {
        setReceiver(receiver);
        navigate("/chat", { state: { receiver } });
    };

    return (
        <div className="userlist-container">
            <div className="glass-effect">
                <h2>Online Users</h2>
                {users.length > 0 ? (
                    <ul className="userlist">
                        {users.map((user) => (
                            <li key={user.username} className="user-item">
                                <span>{user.username}</span>
                                <button onClick={() => handleChatStart(user.username)}>Chat</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users online or registered yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserList;
