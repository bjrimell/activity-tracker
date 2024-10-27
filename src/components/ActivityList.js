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

    const reduceFrequency = async (activityId, frequency) => {
        try {
            // Send a PUT request to update the frequency
            const response = await axios.put(`https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activity/${activityId}`, {
                UserId: 'user123',
                ActivityId: activityId,
                // You may want to fetch the current frequency from the activities state, decrement it, and send it
                Frequency: frequency-1 // This can be replaced by current frequency - 1
            });
            console.log(response.data);
            // Fetch the updated activities after reducing frequency
            fetchActivities();
        } catch (error) {
            console.error('Error reducing frequency:', error);
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
                        <p>Frequency: {activity.Frequency}</p>
                        <button onClick={() => reduceFrequency(activity.ActivityId, activity.Frequency)}>Reduce Frequency</button>
                    </div>
                ))
            ) : (
                <p>No activities found.</p>
            )}
        </div>
    );
};

export default ActivityList;