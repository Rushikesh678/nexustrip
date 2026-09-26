/**
 * AI Receipt Parsing Service (Simulated & Intelligent Extractor)
 * Handles image/PDF receipt data extraction with confidence rating,
 * breakdown of items, subtotal, tax, tip, and total.
 */

async function parseReceiptData(fileBuffer, fileName, mimeType) {
  // Simulate OCR processing latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // Intelligent mock data extraction based on file name or smart defaults
  const merchants = ['Beachside Bistro', 'Grand Alpine Resort', 'Highland Excursions', 'Tiki Lounge & Cafe', 'Skyline Taxi & Shuttle'];
  const categories = ['FOOD', 'ACCOMMODATION', 'ACTIVITY', 'FOOD', 'TRANSPORT'];
  
  const randIdx = Math.floor(Math.random() * merchants.length);
  const merchantName = fileName && fileName.toLowerCase().includes('hotel') ? 'Grand Alpine Resort' : merchants[randIdx];
  const category = fileName && fileName.toLowerCase().includes('hotel') ? 'ACCOMMODATION' : categories[randIdx];

  const items = category === 'FOOD' ? [
    { name: 'Pasta Carbonara', quantity: 2, price: 18.50 },
    { name: 'Caesar Salad', quantity: 1, price: 12.00 },
    { name: 'Craft Beer', quantity: 3, price: 7.50 },
    { name: 'Artisan Dessert', quantity: 1, price: 9.50 }
  ] : category === 'ACCOMMODATION' ? [
    { name: 'Deluxe Room (Night 1)', quantity: 1, price: 180.00 },
    { name: 'Deluxe Room (Night 2)', quantity: 1, price: 180.00 },
    { name: 'Resort Fee', quantity: 1, price: 35.00 }
  ] : [
    { name: 'Guided Group Tour Ticket', quantity: 4, price: 45.00 },
    { name: 'Equipment Rental', quantity: 4, price: 15.00 }
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const tip = category === 'FOOD' ? Math.round(subtotal * 0.15 * 100) / 100 : 0;
  const total = Math.round((subtotal + tax + tip) * 100) / 100;

  return {
    merchant: merchantName,
    category,
    date: new Date().toISOString().split('T')[0],
    currency: 'USD',
    items,
    subtotal,
    tax,
    tip,
    total,
    confidence: 94,
    aiParsed: true
  };
}

module.exports = {
  parseReceiptData
};
