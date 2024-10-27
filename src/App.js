import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import './App.css'; // Regular CSS import

const App = () => {
    return (
        <Router>
            <div className="appContainer">
                <h1 className="appHeader">Activities Tracker</h1>
                <div className="appContent">
                    <ActivityForm fetchActivities={() => {}} />
                    <ActivityList />
                </div>
            </div>
        </Router>
    );
};

export default App;
