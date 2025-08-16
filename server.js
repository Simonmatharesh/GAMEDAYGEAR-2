const express = require("express");
const Stripe = require("stripe");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./User"); 
const Order = require("./Order"); 
const adminRoutes = require('./admin-api');
const stripe = new Stripe("sk_test_51RwcMmFa94hu4vqgTb5wFCkajgEVeJdkFmFSCo3g3wakbGV8tT5UasyYHwXllTKRyi9VZemOliJtpG9oARYv0I7t00ga11gM5e");
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/urbanWearDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Admin routes
app.use('/api/admin', adminRoutes);

// Admin orders routes
const adminOrdersRoutes = require('./admin-orders');
app.use('/api/admin/orders', adminOrdersRoutes);

app.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;  

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ fullName, email, password, phone, address }); 
        await newUser.save();

        res.json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
});

app.post("/login", async (req, res) => {
    try {
        console.log("Received data:", req.body); 

        const { email, password } = req.body;

        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Invalid email format", received: req.body });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login error" });
    }
});

app.get("/user/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Create Order endpoint
// Get user orders endpoint
app.get("/api/orders/user", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "No authentication token provided"
            });
        }

        const token = authHeader.split(' ')[1];
        const userEmail = token; // Since we're using email as token for simplicity

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find all orders for the user
        const orders = await Order.find({ userId: user._id }).sort({ orderDate: -1 });

        res.json(orders);
    } catch (err) {
        console.error("Error fetching user orders:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: err.message
        });
    }
});

// ✅ Create Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const cartItems = req.body.items; // ← get it from frontend
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // in cents
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: 'http://localhost:5000/success',
      cancel_url: 'http://localhost:5000/cancel'
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});




app.post("/createOrder", async (req, res) => {
    try {
        const { userEmail, items, totalAmount, shippingAddress } = req.body;

        // Validate required fields
        if (!userEmail || !items || !totalAmount || !shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Create new order
        const newOrder = new Order({
            userId: user._id,
            items: items,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress
        });

        await newOrder.save();

        res.json({
            success: true,
            message: "Order created successfully",
            orderId: newOrder._id
        });
    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
