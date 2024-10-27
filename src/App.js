import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import { Container, Typography, CssBaseline, AppBar, Toolbar, Box, Tabs, Tab } from '@mui/material';

const App = () => {
    const [value, setValue] = useState(1); // Set default to Existing Activities tab

    const handleChange = (event, newValue) => {
        setValue(newValue); // Update the selected tab
    };

    return (
        <Router>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Activities Tracker
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ marginTop: 4 }}>
                <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Track Your Daily Activities
                    </Typography>
                </Box>
                {/* Tabs for switching between forms */}
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="New Activity" />
                    <Tab label="Existing Activities" />
                </Tabs>
                {value === 0 && <ActivityForm fetchActivities={() => {}} />} {/* New Activity Form */}
                {value === 1 && <ActivityList />} {/* Existing Activities List */}
            </Container>
        </Router>
    );
};

export default App;
