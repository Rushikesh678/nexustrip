/**
 * Production AI Bill & Receipt Parsing Service using Groq SDK + Tesseract OCR
 * Parses receipts, invoices, and bills into structured financial expense data.
 */

const { Groq } = require('groq-sdk');
const Tesseract = require('tesseract.js');

// Initialize Groq client dynamically
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('[ReceiptService]: GROQ_API_KEY is not set in environment.');
    return null;
  }
  return new Groq({ apiKey });
}

// Supported Categories
const VALID_CATEGORIES = [
  'FOOD',
  'ACCOMMODATION',
  'TRANSPORT',
  'ACTIVITY',
  'SHOPPING',
  'UTILITIES',
  'MISC'
];

/**
 * Perform OCR on image buffer using Tesseract.js
 */
async function extractTextFromBuffer(fileBuffer, mimeType) {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    return '';
  }

  try {
    const { data: { text } } = await Tesseract.recognize(fileBuffer, 'eng', {
      logger: () => {} // Suppress verbose logs
    });
    return text ? text.trim() : '';
  } catch (err) {
    console.error('[ReceiptService OCR Error]:', err.message);
    return '';
  }
}

/**
 * Currency Normalizer
 */
function normalizeCurrency(rawCurrency, rawText = '') {
  const curr = (rawCurrency || '').toUpperCase().trim();
  if (curr.includes('INR') || curr.includes('RS') || curr.includes('₹') || rawText.includes('₹') || /₹|Rs\.|INR/i.test(rawText)) {
    return 'INR';
  }
  if (curr.includes('EUR') || curr.includes('€') || rawText.includes('€')) {
    return 'EUR';
  }
  if (curr.includes('GBP') || curr.includes('£') || rawText.includes('£')) {
    return 'GBP';
  }
  if (curr.includes('USD') || curr.includes('$') || rawText.includes('$')) {
    return 'USD';
  }
  if (curr.includes('CAD')) return 'CAD';
  if (curr.includes('AUD')) return 'AUD';
  if (curr.includes('JPY') || curr.includes('¥')) return 'JPY';
  
  return 'INR'; // Default currency fallback
}

/**
 * Financial Integrity & Sanity Checker
 */
function sanitizeAndValidateParsedData(data, rawText = '') {
  // Merchant
  let merchant = (data.merchant || '').trim();
  if (!merchant || merchant.toLowerCase() === 'null' || merchant.toLowerCase() === 'unknown') {
    merchant = 'Receipt Merchant';
  }

  // Category
  let category = (data.category || '').toUpperCase().trim();
  if (!VALID_CATEGORIES.includes(category)) {
    if (/hotel|resort|stay|inn|lodge|room|airbnb/i.test(merchant + ' ' + rawText)) {
      category = 'ACCOMMODATION';
    } else if (/taxi|cab|uber|flight|train|bus|fuel|petrol|diesel|fare/i.test(merchant + ' ' + rawText)) {
      category = 'TRANSPORT';
    } else if (/restaurant|cafe|bistro|dine|food|pizza|burger|bar|coffee|swiggy|zomato/i.test(merchant + ' ' + rawText)) {
      category = 'FOOD';
    } else if (/ticket|entry|tour|park|museum|event|cinema|movie|show/i.test(merchant + ' ' + rawText)) {
      category = 'ACTIVITY';
    } else if (/store|shop|mart|supermarket|amazon|flipkart|mall/i.test(merchant + ' ' + rawText)) {
      category = 'SHOPPING';
    } else {
      category = 'FOOD';
    }
  }

  // Date
  let date = data.date;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    date = new Date().toISOString().split('T')[0];
  }

  // Currency
  const currency = normalizeCurrency(data.currency, rawText);

  // Items
  let items = Array.isArray(data.items) ? data.items : [];
  items = items.map(item => {
    const name = (item.name || 'Item').trim();
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    const price = Math.max(0, Math.round((parseFloat(item.price) || 0) * 100) / 100);
    return { name, quantity, price };
  }).filter(item => item.price > 0 || item.name !== 'Item');

  // Math totals calculation
  const itemsSum = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let subtotal = Math.max(0, Math.round((parseFloat(data.subtotal) || 0) * 100) / 100);
  let tax = Math.max(0, Math.round((parseFloat(data.tax) || 0) * 100) / 100);
  let tip = Math.max(0, Math.round((parseFloat(data.tip) || 0) * 100) / 100);
  let total = Math.max(0, Math.round((parseFloat(data.total) || 0) * 100) / 100);

  if (subtotal === 0 && itemsSum > 0) {
    subtotal = itemsSum;
  }

  // True calculated grand total after taxes & tips
  const calculatedGrandTotal = Math.round((subtotal + tax + tip) * 100) / 100;

  // CRITICAL FIX: If total is 0, OR if total equals subtotal while tax/tip exist, OR if total is less than calculatedGrandTotal:
  if (total === 0 || (total === subtotal && (tax > 0 || tip > 0)) || (calculatedGrandTotal > 0 && total < calculatedGrandTotal)) {
    total = Math.max(total, calculatedGrandTotal);
  }

  // If total > subtotal and tax is 0 and tip is 0, derive tax = total - subtotal
  if (total > subtotal && subtotal > 0 && tax === 0 && tip === 0) {
    tax = Math.round((total - subtotal) * 100) / 100;
  }

  if (subtotal === 0 && total > 0) {
    subtotal = Math.max(0, Math.round((total - tax - tip) * 100) / 100);
  }

  // Confidence Score Calculation
  let confidence = parseInt(data.confidence, 10);
  if (isNaN(confidence) || confidence <= 0) {
    confidence = 50;
    if (merchant !== 'Receipt Merchant') confidence += 20;
    if (total > 0) confidence += 20;
    if (items.length > 0) confidence += 10;
  }
  confidence = Math.min(99, Math.max(50, confidence));

  return {
    merchant,
    category,
    date,
    currency,
    items,
    subtotal,
    tax,
    tip,
    total,
    confidence,
    aiParsed: true
  };
}

/**
 * Fallback Regex Parser when AI API is unavailable
 */
function localRegexParser(extractedText, fileName = '') {
  let merchant = 'Parsed Bill';
  const lines = extractedText.split('\n').map(l => l.trim()).filter(Boolean);
  
  if (lines.length > 0) {
    merchant = lines[0].substring(0, 40);
  } else if (fileName) {
    merchant = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  }

  // 1. Extract Grand Total (prioritize GRAND TOTAL / NET AMOUNT over SUB-TOTAL)
  let total = 0;
  const grandTotalMatch = extractedText.match(/(?:GRAND\s*TOTAL|TOTAL\s*PAYABLE|NET\s*AMOUNT|NET\s*PAYABLE|AMOUNT\s*DUE|FINAL\s*TOTAL|BILL\s*TOTAL)\s*:?\s*([\d,]+\.?\d*)/i);
  if (grandTotalMatch && grandTotalMatch[1]) {
    total = parseFloat(grandTotalMatch[1].replace(/,/g, '')) || 0;
  }

  // 2. Extract Subtotal
  let subtotal = 0;
  const subtotalMatch = extractedText.match(/(?:SUB-?\s*TOTAL|ITEMS?\s*TOTAL|SUM)\s*:?\s*([\d,]+\.?\d*)/i);
  if (subtotalMatch && subtotalMatch[1]) {
    subtotal = parseFloat(subtotalMatch[1].replace(/,/g, '')) || 0;
  }

  // 3. Extract Tax
  let tax = 0;
  const taxMatch = extractedText.match(/(?:TAX|CGST|SGST|GST|VAT|SERVICE\s*TAX)\s*:?\s*([\d,]+\.?\d*)/i);
  if (taxMatch && taxMatch[1]) {
    tax = parseFloat(taxMatch[1].replace(/,/g, '')) || 0;
  }

  // 4. Fallback search for standalone TOTAL if grand total not found
  if (total === 0) {
    const totalMatch = extractedText.match(/(?:TOTAL|PAYABLE|RS\.?|₹|\$)\s*:?\s*([\d,]+\.?\d*)/i);
    if (totalMatch && totalMatch[1]) {
      total = parseFloat(totalMatch[1].replace(/,/g, '')) || 0;
    }
  }

  if (total === 0 && subtotal > 0) {
    total = subtotal + tax;
  }

  return sanitizeAndValidateParsedData({
    merchant,
    category: 'FOOD',
    date: new Date().toISOString().split('T')[0],
    currency: normalizeCurrency('', extractedText),
    items: [],
    subtotal: subtotal || total,
    tax,
    tip: 0,
    total: Math.max(total, subtotal + tax),
    confidence: 65
  }, extractedText);
}

/**
 * Main AI Receipt Data Parsing Handler
 * @param {Buffer|null} fileBuffer - File buffer from Multer
 * @param {string} fileName - File name
 * @param {string} mimeType - File MIME type
 * @param {string} [rawTextInput] - Direct text input if available
 */
async function parseReceiptData(fileBuffer, fileName = 'receipt.jpg', mimeType = 'image/jpeg', rawTextInput = '') {
  let extractedText = rawTextInput || '';

  // Step 1: Perform OCR if image buffer is provided
  if (!extractedText && fileBuffer && Buffer.isBuffer(fileBuffer) && fileBuffer.length > 0) {
    extractedText = await extractTextFromBuffer(fileBuffer, mimeType);
  }

  // If text is still empty or minimal, build context from filename or default text
  if (!extractedText || extractedText.length < 10) {
    extractedText = `Receipt file: ${fileName || 'receipt.jpg'}. Extract details based on filename and standard receipt defaults.`;
  }

  // Step 2: Query Groq LLM
  const groq = getGroqClient();
  if (!groq) {
    console.warn('[ReceiptService]: Groq client unavailable. Falling back to local parser.');
    return localRegexParser(extractedText, fileName);
  }

  const prompt = `
You are an expert AI financial receipt, invoice, and bill parser.
Analyze the bill text below and extract structured JSON output.

STRICT JSON OUTPUT FORMAT RULES:
Return ONLY a valid JSON object without markdown code blocks, backticks, or extra commentary.
The JSON object MUST conform to this exact structure:
{
  "merchant": "Merchant / Store / Vendor Name",
  "category": "FOOD | ACCOMMODATION | TRANSPORT | ACTIVITY | SHOPPING | UTILITIES | MISC",
  "date": "YYYY-MM-DD",
  "currency": "INR | USD | EUR | GBP | CAD | AUD | JPY",
  "items": [
    { "name": "Item Description", "quantity": 1, "price": 100.00 }
  ],
  "subtotal": 0.00,
  "tax": 0.00,
  "tip": 0.00,
  "total": 0.00,
  "confidence": 95
}

CRITICAL FINANCIAL TOTAL RULE:
- "total": MUST BE THE FINAL GRAND TOTAL AMOUNT PAYABLE AFTER ALL TAXES, FEES, AND TIPS (e.g., if Subtotal is 130 and Tax is 52, total MUST be 182, NOT 130).
- DO NOT return the pre-tax Subtotal as "total" when taxes, GST, service fees, or tips are present on the bill.


RECEPT / BILL EXTRACTED TEXT:
${extractedText}
`;

  const modelsToTry = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
  let aiResponseContent = null;

  for (const model of modelsToTry) {
    try {
      const response = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You parse receipts and bills into strict JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });

      if (response && response.choices && response.choices[0]?.message?.content) {
        aiResponseContent = response.choices[0].message.content.trim();
        break; // Successfully got response
      }
    } catch (err) {
      console.warn(`[ReceiptService]: Model ${model} failed: ${err.message}. Trying fallback model...`);
    }
  }

  if (!aiResponseContent) {
    console.warn('[ReceiptService]: All Groq models failed. Using local regex parser fallback.');
    return localRegexParser(extractedText, fileName);
  }

  // Clean JSON response (strip markdown wrappers or extraneous text if present)
  let cleanJsonString = aiResponseContent;
  if (cleanJsonString.startsWith('```json')) {
    cleanJsonString = cleanJsonString.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (cleanJsonString.startsWith('```')) {
    cleanJsonString = cleanJsonString.replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  // Extract json object substring {...}
  const jsonMatch = cleanJsonString.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanJsonString = jsonMatch[0];
  }

  try {
    const rawParsed = JSON.parse(cleanJsonString);
    return sanitizeAndValidateParsedData(rawParsed, extractedText);
  } catch (parseErr) {
    console.error('[ReceiptService JSON Parse Error]:', parseErr.message, 'Raw response:', aiResponseContent);
    return localRegexParser(extractedText, fileName);
  }

}

module.exports = {
  parseReceiptData,
  sanitizeAndValidateParsedData,
  normalizeCurrency
};
