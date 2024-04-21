const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Secret key for JWT
const secretKey = 'your_secret_key';

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
    const token = req.cookies['auth_token'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey); 
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
};


// Add the logout route
router.post('/logout', (req, res) => {
    // Clear the authentication cookie
    res.cookie('auth_token', '', {
        httpOnly: true,  // Prevents client-side access to the cookie
        secure: process.env.NODE_ENV === 'production',  // Cookie is only sent over HTTPS in production
        maxAge: 0,  // Expiration time in milliseconds (1 hour)
        sameSite: 'strict'  // Mitigates CSRF attacks
    });
    res.clearCookie('auth_token');
    // Return a success response
    res.json({
        success: true,
        message: 'Logout successful'
    });
});


// Sign up route
router.post('/sign-up', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await bcryptjs.compare(password, user.password)) {
            // Generate a JWT token
            const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

            // Set the token as a cookie
            res.cookie('auth_token', token, {
                httpOnly: true,  // Prevents client-side access to the cookie
                secure: process.env.NODE_ENV === 'production',  // Cookie is only sent over HTTPS in production
                maxAge: 3600000,  // Expiration time in milliseconds (1 hour)
                sameSite: 'strict'  // Mitigates CSRF attacks
            });

            // Send a success response
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
});

// Get all users route (protected)
router.get('/get-all/users', verifyToken, async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
    }
});

// Get user route (protected)
router.get('/get/user', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findOne();
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve user', error: error.message });
    }
});

// Get user by ID route (protected)
router.get('/get-user/:id', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve user', error: error.message });
    }
});

// Update user route (protected)
router.put('/user/update/:id', verifyToken, async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedUser) {
            res.json({ success: true, updatedUser });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
    }
});

// Delete user route (protected)
router.delete('/user/delete/:id', verifyToken, async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            res.json({ success: true, message: 'User deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
    }
});

// Export the router
module.exports = router;
