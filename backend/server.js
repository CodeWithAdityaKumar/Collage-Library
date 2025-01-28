const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON bodies
app.use(express.json());

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "index.html"));
});

// Route for faculty login page
app.get('/faculty-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'faculty-login.html'));
});

// Route for admin login page
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'admin-login.html'));
});

// Route for user dashboard
app.get('/user-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'userDashboard.html'));
});

// Route for admin dashboard
app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'adminDashboard.html'));
});

// Error handling middleware for file not found
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Error handling middleware for server errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});