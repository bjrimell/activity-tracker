// src/components/ActivityList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);

    const fetchActivities = async () => {
        const userId = 'user1'; // Replace with actual user ID or pass it as a prop
        try {
            const response = await axios.get(`https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/activities?UserId=${userId}`);
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities", error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <div>
            <h2>Your Activities</h2>
            <ul>
                {activities.map((activity) => (
                    <li key={activity.ActivityId}>
                        {activity.Activity} (Completed: {activity.CompletedCount})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityList;