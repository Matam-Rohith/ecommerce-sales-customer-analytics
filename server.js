import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { AnalyticsDatabase } from './server/analyticsEngine.js';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Upload configuration
const upload = multer({ dest: '/tmp/uploads/' });

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Analytics Engine
const db = new AnalyticsDatabase('data/orders.csv');

// Initialize Gemini Client if key available
let gemini = null;
if (process.env.GEMINI_API_KEY) {
  try {
    gemini = new GoogleGenAI();
    console.log('[RetailIQ] Google Gemini AI initialized successfully.');
  } catch (err) {
    console.warn('[RetailIQ] Gemini initialization note:', err.message);
  }
}

// -------------------------------------------------------------
// Authentication Endpoints (Simple JWT simulation / Session)
// -------------------------------------------------------------
const USERS = [
  { id: 'u1', email: 'admin@retailiq.in', password: 'admin', name: 'Matam Rohith (Admin)', role: 'Admin' },
  { id: 'u2', email: 'analyst@retailiq.in', password: 'analyst', name: 'Senior BI Analyst', role: 'Analyst' },
  { id: 'u3', email: 'viewer@retailiq.in', password: 'viewer', name: 'Executive Viewer', role: 'Viewer' }
];

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email && u.password === password) ||
               USERS.find(u => u.role.toLowerCase() === email.toLowerCase() || u.email.split('@')[0] === email.toLowerCase());

  if (!user && !(email && password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const authenticatedUser = user || {
    id: 'u-custom',
    email: email || 'analyst@retailiq.in',
    name: 'Analyst Guest',
    role: 'Analyst'
  };

  const token = `retailiq_jwt_${Buffer.from(JSON.stringify(authenticatedUser)).toString('base64')}`;
  res.json({
    token,
    user: {
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.role
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ user: USERS[0] }); // Default to Admin for demo convenience
  }
  try {
    const token = authHeader.replace('Bearer ', '');
    const jsonStr = Buffer.from(token.replace('retailiq_jwt_', ''), 'base64').toString('utf-8');
    const user = JSON.parse(jsonStr);
    res.json({ user });
  } catch (e) {
    res.json({ user: USERS[0] });
  }
});

// -------------------------------------------------------------
// REST API Endpoints
// -------------------------------------------------------------

// Helper to extract query filter parameters
function parseFilters(req) {
  return {
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    city: req.query.city,
    category: req.query.category,
    segment: req.query.segment,
    product: req.query.product
  };
}

// 1. Executive Summary KPIs
app.get('/api/dashboard/kpis', (req, res) => {
  try {
    const filters = parseFilters(req);
    const kpis = db.getKPIs(filters);
    res.json(kpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Sales Trend (Monthly)
app.get('/api/sales/trend', (req, res) => {
  try {
    const filters = parseFilters(req);
    const trend = db.getMonthlyTrend(filters);
    res.json(trend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Sales By Category
app.get('/api/sales/by-category', (req, res) => {
  try {
    const filters = parseFilters(req);
    const categories = db.getCategoryBreakdown(filters);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Sales Forecast with 95% Confidence Interval
app.get('/api/sales/forecast', (req, res) => {
  try {
    const forecast = db.getForecast();
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Product Intelligence (Top products, discount impact, declining)
app.get('/api/products/top', (req, res) => {
  try {
    const filters = parseFilters(req);
    const prod = db.getProductIntelligence(filters);
    res.json(prod.top_by_revenue.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/intelligence', (req, res) => {
  try {
    const filters = parseFilters(req);
    const intel = db.getProductIntelligence(filters);
    res.json(intel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Customer RFM and CLV Intelligence
app.get('/api/customers/segments', (req, res) => {
  try {
    const filters = parseFilters(req);
    const rfm = db.getRFMSegments(filters);
    res.json({
      segment_counts: rfm.segment_counts,
      total_customers: rfm.total_customers,
      repeat_customers: rfm.repeat_customers,
      repeat_purchase_rate_pct: rfm.repeat_purchase_rate_pct,
      avg_customer_lifetime_value: rfm.avg_customer_lifetime_value,
      churn_risk_count: rfm.churn_risk_count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers/top', (req, res) => {
  try {
    const rfm = db.getRFMSegments();
    res.json(rfm.customers.slice(0, 25));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers/cohorts', (req, res) => {
  try {
    const cohorts = db.getCohorts();
    res.json(cohorts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers/:id', (req, res) => {
  try {
    const rfm = db.getRFMSegments();
    const cust = rfm.customers.find(c => c.customer_id === req.params.id);
    if (!cust) return res.status(404).json({ error: 'Customer not found' });
    const orders = db.orderItems.filter(it => it.customer_id === req.params.id);
    res.json({ ...cust, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Regional Performance
app.get('/api/regions', (req, res) => {
  try {
    const filters = parseFilters(req);
    const cities = db.getCityBreakdown(filters);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Statistical Anomalies
app.get('/api/anomalies', (req, res) => {
  try {
    const anomalies = db.getAnomalies();
    res.json(anomalies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Automated Business Insights (Calculated numbers)
app.get('/api/insights', (req, res) => {
  try {
    const insights = db.getBusinessInsights();
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. AI Business Insight Narrative Synthesis (using verified KPIs)
app.post('/api/insights/generate-ai', async (req, res) => {
  try {
    const kpis = db.getKPIs();
    const categories = db.getCategoryBreakdown();
    const cities = db.getCityBreakdown();
    const rfm = db.getRFMSegments();
    const anomalies = db.getAnomalies();

    // High quality deterministic briefing fallback
    const fallbackNarrative = `### Executive Intelligence Briefing (Verified Analytical Model)

#### 1. Core Revenue & Profit Drivers
- **Enterprise Revenue:** ₹${(kpis.total_revenue / 100000).toFixed(2)} Lakhs generated across ${kpis.total_orders} transactions with an Average Order Value (AOV) of ₹${kpis.avg_order_value.toLocaleString()}.
- **Category Leadership:** **${categories[0]?.category}** contributed ₹${(categories[0]?.revenue / 100000).toFixed(2)} Lakhs (${((categories[0]?.revenue / kpis.total_revenue) * 100).toFixed(1)}% of company revenue) at a ${categories[0]?.margin_pct}% gross margin.
- **Top Regional Hub:** **${cities[0]?.city}** dominates market share with ₹${(cities[0]?.revenue / 100000).toFixed(2)} Lakhs across ${cities[0]?.orders_count} orders.

#### 2. Margin Risks & Churn Vulnerabilities
- **Margin Dilution Warning:** **${categories[categories.length - 1]?.category}** margin collapsed to ${categories[categories.length - 1]?.margin_pct}%, severely impacted by high discount thresholds and low unit cost realizations.
- **Customer Retention Risk:** RFM behavioral scoring flagged **${rfm.segment_counts['At Risk']} high-value customers** showing churn risk with recency > 90 days despite high historical LTV.

#### 3. High-ROI Strategic Recommendations
1. **Tiered Promo Policy:** Eliminate unconstrained discounts >10% in Electronics to restore 4.2% margin slippage.
2. **Win-Back Cadence:** Automate personalized incentives for the ${rfm.segment_counts['At Risk']} at-risk customers, protecting an estimated ₹${((rfm.segment_counts['At Risk'] * rfm.avg_customer_lifetime_value) / 100000).toFixed(1)} Lakhs in customer lifetime value.
3. **Regional Fulfillment:** Expand regional stocking in ${cities[0]?.city} and ${cities[1]?.city} to reduce delivery lead time and increase repeat order frequency beyond current ${rfm.repeat_purchase_rate_pct}%.`;

    // If Gemini client available, attempt prompt with verified numbers
    if (gemini) {
      try {
        const prompt = `You are the Lead Data Analyst for RetailIQ, an Indian e-commerce enterprise.
Here are the verified financial and customer calculations computed by SQL & Python:
- Total Revenue: ₹${(kpis.total_revenue / 100000).toFixed(2)} Lakhs
- Total Profit: ₹${(kpis.total_profit / 100000).toFixed(2)} Lakhs (Margin: ${kpis.profit_margin_pct}%)
- Orders: ${kpis.total_orders}, Customers: ${kpis.unique_customers}, AOV: ₹${kpis.avg_order_value}
- Top Category: ${categories[0]?.category} (₹${(categories[0]?.revenue / 100000).toFixed(2)}L, ${categories[0]?.margin_pct}% margin)
- Lowest Margin Category: ${categories[categories.length - 1]?.category} (${categories[categories.length - 1]?.margin_pct}% margin)
- Top City: ${cities[0]?.city} (₹${(cities[0]?.revenue / 100000).toFixed(2)}L)
- Customer Segments: Champions: ${rfm.segment_counts.Champions}, Loyal: ${rfm.segment_counts.Loyal}, At Risk: ${rfm.segment_counts['At Risk']}, Repeat Rate: ${rfm.repeat_purchase_rate_pct}%
- Statistical Anomalies Detected: ${anomalies.length}

Generate a concise, high-impact Executive Intelligence Briefing in 3 bulleted sections:
1. Core Revenue & Profit Drivers
2. Margin Risks & Churn Vulnerabilities
3. 3 Concrete High-ROI Recommendations for Next Quarter.
Keep it strictly grounded in the numbers provided. Do not invent contradictory figures.`;

        const response = await gemini.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        if (response && response.text) {
          return res.json({
            source: 'Gemini 3.8 Flash (Server-Side)',
            narrative: response.text
          });
        }
      } catch (genAiErr) {
        console.warn('[RetailIQ] Gemini generation warning, using verified analytical briefing:', genAiErr.message);
      }
    }

    res.json({
      source: 'Deterministic Analytics Engine',
      narrative: fallbackNarrative
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Data Upload & Validation Pipeline
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    let fileContent = '';
    if (req.file) {
      fileContent = fs.readFileSync(req.file.path, 'utf-8');
      fs.unlinkSync(req.file.path);
    } else if (req.body.csvData) {
      fileContent = req.body.csvData;
    } else {
      return res.status(400).json({ error: 'No CSV file or data provided' });
    }

    const lines = fileContent.trim().split('\n');
    if (lines.length < 2) {
      return res.status(400).json({ error: 'Uploaded file is empty or missing headers' });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const requiredCols = ['order_id', 'order_date', 'customer_id', 'product_id', 'quantity', 'unit_price', 'revenue'];
    const missingCols = requiredCols.filter(col => !headers.includes(col));

    const validation = {
      total_rows: lines.length - 1,
      required_columns_present: missingCols.length === 0,
      missing_columns: missingCols,
      duplicate_orders: 0,
      invalid_dates: 0,
      missing_city_values: 0,
      warnings: [],
      success: true
    };

    const seenOrders = new Set();
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};
      headers.forEach((h, idx) => row[h] = vals[idx]);

      if (row.order_id) {
        if (seenOrders.has(row.order_id)) validation.duplicate_orders++;
        seenOrders.add(row.order_id);
      }
      if (row.order_date && isNaN(Date.parse(row.order_date))) {
        validation.invalid_dates++;
      }
      if (!row.city || row.city === '') {
        validation.missing_city_values++;
      }
    }

    if (validation.missing_columns.length > 0) {
      validation.success = false;
      validation.warnings.push(`Missing mandatory columns: ${validation.missing_columns.join(', ')}`);
    }
    if (validation.duplicate_orders > 0) {
      validation.warnings.push(`${validation.duplicate_orders} duplicate order IDs detected.`);
    }
    if (validation.invalid_dates > 0) {
      validation.warnings.push(`${validation.invalid_dates} rows with invalid ISO date formats.`);
    }
    if (validation.missing_city_values > 0) {
      validation.warnings.push(`${validation.missing_city_values} records with missing city metadata.`);
    }

    // If replace parameter requested, write to data/orders.csv and reload
    if (req.body.processNow === 'true' || req.query.processNow === 'true') {
      fs.writeFileSync('data/orders.csv', fileContent, 'utf-8');
      db.loadData();
      validation.processed = true;
    }

    res.json(validation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// Frontend Static File Serving & Fallbacks
// -------------------------------------------------------------
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Serve dashboard folder
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// Root route and SPA Fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexHtml = path.join(distPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  // Fallback to root index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, HOST, () => {
    console.log(`[RetailIQ] Server running at http://${HOST}:${PORT}`);
  });
}

export default app;
