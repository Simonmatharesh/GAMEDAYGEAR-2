const express = require('express');
    const router = express.Router();
    const Order = require('./Order');

    // Get all orders
    router.get('/', async (req, res) => {
        try {
            const orders = await Order.find().sort({ orderDate: -1 });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching orders.' });
        }
    });

    // Update order status
    router.put('/:orderId/status', async (req, res) => {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            // Validate status value
            const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status value.' });
            }

            const order = await Order.findByIdAndUpdate(
                orderId,
                { status },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({ message: 'Order not found.' });
            }

            res.json(order);
        } catch (error) {
            res.status(500).json({ message: 'Error updating order status.' });
        }
    });

    module.exports = router;