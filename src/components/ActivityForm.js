import React, { useState } from 'react';
import axios from 'axios';
import styles from './ActivityForm.module.css'; // Import the CSS module
import { v4 as uuidv4 } from 'uuid';

const ActivityForm = ({ fetchActivities }) => {
    const [activity, setActivity] = useState('');
    const [frequency, setFrequency] = useState('4'); // New state for frequency, defaulting to 4
    const [description, setDescription] = useState(''); // New state for description
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = 'user123'; // Replace with actual user ID or pass it as a prop

        try {
            await axios.post('https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activity', {
                UserId: userId,
                ActivityId: uuidv4(),
                ActivityName: activity,
                Frequency: Number(frequency), // Convert frequency to a number
                Description: description || '', // Use description or empty string if not provided
            });
            fetchActivities(); // Refresh activity list after adding
            setActivity('');
            setFrequency(''); // Reset frequency
            setDescription(''); // Reset description
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
                <input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="Enter daily frequency"
                    className={styles.input}
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter activity description (optional)"
                    className={styles.textarea}
                />
                <button type="submit" className={styles.button}>Add Activity</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default ActivityForm;