import express from 'express';
import Order from '../models/Order.js';
import upload from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create new order (public route)
router.post('/', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const {
      orderId,
      customerInfo,
      items,
      pricing
    } = req.body;

    // Parse JSON strings from FormData
    const parsedCustomerInfo = typeof customerInfo === 'string' ? JSON.parse(customerInfo) : customerInfo;
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    const parsedPricing = typeof pricing === 'string' ? JSON.parse(pricing) : pricing;

    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required' });
    }

    // Create order
    const order = new Order({
      orderId,
      customerInfo: parsedCustomerInfo,
      items: parsedItems,
      pricing: parsedPricing,
      paymentScreenshot: req.file.filename,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: order.orderId
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create order',
      error: error.message 
    });
  }
});

// Get all orders (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      startDate, 
      endDate,
      search 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Date filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
      }
    }

    // Search filter
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: 'orderId customerInfo pricing status createdAt'
    };

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
});

// Get single order by ID (admin only)
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch order',
      error: error.message 
    });
  }
});

// Update order status (admin only)
router.patch('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    order.status = status;
    if (notes !== undefined) {
      order.notes = notes;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update order',
      error: error.message 
    });
  }
});

// Mark WhatsApp as sent (public route - called after WhatsApp redirect)
router.patch('/:orderId/whatsapp-sent', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    order.whatsappSent = true;
    await order.save();

    res.json({
      success: true,
      message: 'WhatsApp status updated'
    });

  } catch (error) {
    console.error('Error updating WhatsApp status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update WhatsApp status',
      error: error.message 
    });
  }
});

// Get order statistics (admin only)
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    
    // Total revenue from confirmed/delivered orders
    const revenueOrders = await Order.find({ 
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } 
    });
    const totalRevenue = revenueOrders.reduce((sum, order) => sum + order.pricing.total, 0);

    // Orders from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = await Order.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        totalRevenue,
        recentOrders
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
});

export default router;
