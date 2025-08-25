// Educational Product Catalog with complete pricing structure
export const educationalProducts = [
  // Writing Series - English, Urdu, Math
  {
    id: 'ws-eng',
    name: "Writing Series - English",
    category: "Writing Series",
    subject: "English",
    levels: [1, 2, 3, 4, 5, 6, 7],
    pricePerUnit: 1000,
    totalPrice: 1000,
    variants: {
      yearBook: {
        blue: { year: 4, priceModifier: 0 },
        yellow: { year: 5, priceModifier: 0 },
        red: { year: 3, priceModifier: 0 }
      }
    }
  },
  {
    id: 'ws-urd',
    name: "Writing Series - Urdu",
    category: "Writing Series",
    subject: "Urdu",
    levels: [1, 2, 3, 4, 5, 6, 7],
    pricePerUnit: 1000,
    totalPrice: 1000,
    variants: {
      yearBook: {
        blue: { year: 4, priceModifier: 0 },
        yellow: { year: 5, priceModifier: 0 },
        red: { year: 3, priceModifier: 0 }
      }
    }
  },
  {
    id: 'ws-mat',
    name: "Writing Series - Math",
    category: "Writing Series",
    subject: "Math",
    levels: [1, 2, 3, 4, 5, 6, 7],
    pricePerUnit: 1000,
    totalPrice: 1000,
    variants: {
      yearBook: {
        blue: { year: 4, priceModifier: 0 },
        yellow: { year: 5, priceModifier: 0 },
        red: { year: 3, priceModifier: 0 }
      }
    }
  },

  // Reader - English, Urdu, Math, Islamiat
  {
    id: 'rd-eng',
    name: "Reader - English",
    category: "Reader",
    subject: "English",
    levels: [1, 2, 3, 4, 5, 6, 7],
    pricePerUnit: 1000,
    totalPrice: 1000,
    variants: {
      yearBook: {
        blue: { year: 4, priceModifier: 0 },
        yellow: { year: 5, priceModifier: 0 },
        red: { year: 3, priceModifier: 0 }
      }
    }
  },
  {
    id: 'rd-urd',
    name: "Reader - Urdu",
    category: "Reader",
    subject: "Urdu",
    levels: [1, 2, 3, 4, 5, 6, 7],
    pricePerUnit: 1000,
    totalPrice: 1000,
    variants: {
      yearBook: {
        blue: { year: 4, priceModifier: 0 },
        yellow: { year: 5, priceModifier: 0 },
        red: { year: 3, priceModifier: 0 }
      }
    }
  },
  {
    id: 'rd-mat',
    name: "Reader - Math",
    category: "Reader",
    subject: "Math",
    levels: [1, 2, 3, 4, 5, 6, 7],
    pricePerUnit: 1000,
    totalPrice: 1000,
    variants: {
      yearBook: {
        blue: { year: 4, priceModifier: 0 },
        yellow: { year: 5, priceModifier: 0 },
        red: { year: 3, priceModifier: 0 }
      }
    }
  },
  {
    id: 'rd-isl',
    name: "Reader - Islamiat",
    category: "Reader",
    subject: "Islamiat",
    levels: [1, 2, 3, 4, 5, 6, 7],
    pricePerUnit: 1000,
    totalPrice: 1000,
    variants: {
      yearBook: {
        blue: { year: 4, priceModifier: 0 },
        yellow: { year: 5, priceModifier: 0 },
        red: { year: 3, priceModifier: 0 }
      }
    }
  },

  // Year Book variants
  {
    id: 'yb-blue',
    name: "Year Book - Blue (Year 4)",
    category: "Year Book",
    color: "Blue",
    year: 4,
    pricePerUnit: 0,
    totalPrice: 0,
    appliesTo: ["Writing Series", "Reader"]
  },
  {
    id: 'yb-yellow',
    name: "Year Book - Yellow (Year 5)",
    category: "Year Book",
    color: "Yellow",
    year: 5,
    pricePerUnit: 0,
    totalPrice: 0,
    appliesTo: ["Writing Series", "Reader"]
  },
  {
    id: 'yb-red',
    name: "Year Book - Red (Year 3)",
    category: "Year Book",
    color: "Red",
    year: 3,
    pricePerUnit: 0,
    totalPrice: 0,
    appliesTo: ["Writing Series", "Reader"]
  },

  // Math Books - levels 1-7
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `math-${i + 1}`,
    name: `Math Book - Level ${i + 1}`,
    category: "Math Books",
    level: i + 1,
    pricePerUnit: 1400,
    totalPrice: 1400,
    subjects: ["Mathematics"]
  })),

  // Science Books - levels 1-7
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `sci-${i + 1}`,
    name: `Science Book - Level ${i + 1}`,
    category: "Science Books",
    level: i + 1,
    pricePerUnit: 1400,
    totalPrice: 1400,
    subjects: ["Science"]
  })),

  // Practice Worksheet Folder - levels 1-8, 4 subjects
  ...Array.from({ length: 8 }, (_, levelIndex) => [
    {
      id: `pwf-${levelIndex + 1}-urd`,
      name: `Practice Worksheet Folder - Urdu Level ${levelIndex + 1}`,
      category: "Practice Worksheet Folder",
      subject: "Urdu",
      level: levelIndex + 1,
      pricePerUnit: 450,
      totalPrice: 450
    },
    {
      id: `pwf-${levelIndex + 1}-eng`,
      name: `Practice Worksheet Folder - English Level ${levelIndex + 1}`,
      category: "Practice Worksheet Folder",
      subject: "English",
      level: levelIndex + 1,
      pricePerUnit: 450,
      totalPrice: 450
    },
    {
      id: `pwf-${levelIndex + 1}-mat`,
      name: `Practice Worksheet Folder - Math Level ${levelIndex + 1}`,
      category: "Practice Worksheet Folder",
      subject: "Math",
      level: levelIndex + 1,
      pricePerUnit: 450,
      totalPrice: 450
    },
    {
      id: `pwf-${levelIndex + 1}-sci`,
      name: `Practice Worksheet Folder - Science Level ${levelIndex + 1}`,
      category: "Practice Worksheet Folder",
      subject: "Science",
      level: levelIndex + 1,
      pricePerUnit: 450,
      totalPrice: 450
    }
  ]).flat()
];

// Discount logic implementation
export const calculateTotal = (selectedItems) => {
  let total = 0;
  let discountApplied = false;
  
  // Check for Writing Series + Reader complete set discount
  const writingSeriesItems = selectedItems.filter(item => 
    item.category === "Writing Series"
  );
  const readerItems = selectedItems.filter(item => 
    item.category === "Reader"
  );
  
  // Check if all Writing Series subjects are present
  const wsSubjects = ["English", "Urdu", "Math"];
  const hasAllWS = wsSubjects.every(subject => 
    writingSeriesItems.some(item => item.subject === subject)
  );
  
  // Check if all Reader subjects are present
  const rdSubjects = ["English", "Urdu", "Math", "Islamiat"];
  const hasAllRD = rdSubjects.every(subject => 
    readerItems.some(item => item.subject === subject)
  );
  
  // Apply discount if complete set is present
  if (hasAllWS && hasAllRD) {
    discountApplied = true;
    total += 2800; // Discounted price for complete set
    
    // Remove individual Writing Series and Reader items from calculation
    const otherItems = selectedItems.filter(item => 
      item.category !== "Writing Series" && item.category !== "Reader"
    );
    
    // Add prices for other items
    otherItems.forEach(item => {
      total += item.totalPrice || item.pricePerUnit;
    });
  } else {
    // No discount, calculate normally
    selectedItems.forEach(item => {
      total += item.totalPrice || item.pricePerUnit;
    });
  }
  
  return {
    total,
    discountApplied,
    discountAmount: discountApplied ? 200 : 0 // 3000 - 2800 = 200 discount
  };
};

// Helper function to get products by category
export const getProductsByCategory = (category) => {
  return educationalProducts.filter(product => product.category === category);
};

// Helper function to get products by level
export const getProductsByLevel = (level) => {
  return educationalProducts.filter(product => product.level === level);
};

// Helper function to search products
export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return educationalProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    (product.subject && product.subject.toLowerCase().includes(lowercaseQuery))
  );
};

// Cart management utilities
export const addToCart = (cart, product) => {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    return cart.map(item => 
      item.id === product.id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  
  return [...cart, { ...product, quantity: 1 }];
};

export const removeFromCart = (cart, productId) => {
  return cart.filter(item => item.id !== productId);
};

export const updateQuantity = (cart, productId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  return cart.map(item => 
    item.id === productId 
      ? { ...item, quantity }
      : item
  );
};
