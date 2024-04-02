const express = require('express');
const path = require('path');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'SCUMBAG0LEE', // Change this to a secure random string
    resave: false,
    saveUninitialized: true
}));

// MongoDB URI
const uri = "mongodb+srv://admin:admin@stuff0.3hwe0qo.mongodb.net/?retryWrites=true&w=majority&appName=Stuff0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
}
run().catch(console.dir);

// Mongoose User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Registration route
app.post('/register', async (req, res) => {
    const { email, password, username, name } = req.body;

    // Check for empty fields
    if (!email || !password || !username || !name) {
        //return res.send('All fields are required');
        return res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            FieldAlert();
        </script>
    `);
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            //return res.send('User already exists');
            return res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            Register1();
        </script>
    `);
        }

        // Create new user
        const newUser = new User({ email, password, username, name });
        await newUser.save();
        res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            RegisterYes();
        </script>
    `);
    } catch (error) {
        console.error('Error registering user:', error);
        //res.send('An error occurred while registering');
        res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            RegisterNo();
        </script>
    `);
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
        //return res.send('All fields are required');
        return res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            FieldAlert();
        </script>
    `);
    }

    try {
        // Find user by email or username
        const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
        if (!user || user.password !== password) {
            //return res.send('Invalid email/username or password');
            return res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            Login1();
        </script>
    `);
        }

        // Store user information in session
        req.session.user = user;

        // Generate token
        const token = jwt.sign({ userId: user._id }, 'FUCKINGSHIT', { expiresIn: '1h' });

        // Set token as cookie
        res.cookie('token', token, { httpOnly: true });

        // Redirect to homepage after successful login
        res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            LoginYes();
        </script>
    `);
    } catch (error) {
        console.error('Error logging in:', error);
        //res.send('An error occurred while logging in');
        res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            LoginNo();
        </script>
    `);
    }
});

// Define a route to render the index page
app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('index', { user: user });
});

// Define a route to render the login page
app.get('/auth', (req, res) => {
    if (req.session.user) {
        // If user is already logged in, redirect to homepage or any other page
        //return res.redirect('/');
        return res.send(`
        <script src="login/script.js"></script>
        <script>
            // Call the function defined in script.js
            Login2();
        </script>
    `);
    }
    res.render('login');
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear token cookie on logout
    req.session.destroy(); // Destroy session
    res.redirect('/');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}, http://localhost:${port}`);
});
