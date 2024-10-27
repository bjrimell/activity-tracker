import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Box, Typography } from '@mui/material';

const ActivityForm = ({ fetchActivities }) => {
    const [activity, setActivity] = useState('');
    const [frequency, setFrequency] = useState('4'); // Default frequency of 4
    const [description, setDescription] = useState(''); // Optional description
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = 'user123'; // Replace with actual user ID or pass it as a prop

        try {
            await axios.post('https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activity', {
                UserId: userId,
                ActivityId: uuidv4(), // Generates a unique ID
                ActivityName: activity,
                Frequency: Number(frequency), // Ensures frequency is a number
                Description: description || '', // Optional description
            });
            fetchActivities(); // Refresh activity list after adding
            setActivity('');
            setFrequency('4'); // Reset to default frequency
            setDescription(''); // Reset description
            setError(''); // Clear any previous error messages
        } catch (error) {
            console.error("Error adding activity", error);
            setError('Failed to add activity. Please try again.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                maxWidth: 400,
                margin: 'auto',
                padding: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: 2,
                mt: 4,
            }}
        >
            <Typography variant="h5" mb={2}>Add New Activity</Typography>
            <TextField
                label="Activity Name"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                variant="outlined"
                required
                fullWidth
            />
            <TextField
                label="Daily Frequency"
                type="number"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                variant="outlined"
                required
                fullWidth
            />
            <TextField
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                multiline
                rows={3}
                fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Activity
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default ActivityForm;