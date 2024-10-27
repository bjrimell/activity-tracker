// src/components/ActivityForm.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from './ActivityForm.module.css'; // Import the CSS module

const ActivityForm = ({ fetchActivities }) => {
    const [activity, setActivity] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = 'user123'; // Replace with actual user ID or pass it as a prop

        try {
            await axios.post('https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activity', {
                UserId: userId,
                ActivityId: "activity-from-fe",
                ActivityName: activity,
                Frequency: 4, // Default frequency
            });
            fetchActivities(); // Refresh activity list after adding
            setActivity('');
            setError(''); // Clear any previous error messages
        } catch (error) {
            console.error("Error adding activity", error);
            setError('Failed to add activity. Please try again.'); // Set an error message
        }
    };

    return (
        <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="Enter activity"
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>Add Activity</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default ActivityForm;