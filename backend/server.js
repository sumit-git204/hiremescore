require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

// Middleware
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    }
}));
app.options('*', cors());
app.use(express.json());

// Connect Database
// connectDB(); // Uncomment when DB URL is available

// Basic Route
app.get('/', (req, res) => {
    res.send('HireMeScore API Running');
});

// Define Routes
app.use('/api', require('./routes/apiRoutes'));

app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});
