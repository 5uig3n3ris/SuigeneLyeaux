const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Only if you're using a custom connectDB function

// Load environment variables
dotenv.config();

// Connect to the database (optional if using Pool directly in models)
connectDB?.();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postsRoute');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
