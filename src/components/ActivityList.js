import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);

    const fetchActivities = async () => {
        try {
            const response = await axios.get('https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activities?UserId=user123');
            console.log(response.data); // Log the API response
            setActivities(response.data.activities.activities || []); // Adjust this based on actual response
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <div>
            <h1>Activities</h1>
            {Array.isArray(activities) && activities.length > 0 ? (
                activities.map(activity => (
                    <div key={activity.id}>{activity.name}</div>
                ))
            ) : (
                <p>No activities found.</p>
            )}
        </div>
    );
};

export default ActivityList;