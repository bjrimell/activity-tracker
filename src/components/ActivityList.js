import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);

    const fetchActivities = async () => {
        try {
            const response = await axios.get('https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activities?UserId=user123');
            console.log(response.data); // Log the API response
            setActivities(response.data.activities || []); // Adjust this based on actual response
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const incrementCompletedCount = async (activityId, frequency) => {
        try {
            // Send a PUT request to update the completed count
            const response = await axios.put(`https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activity/${activityId}`, {
                UserId: 'user123',
                CompletedCountIncrement: 1
            });
            console.log(response.data);
            // Fetch the updated activities after updating completed count
            fetchActivities();
        } catch (error) {
            console.error('Error updating completed count:', error);
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
                    <div key={activity.ActivityId}>
                        <h3>{activity.ActivityName}</h3>
                        <p>Today's Goal: {activity.Frequency}</p>
                        <p>Today's Completed Count: {activity.CompletedCount}</p>

                        {activity.CompletedCount === 0 && (
                            <p style={{ color: 'orange' }}>Get started today!</p>
                        )}
                        {activity.CompletedCount === activity.Frequency && (
                            <p style={{ color: 'green' }}>Great job! You've met your goal for today!</p>
                        )}
                        {activity.CompletedCount > activity.Frequency && (
                            <p style={{ color: 'blue' }}>Amazing! You've exceeded your goal!</p>
                        )}

                        <button onClick={() => incrementCompletedCount(activity.ActivityId, activity.Frequency)}>I've just done this activity</button>
                    </div>
                ))
            ) : (
                <p>No activities found.</p>
            )}
        </div>
    );
};

export default ActivityList;