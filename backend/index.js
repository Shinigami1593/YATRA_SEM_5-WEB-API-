const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB().then(() => {
  console.log('Database connection established, starting server...');
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error.message);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend origin

// Routes
const userRoute = require('./routes/userRoutes'); // Match your route file name
app.use('/api/v1/auth/users', userRoute); // Match frontend's axios baseURL

//Admin routes
const adminRoute = require('./routes/admin/adminRoutes');
app.use('/api/v1/auth/admin', adminRoute);

// Health check
app.get('/', (req, res) => res.send('API is running'));

const PORT = process.env.PORT || 5050; // Changed to 5050
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));