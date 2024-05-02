const express = require('express');
const path = require('path');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const app = express();
const multer = require('multer');

// Import the hashString function
function hashString(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

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
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Registration route
app.post('/register', async (req, res) => {
    const { email, password, username, name } = req.body;

    // Check for empty fields
    if (!email || !password || !username || !name) {
        return res.send(`
        <script src="login/script.js"></script>
        <script>
            FieldAlert();
        </script>
    `);
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.send(`
        <script src="login/script.js"></script>
        <script>
            Register1();
        </script>
    `);
        }

        // Hash the password
        const hashedPassword = hashString(password);

        // Create new user with hashed password and assign role
        const newUser = new User({ email, password: hashedPassword, username, name, role: 'user' });
        await newUser.save();
        res.send(`
        <script src="login/script.js"></script>
        <script>
            RegisterYes();
        </script>
    `);
    } catch (error) {
        console.error('Error registering user:', error);
        res.send(`
        <script src="login/script.js"></script>
        <script>
            RegisterNo();
        </script>
    `);
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
        return res.send(`
        <script src="login/script.js"></script>
        <script>
            FieldAlert();
        </script>
    `);
    }

    try {
        // Find user by email or username
        const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
        if (!user || user.password !== hashString(password)) {
            return res.send(`
        <script src="login/script.js"></script>
        <script>
            Login1();
        </script>
    `);
        }

        // Store user information in session
        req.session.user = user;

        // Generate token
        const token = jwt.sign({ userId: user._id }, 'Stuff', { expiresIn: '1h' });

        // Set token as cookie
        res.cookie('token', token, { httpOnly: true });

        res.send(`
        <script src="login/script.js"></script>
        <script>
            LoginYes();
        </script>
    `);
    } catch (error) {
        console.error('Error logging in:', error);
        res.send(`
        <script src="login/script.js"></script>
        <script>
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


//STEVAN
// Route for adding recipes (accessible only to admin users)
app.post('/add-recipe', isAdmin, async (req, res) => {
    // Logic to add a recipe to the database
    // This route will only be accessible to admin users
});

// Main page route
app.get('/main', (req, res) => {
    const user = req.session.user;
    // Render main page with recipes if the user is an admin
    if (user && user.isAdmin) {
        // Logic to fetch and render recipes from the database
    } else {
        // Logic to render main page without recipes
    }
});

// Define a route to render the login page
app.get('/auth', (req, res) => {
    if (req.session.user) {
        return res.send(`
        <script src="login/script.js"></script>
        <script>
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

//Route to render account page
app.get('/acc', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/auth');
    }
    res.render('acc', {user: user});
})


// Route to handle account updates
app.post('/update', async (req, res) => {
    // Retrieve the current user's ID from the session cookie
    const userId = req.session.user._id;
    const { username, name, email, password } = req.body; // Include 'username' here

    // Validate that all required fields are provided
    if (!userId || !username || !name || !email || !password) {
        console.log('All fields are required'); // Log this message
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Find the user by their ID
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = hashString(password);

        // Update the user's information
        existingUser.username = username;
        existingUser.name = name;
        existingUser.email = email;
        existingUser.password = hashedPassword;
        await existingUser.save();

        // Send a success response
        res.send(`
        <script src="account/script.js"></script>
        <script>
        UpdateSuccess();
        </script>
    `);
    } catch (error) {
        console.error('Error updating account:', error);
        // Send an error response
        res.status(500).json({ error: 'Failed to update account' });
    }
});

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    const user = req.session.user;
    if (!user || user.role !== 'admin') {
        // If user is not admin, send a message
        return res.send(`
            <script>alert("You have to be an admin to open this");
            window.location.href = '/';
            }, 1000);
            </script>
        `);
    }
    // If user is admin, continue to the next middleware
    next();
}

// Route to render the admin-dashboard page
app.get('/admin-dashboard', isAdmin, async (req, res) => {
    try {
        // Fetch all users from the database except the admin user
        const users = await User.find({ role: { $ne: 'admin' } }, '-password'); // Exclude password field from the result

        // Pass the user variable to the admin-dashboard view
        const user = req.session.user || null;

        // Render the admin-dashboard view with the user data
        res.render('admin-dashboard', { user: user, users: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle deletion of a user
app.post('/admin-dashboard/delete/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find user by ID and delete from database
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}, http://localhost:${port}`);
});
