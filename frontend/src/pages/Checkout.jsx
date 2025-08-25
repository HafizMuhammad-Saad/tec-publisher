import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Upload, MessageCircle, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';
import toast from 'react-hot-toast';
import axios from 'axios';

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

    const API_BASE = import.meta.env.VITE_API_BASE;

  const [orderId] = useState(() => 'ORD-' + Date.now().toString().slice(-8));

  const subtotal = getCartTotal();
  const shipping = 200;
  const total = subtotal + shipping;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    setPaymentScreenshot(file);
  };

  const handleWhatsAppClick = async () => {
    if (!paymentScreenshot) {
      toast.error('Please upload the payment screenshot first!');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all required customer information!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('customerInfo', JSON.stringify(customerInfo));
      formData.append('items', JSON.stringify(cart));
      formData.append('pricing', JSON.stringify({ subtotal, shipping, total }));
      formData.append('paymentScreenshot', paymentScreenshot);

      await axios.post(`/api/orders`, formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });

      const message = `Hello! I have made the payment for my order.

*Order Details:*
Order ID: ${orderId}
Total Amount: ${formatPrice(total)}

*Customer Information:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
${customerInfo.email ? `Email: ${customerInfo.email}\n` : ''}Address: ${customerInfo.address}

*Items Ordered:*
${cart.map(item => `• ${item.title} (Qty: ${item.quantity}) - ${formatPrice(item.price * item.quantity)}`).join('\n')}

I have attached the payment screenshot. Please confirm my order. Thank you!`;

      window.open(`https://wa.me/923062472977?text=${encodeURIComponent(message)}`, '_blank');
      
      toast.success('WhatsApp opened! Please send the screenshot to complete your order.');
      navigate('/cart');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save order. Please try again.');
    } finally {
      setPaymentScreenshot(null);
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });
      
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4">
        <button
          onClick={() => navigate('/cart')}
          className="btn-outline mb-6 inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title}
                    </h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatPrice((item.discountedPrice ?? item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping}
                </span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div> */}
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Lock className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Manual Payment
              </h2>
            </div>

            {/* Order Information */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Order Details</h3>
              <p className="text-blue-800">Order ID: <span className="font-mono font-bold">{orderId}</span></p>
              <p className="text-blue-800">Total Amount: <span className="font-bold">{formatPrice(total)}</span></p>
            </div>

            {/* Customer Information Form */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="03XX-XXXXXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address *
                  </label>
                  <textarea
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                    placeholder="Enter your complete address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 mb-3">Payment Instructions</h3>
              <p className="text-sm text-green-800 mb-3">
                Please make a payment of <span className="font-bold">{formatPrice(total)}</span> to one of the following accounts:
              </p>
              
              <div className="space-y-4">
                {/* JazzCash */}
                <div className="bg-white p-3 rounded border border-green-300">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">JC</span>
                    </div>
                    <span className="font-semibold text-gray-900">JazzCash</span>
                  </div>
                  <p className="text-gray-700">Number: <span className="font-mono font-bold">0300-XXXXXXX</span></p>
                  <p className="text-gray-700">Account Holder: <span className="font-semibold">Your Name</span></p>
                </div>
                
                {/* Easypaisa */}
                <div className="bg-white p-3 rounded border border-green-300">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">EP</span>
                    </div>
                    <span className="font-semibold text-gray-900">Easypaisa</span>
                  </div>
                  <p className="text-gray-700">Number: <span className="font-mono font-bold">0321-XXXXXXX</span></p>
                  <p className="text-gray-700">Account Holder: <span className="font-semibold">Your Name</span></p>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Please mention Order ID <span className="font-mono">{orderId}</span> in the transaction message.
                </p>
              </div>
            </div>

            {/* Upload Payment Screenshot */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Payment Screenshot *
              </label>
              <input
                type="file"
                accept="image/*"
                className="input-field w-full"
                onChange={handleScreenshotChange}
                required
              />
            </div>

            {/* Send on WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-colors duration-200 ${
                !paymentScreenshot || !customerInfo.name || !customerInfo.phone || !customerInfo.address
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              }`}
              disabled={!paymentScreenshot || !customerInfo.name || !customerInfo.phone || !customerInfo.address}
            >
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Send Screenshot on WhatsApp
            </button>

            {/* Status Messages */}
            <div className="mt-2 space-y-1">
              {!paymentScreenshot && (
                <p className="text-red-500 text-sm">
                  <AlertCircle className="inline w-4 h-4 mr-1" /> Payment screenshot is required
                </p>
              )}
              {(!customerInfo.name || !customerInfo.phone || !customerInfo.address) && (
                <p className="text-red-500 text-sm">
                  <AlertCircle className="inline w-4 h-4 mr-1" /> Please fill in all required customer information
                </p>
              )}
              {paymentScreenshot && customerInfo.name && customerInfo.phone && customerInfo.address && (
                <p className="text-green-500 text-sm">
                  <CheckCircle className="inline w-4 h-4 mr-1" /> Ready to send order details
                </p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  <span>SSL Secured</span>
                </div>
                <div>•</div>
                <div>256-bit Encryption</div>
                <div>•</div>
                <div>PCI Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

