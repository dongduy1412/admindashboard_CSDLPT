const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getConnection } = require('./config/database');
const khutroRoutes = require('./routes/khutroRoutes');
const phongtroRoutes = require('./routes/phongtroRoutes');
const khachthueRoutes = require('./routes/khachthueRoutes');
const hopdongRoutes = require('./routes/hopdongRoutes');
const hoadonRoutes = require('./routes/hoadonRoutes');
const nguoidungRoutes = require('./routes/nguoidungRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/khutro', khutroRoutes);
app.use('/api/phongtro', phongtroRoutes);
app.use('/api/khachthue', khachthueRoutes);
app.use('/api/hopdong', hopdongRoutes);
app.use('/api/hoadon', hoadonRoutes);
app.use('/api/nguoidung', nguoidungRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'QuanLyTro API is running' });
});

// Test database connection before starting server
const startServer = async () => {
    try {
        console.log('Testing database connection...');
        await getConnection();
        console.log('Database connected successfully!');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API endpoint: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
        console.error('Server will not start. Please check your .env configuration.');
        process.exit(1);
    }
};

startServer();
