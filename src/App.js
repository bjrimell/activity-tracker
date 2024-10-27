import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import { Container, Typography, CssBaseline, AppBar, Toolbar, Box, Tabs, Tab, Switch, createTheme, ThemeProvider } from '@mui/material';

const App = () => {
    const [value, setValue] = useState(1); // Set default to Existing Activities tab
    const [darkMode, setDarkMode] = useState(false); // State for dark mode

    // Create themes for light and dark mode
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#90caf9' : '#1976d2',
            },
            secondary: {
                main: darkMode ? '#f48fb1' : '#f50057',
            },
            background: {
                default: darkMode ? '#121212' : '#ffffff',
                paper: darkMode ? '#1e1e1e' : '#ffffff',
            },
        },
    });
    

    const handleChange = (event, newValue) => {
        setValue(newValue); // Update the selected tab
    };

    const handleThemeChange = () => {
        setDarkMode(!darkMode); // Toggle dark mode
    };

    return (
        <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
            <Router>
                <CssBaseline /> {/* Ensure consistent baseline styles */}
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Activities Tracker
                        </Typography>
                        <Switch checked={darkMode} onChange={handleThemeChange} />
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
        </ThemeProvider>
    );
};

export default App;
