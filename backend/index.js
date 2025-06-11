const express = require('express');
const cors = require('cors');
require('./config/db');

const app = express();

app.use(express.json());
app.use(cors());

// Routes
const userRoute = require('./routes/userRoutes');
app.use('/api/v1/auth/user', userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));