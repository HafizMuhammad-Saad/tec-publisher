import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// import serverless from 'serverless-http';


// Import configurations and routes
import connectDB from './config/database.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import uploadRoutes from './routes/upload.js';


// Load environment variables
dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.ORIGIN,
    exposedHeaders: ['X-Total-Count'],
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE', 'OPTIONS'],}));
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 500 : 10000,
  message: "Too many requests, please slow down.",
});
app.use('/api/', limiter);




// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, 'uploads/payment-screenshots');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// Serve uploaded files statically (for admin to view payment screenshots)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});



// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.'
    });
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed for payment screenshots.'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  
    console.log(`Server is running in development mode on http://localhost:${PORT}`);
});

// export default app;
// export const handler = serverless(app);

