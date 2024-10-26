// src/components/ActivityForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = ({ fetchActivities }) => {
    const [activity, setActivity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = 'user1'; // Replace with actual user ID or pass it as a prop

        try {
            await axios.post('https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/activity', {
                UserId: userId,
                Activity: activity,
                Frequency: 1, // Default frequency
            });
            fetchActivities(); // Refresh activity list after adding
            setActivity('');
        } catch (error) {
            console.error("Error adding activity", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Enter activity"
                required
            />
            <button type="submit">Add Activity</button>
        </form>
    );
};

export default ActivityForm;
