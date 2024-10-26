// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Activities Tracker</h1>
                <ActivityForm fetchActivities={() => {}} />
                <ActivityList />
            </div>
        </Router>
    );
};

export default App;