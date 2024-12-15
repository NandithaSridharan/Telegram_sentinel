// src/components/Dashboard.js

import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [channel, setChannel] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const analyzeChannel = async () => {
        if (!channel.trim()) {
            alert("Please enter a Telegram channel name!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/analyze_channel", {
                channel: channel, 
            });

            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error analyzing the channel:", error);
            alert("Failed to connect to the backend. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Telegram Sentinel</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter Telegram Channel Name"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="border border-gray-400 p-2 w-full mb-2"
                />
                <button
                    onClick={analyzeChannel}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Analyze Channel
                </button>
            </div>

            {loading && <p>Loading, please wait...</p>}

            <div>
                <h2 className="text-xl font-semibold mt-4">Channel Analysis:</h2>
                <ul>
                    {messages.length > 0 ? (
                        messages.map((msg, idx) => (
                            <li
                                key={idx}
                                className={msg.isScam ? "text-red-600" : "text-green-600"}
                            >
                                {msg.text} — {msg.isScam ? "Scam" : "Safe"}
                            </li>
                        ))
                    ) : (
                        <p>No messages to display.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard; // Ensure that this is the default export!
