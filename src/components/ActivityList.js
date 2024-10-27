import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, Button, Box, LinearProgress, MenuItem, Select, Chip, Modal } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme, color }) => ({
    backgroundColor: color === 'gold' ? '#FFD700' : theme.palette.success.main,
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '16px',
    padding: '6px 12px',
    margin: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        backgroundColor: color === 'gold' ? '#FFC107' : theme.palette.success.dark,
        transform: 'scale(1.05)',
        transition: 'transform 0.2s ease-in-out',
    },
}));

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [activeActivityId, setActiveActivityId] = useState(null);
    const [showCompleted, setShowCompleted] = useState(true);
    const [sortMethod, setSortMethod] = useState('alphabetical');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentActivityId, setCurrentActivityId] = useState(null);

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
            handleCancelModal(); // Use handleCancelModal to close the modal after updating
        } catch (error) {
            console.error('Error updating completed count:', error);
        }
    };

    const openModalToStartActivity = (activityId) => {
        setCurrentActivityId(activityId);
        setModalOpen(true);
    };

    const handleCancelModal = () => {
        setModalOpen(false);
        setCurrentActivityId(null);
        setActiveActivityId(null); // Reset active activity to allow other buttons to be enabled
    };    

    const handleConfirmStart = () => {
        setActiveActivityId(currentActivityId);
        incrementCompletedCount(currentActivityId);
    };

    const calculateBackgroundColor = (completed, frequency) => {
        const progress = Math.min(completed / frequency, 1);
        const red = Math.round(255 * (1 - progress));
        const green = Math.round(255 * progress);
        return `rgba(${red}, ${green}, 150, 0.2)`;
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
                return progressA - progressB;
            }
            return 0;
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

            <Button onClick={toggleCompletedFilter} variant="outlined" sx={{ marginBottom: 2 }}>
                {showCompleted ? 'Hide Completed Activities' : 'Show All Activities'}
            </Button>

            <Select
                value={sortMethod}
                onChange={handleSortChange}
                displayEmpty
                sx={{ 
                    marginBottom: 2, 
                    marginLeft: 2, 
                    minWidth: 200
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

                        <LinearProgress
                            variant="determinate"
                            value={(activity.CompletedCount / activity.Frequency) * 100}
                            sx={{ height: 10, marginY: 2 }} 
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
                                        sx={{ marginTop: 1 }} 
                                    />
                                </>
                            )}
                            {activity.CompletedCount > activity.Frequency && (
                                <>
                                    <StyledChip
                                        label="Exceeded"
                                        color="gold"
                                        icon={<CheckCircleIcon />}
                                        sx={{ marginTop: 1 }} 
                                    />
                                    <Typography color="success.main">Amazing! You've exceeded your goal!</Typography>
                                </>
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => openModalToStartActivity(activity.ActivityId)}
                            sx={{ marginTop: 2 }}
                            disabled={activeActivityId !== null && activeActivityId !== activity.ActivityId}
                        >
                            Start Activity
                        </Button>
                    </Paper>
                ))
            ) : (
                <Typography variant="body1">No activities found.</Typography>
            )}

            {/* Modal for confirming start of activity */}
            <Modal
                open={modalOpen}
                onClose={handleCancelModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px',
                }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Activity in progress
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        Are you ready to finish this activity?
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Button onClick={handleCancelModal} color="error" sx={{ mr: 2 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmStart} variant="contained" color="primary">
                            Finish
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ActivityList;
