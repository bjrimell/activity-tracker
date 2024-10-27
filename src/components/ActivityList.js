import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, Button, Box, LinearProgress } from '@mui/material';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [activeActivityId, setActiveActivityId] = useState(null); // Track the active activity

    const fetchActivities = async () => {
        try {
            const response = await axios.get('https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activities?UserId=user123');
            setActivities(response.data.activities || []);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const incrementCompletedCount = async (activityId) => {
        try {
            await axios.put(`https://7w5y9pjq74.execute-api.us-east-1.amazonaws.com/Prod/Activity/${activityId}`, {
                UserId: 'user123',
                CompletedCountIncrement: 1
            });
            fetchActivities();
        } catch (error) {
            console.error('Error updating completed count:', error);
        }
    };

    const startActivity = (activityId) => {
        if (!activeActivityId) {
            setActiveActivityId(activityId); // Set the active activity
        }
    };

    const finishActivity = (activityId) => {
        incrementCompletedCount(activityId); // Increment completion count
        setActiveActivityId(null); // Reset active activity
    };

    const calculateBackgroundColor = (completed, frequency) => {
        const progress = Math.min(completed / frequency, 1); // Ensure progress is maxed at 1
        const red = Math.round(255 * (1 - progress));
        const green = Math.round(255 * progress);
        return `rgba(${red}, ${green}, 150, 0.2)`; // Light shade with opacity
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Activities
            </Typography>
            {Array.isArray(activities) && activities.length > 0 ? (
                activities.map(activity => (
                    <Paper
                        key={activity.ActivityId}
                        sx={{
                            padding: 2,
                            marginBottom: 2,
                            backgroundColor: calculateBackgroundColor(activity.CompletedCount, activity.Frequency),
                            transition: 'background-color 0.3s',
                        }}
                        elevation={3}
                    >
                        <Typography variant="h6" component="h3">
                            {activity.ActivityName}
                        </Typography>
                        {activity.Description && (
                            <Typography variant="body2" color="textSecondary">
                                Description: {activity.Description}
                            </Typography>
                        )}
                        <Typography variant="body1">Today's Goal: {activity.Frequency}</Typography>
                        <Typography variant="body1">Today's Completed Count: {activity.CompletedCount}</Typography>

                        {/* Progress Bar */}
                        <LinearProgress
                            variant="determinate"
                            value={(activity.CompletedCount / activity.Frequency) * 100}
                            sx={{ height: 10, marginY: 2 }} // Set height and margin for the progress bar
                        />

                        <Box mt={1}>
                            {activity.CompletedCount === 0 && (
                                <Typography color="error">Get started today!</Typography>
                            )}
                            {activity.CompletedCount < activity.Frequency && (
                                <Typography color="warning.main">More to do still!</Typography>
                            )}
                            {activity.CompletedCount === activity.Frequency && (
                                <Typography color="primary">Great job! You've met your goal for today!</Typography>
                            )}
                            {activity.CompletedCount > activity.Frequency && (
                                <Typography color="success.main">Amazing! You've exceeded your goal!</Typography>
                            )}
                        </Box>

                        {activeActivityId === activity.ActivityId ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => finishActivity(activity.ActivityId)}
                                sx={{ marginTop: 2 }}
                            >
                                Finish Activity
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => startActivity(activity.ActivityId)}
                                sx={{ marginTop: 2 }}
                                disabled={activeActivityId !== null} // Disable if another activity is in progress
                            >
                                Start Activity
                            </Button>
                        )}
                    </Paper>
                ))
            ) : (
                <Typography variant="body1">No activities found.</Typography>
            )}
        </Box>
    );
};

export default ActivityList;
