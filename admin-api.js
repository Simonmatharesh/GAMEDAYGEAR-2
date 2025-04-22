const express = require('express');
const router = express.Router();
const Order = require('./Order');
const jwt = require('jsonwebtoken');
const { defaultAdminCredentials } = require('./admin-credentials');

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Admin login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Simple direct comparison with default admin credentials
        if (username !== defaultAdminCredentials.username || 
            password !== defaultAdminCredentials.password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            success: true,
            message: 'Login successful',
            token: token,
            user: { username: username }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get all orders - no authentication required for simplicity
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders.' });
    }
});

module.exports = router;