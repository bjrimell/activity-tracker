import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, Button, Box, LinearProgress, MenuItem, Select, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme, color }) => ({
    backgroundColor: color === 'gold' ? '#FFD700' : theme.palette.success.main, // Gold color for exceeded, success color for completed
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '16px',
    padding: '6px 12px',
    margin: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        backgroundColor: color === 'gold' ? '#FFC107' : theme.palette.success.dark, // Darker shade on hover
        transform: 'scale(1.05)', // Slightly enlarge on hover
        transition: 'transform 0.2s ease-in-out',
    },
}));

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [activeActivityId, setActiveActivityId] = useState(null); // Track the active activity
    const [showCompleted, setShowCompleted] = useState(true); // State to toggle completed activities
    const [sortMethod, setSortMethod] = useState('alphabetical'); // State for sorting method

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

    const toggleCompletedFilter = () => {
        setShowCompleted(prev => !prev);
    };

    const handleSortChange = (event) => {
        setSortMethod(event.target.value);
    };

    const sortedActivities = () => {
        let filteredActivities = showCompleted
            ? activities
            : activities.filter(activity => activity.CompletedCount < activity.Frequency);

        return filteredActivities.sort((a, b) => {
            if (sortMethod === 'alphabetical') {
                return a.ActivityName.localeCompare(b.ActivityName);
            } else if (sortMethod === 'progress') {
                const progressA = a.CompletedCount / a.Frequency;
                const progressB = b.CompletedCount / b.Frequency;
                return progressA - progressB; // Sort by progress (ascending)
            }
            return 0; // No sorting
        });
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Activities
            </Typography>

            {/* Button to toggle completed activities filter */}
            <Button onClick={toggleCompletedFilter} variant="outlined" sx={{ marginBottom: 2 }}>
                {showCompleted ? 'Hide Completed Activities' : 'Show All Activities'}
            </Button>

            {/* Dropdown to select sorting method */}
            <Select
                value={sortMethod}
                onChange={handleSortChange}
                displayEmpty
                sx={{ 
                    marginBottom: 2, 
                    marginLeft: 2, 
                    minWidth: 200 // Adjust minimum width as needed
                }}
            >
                <MenuItem value="alphabetical">Sort Alphabetically</MenuItem>
                <MenuItem value="progress">Sort by Progress</MenuItem>
            </Select>

            {Array.isArray(sortedActivities()) && sortedActivities().length > 0 ? (
                sortedActivities().map(activity => (
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

                        {/* Circular Progress */}
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
                                <>
                                    <Typography color="primary">Great job! You've met your goal for today!</Typography>
                                    <StyledChip
                                        label="Completed"
                                        icon={<CheckCircleIcon />}
                                        sx={{ marginTop: 1 }} // Add margin to the badge
                                    />
                                </>
                            )}
                            {activity.CompletedCount > activity.Frequency && (
                                <>
                                    <StyledChip
                                        label="Exceeded"
                                        color="gold" // Pass gold color for exceeded
                                        icon={<CheckCircleIcon />}
                                        sx={{ marginTop: 1 }} // Add margin to the badge
                                    />
                                    <Typography color="success.main">Amazing! You've exceeded your goal!</Typography>
                                </>
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
