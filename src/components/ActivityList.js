import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ActivityList.module.css'; // Import the CSS module

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

    const incrementCompletedCount = async (activityId) => {
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
        <div className={styles.activityList}>
            <h1>Activities</h1>
            {Array.isArray(activities) && activities.length > 0 ? (
                activities.map(activity => (
                    <div key={activity.ActivityId} className={styles.activity}>
                        <h3>{activity.ActivityName}</h3>
                        {activity.Description && (
                            <p className={styles.description}>Description: {activity.Description}</p>
                        )}
                        <p>Today's Goal: {activity.Frequency}</p>
                        <p>Today's Completed Count: {activity.CompletedCount}</p>

                        {activity.CompletedCount === 0 && (
                            <p className={`${styles.message} ${styles.complain}`}>Get started today!</p>
                        )}
                        {activity.CompletedCount < activity.Frequency && (
                            <p className={`${styles.message} ${styles.nagging}`}>More to do still!</p>
                        )}
                        {activity.CompletedCount === activity.Frequency && (
                            <p className={`${styles.message} ${styles.success}`}>Great job! You've met your goal for today!</p>
                        )}
                        {activity.CompletedCount > activity.Frequency && (
                            <p className={`${styles.message} ${styles.exceeded}`}>Amazing! You've exceeded your goal!</p>
                        )}

                        <button className={styles.button} onClick={() => incrementCompletedCount(activity.ActivityId)}>
                            I've just done this activity
                        </button>
                    </div>
                ))
            ) : (
                <p>No activities found.</p>
            )}
        </div>
    );
};

export default ActivityList;