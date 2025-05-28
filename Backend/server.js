const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./Routes/authRoutes');
const postRoutes = require('./Routes/postsRoute');
const commentRoutes = require('./Routes/commentRoutes');
const bookmarkRoutes = require('./Routes/bookmarkRoutes');
const likeRoutes = require('./Routes/likeRoutes');



//middlewares
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/likes', likeRoutes);




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
