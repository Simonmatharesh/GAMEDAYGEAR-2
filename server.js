const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./User"); // Import your User model

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/urbanWearDB")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error(err));

// **Register Route (Stores Plain Password)**
app.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;  // ✅ Get all fields

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ fullName, email, password, phone, address }); // ✅ Save all fields
        await newUser.save();

        res.json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
});




// **Login Route**
app.post("/login", async (req, res) => {
    try {
        console.log("Received data:", req.body); // Log received data

        const { email, password } = req.body;

        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Invalid email format", received: req.body });
        }

        // 🔥 Print all users from MongoDB
        const allUsers = await User.find();
        console.log("Users in DB:", allUsers);

        // ✅ Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found in DB", received: req.body });
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

    } 
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login error" });
    }
});


// **Fetch User Profile Route**
// **Fetch User Profile Route**
app.get("/profile", async (req, res) => {
    try {
        const email = req.query.email; // Get email from query parameter

        if (!email) {
            return res.status(400).json({ message: "No email provided" });
        }

        const user = await User.findOne({ email }); // Search for user by email

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});




// **Start Server**
app.listen(5000, () => console.log("🔥 Server running on port 5000"));
