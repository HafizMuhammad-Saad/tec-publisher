// Pricing Engine for Educational Products
import { educationalProducts } from '../data/educationalProducts.js';

// Constants for discount calculation
const WRITING_SERIES_SUBJECTS = ['English', 'Urdu', 'Math'];
const READER_SUBJECTS = ['English', 'Urdu', 'Math', 'Islamiat'];
const COMPLETE_SET_PRICE = 2800;
const REGULAR_SET_PRICE = 3000;
const DISCOUNT_AMOUNT = 200;

/**
 * Calculate the total price for selected items with automatic discount application
 * @param {Array} cartItems - Array of items in cart
 * @returns {Object} - Total calculation result
 */
export const calculateCartTotal = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      subtotal: 0,
      discount: 0,
      total: 0,
      discountApplied: false,
      itemsBreakdown: []
    };
  }

  // Group items by category and subject for discount checking
  const writingSeriesItems = cartItems.filter(item => 
    item.category === 'Writing Series'
  );
  const readerItems = cartItems.filter(item => 
    item.category === 'Reader'
  );
  const otherItems = cartItems.filter(item => 
    item.category !== 'Writing Series' && item.category !== 'Reader'
  );

  // Check if complete set discount applies
  const hasCompleteWritingSeries = checkCompleteSet(writingSeriesItems, WRITING_SERIES_SUBJECTS);
  const hasCompleteReader = checkCompleteSet(readerItems, READER_SUBJECTS);
  const discountApplies = hasCompleteWritingSeries && hasCompleteReader;

  let subtotal = 0;
  let discount = 0;
  const itemsBreakdown = [];

  if (discountApplies) {
    // Apply discounted price for complete sets
    subtotal += COMPLETE_SET_PRICE;
    discount = DISCOUNT_AMOUNT;
    
    itemsBreakdown.push({
      category: 'Writing Series + Reader Complete Set',
      originalPrice: REGULAR_SET_PRICE,
      discountedPrice: COMPLETE_SET_PRICE,
      quantity: 1
    });

    // Add other items at regular price
    otherItems.forEach(item => {
      const itemTotal = (item.pricePerUnit || item.totalPrice) * (item.quantity || 1);
      subtotal += itemTotal;
      itemsBreakdown.push({
        category: item.name || item.category,
        price: item.pricePerUnit || item.totalPrice,
        quantity: item.quantity || 1,
        total: itemTotal
      });
    });
  } else {
    // Calculate all items at regular price
    cartItems.forEach(item => {
      const itemTotal = (item.pricePerUnit || item.totalPrice) * (item.quantity || 1);
      subtotal += itemTotal;
      itemsBreakdown.push({
        category: item.name || item.category,
        price: item.pricePerUnit || item.totalPrice,
        quantity: item.quantity || 1,
        total: itemTotal
      });
    });
  }

  return {
    subtotal,
    discount,
    total: subtotal - discount,
    discountApplied: discountApplies,
    itemsBreakdown
  };
};

/**
 * Check if a complete set of subjects is present in items
 * @param {Array} items - Items to check
 * @param {Array} requiredSubjects - Required subjects for complete set
 * @returns {boolean} - True if complete set is present
 */
function checkCompleteSet(items, requiredSubjects) {
  if (!items || items.length === 0) return false;
  
  const presentSubjects = new Set();
  
  items.forEach(item => {
    if (item.subject) {
      presentSubjects.add(item.subject);
    }
  });
  
  return requiredSubjects.every(subject => 
    presentSubjects.has(subject)
  );
}

/**
 * Get pricing breakdown for a specific product
 * @param {Object} product - Product to get pricing for
 * @returns {Object} - Pricing details
 */
export const getProductPricing = (product) => {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    basePrice: product.pricePerUnit || product.totalPrice,
    level: product.level,
    subject: product.subject,
    variants: product.variants || null
  };
};

/**
 * Check if current cart qualifies for any discounts
 * @param {Array} cartItems - Current cart items
 * @returns {Object} - Discount eligibility information
 */
export const checkDiscountEligibility = (cartItems) => {
  const writingSeriesItems = cartItems.filter(item => 
    item.category === 'Writing Series'
  );
  const readerItems = cartItems.filter(item => 
    item.category === 'Reader'
  );

  const hasAllWS = checkCompleteSet(writingSeriesItems, WRITING_SERIES_SUBJECTS);
  const hasAllRD = checkCompleteSet(readerItems, READER_SUBJECTS);

  return {
    qualifiesForDiscount: hasAllWS && hasAllRD,
    missingWS: WRITING_SERIES_SUBJECTS.filter(subject => 
      !writingSeriesItems.some(item => item.subject === subject)
    ),
    missingRD: READER_SUBJECTS.filter(subject => 
      !readerItems.some(item => item.subject === subject)
    ),
    discountAmount: DISCOUNT_AMOUNT
  };
};

/**
 * Format price for display
 * @param {number} price - Price to format
 * @returns {string} - Formatted price
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * Get recommended products based on current cart
 * @param {Array} cartItems - Current cart items
 * @returns {Array} - Recommended products
 */
export const getRecommendations = (cartItems) => {
  const recommendations = [];
  
  // Check if user is close to qualifying for discount
  const discountInfo = checkDiscountEligibility(cartItems);
  
  if (!discountInfo.qualifiesForDiscount) {
    // Add missing items to complete set
    const missingItems = [...discountInfo.missingWS, ...discountInfo.missingRD];
    
    missingItems.forEach(subject => {
      const missingProduct = educationalProducts.find(product => 
        (product.category === 'Writing Series' || product.category === 'Reader') &&
        product.subject === subject
      );
      
      if (missingProduct) {
        recommendations.push({
          ...missingProduct,
          reason: 'Complete your set and save $200!'
        });
      }
    });
  }
  
  return recommendations;
};

// Export constants for use in components
export {
  WRITING_SERIES_SUBJECTS,
  READER_SUBJECTS,
  COMPLETE_SET_PRICE,
  REGULAR_SET_PRICE,
  DISCOUNT_AMOUNT
};
