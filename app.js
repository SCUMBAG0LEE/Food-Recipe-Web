const express = require('express');
const path = require('path');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to render the EJS template
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/auth', (req, res) => {
    res.redirect('/');
});

// Define a route to render the EJS template
app.get('/test', (req, res) => {
    res.render('test');
});

// Define a route to render the EJS template
app.get('/auth', (req, res) => {
    res.render('login');
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}, http://localhost:${port}`);
});
