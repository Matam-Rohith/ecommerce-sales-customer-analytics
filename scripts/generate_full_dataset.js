import fs from 'fs';
import path from 'path';

// Products definition (20 items across 5 categories)
const products = [
  { product_id: 'P001', product_name: 'Laptop', category: 'Electronics', unit_cost: 25000, unit_price: 45000, weight: 0.16 },
  { product_id: 'P002', product_name: 'Smartphone', category: 'Electronics', unit_cost: 12000, unit_price: 22000, weight: 0.17 },
  { product_id: 'P003', product_name: 'Headphones', category: 'Electronics', unit_cost: 1500, unit_price: 3500, weight: 0.12 },
  { product_id: 'P004', product_name: 'Smartwatch', category: 'Electronics', unit_cost: 3000, unit_price: 6000, weight: 0.10 },
  { product_id: 'P005', product_name: 'Monitor', category: 'Electronics', unit_cost: 7000, unit_price: 14000, weight: 0.12 },
  { product_id: 'P006', product_name: 'T-Shirt', category: 'Fashion', unit_cost: 200, unit_price: 600, weight: 0.14 },
  { product_id: 'P007', product_name: 'Jeans', category: 'Fashion', unit_cost: 600, unit_price: 1800, weight: 0.12 },
  { product_id: 'P008', product_name: 'Sneakers', category: 'Fashion', unit_cost: 1000, unit_price: 2800, weight: 0.14 },
  { product_id: 'P009', product_name: 'Jacket', category: 'Fashion', unit_cost: 1200, unit_price: 3500, weight: 0.12 },
  { product_id: 'P010', product_name: 'Saree', category: 'Fashion', unit_cost: 900, unit_price: 2800, weight: 0.12 },
  { product_id: 'P011', product_name: 'Sofa', category: 'Furniture', unit_cost: 8000, unit_price: 18000, weight: 0.18 },
  { product_id: 'P012', product_name: 'Dining Table', category: 'Furniture', unit_cost: 5000, unit_price: 12000, weight: 0.16 },
  { product_id: 'P013', product_name: 'Office Chair', category: 'Furniture', unit_cost: 2500, unit_price: 5500, weight: 0.15 },
  { product_id: 'P014', product_name: 'Bed Frame', category: 'Furniture', unit_cost: 6000, unit_price: 15000, weight: 0.16 },
  { product_id: 'P015', product_name: 'Rice 5kg', category: 'Grocery', unit_cost: 200, unit_price: 350, weight: 0.20 },
  { product_id: 'P016', product_name: 'Cooking Oil', category: 'Grocery', unit_cost: 150, unit_price: 250, weight: 0.20 },
  { product_id: 'P017', product_name: 'Coffee Beans', category: 'Grocery', unit_cost: 300, unit_price: 550, weight: 0.18 },
  { product_id: 'P018', product_name: 'Python Book', category: 'Books', unit_cost: 250, unit_price: 600, weight: 0.20 },
  { product_id: 'P019', product_name: 'Fiction Novel', category: 'Books', unit_cost: 120, unit_price: 300, weight: 0.20 },
  { product_id: 'P020', product_name: 'Business Strategy', category: 'Books', unit_cost: 350, unit_price: 800, weight: 0.18 }
];

// Indian Cities with population/weight
const cities = [
  { city: 'Hyderabad', state: 'Telangana', weight: 0.16 },
  { city: 'Bangalore', state: 'Karnataka', weight: 0.15 },
  { city: 'Mumbai', state: 'Maharashtra', weight: 0.14 },
  { city: 'Delhi', state: 'Delhi NCR', weight: 0.13 },
  { city: 'Chennai', state: 'Tamil Nadu', weight: 0.11 },
  { city: 'Pune', state: 'Maharashtra', weight: 0.10 },
  { city: 'Kolkata', state: 'West Bengal', weight: 0.08 },
  { city: 'Ahmedabad', state: 'Gujarat', weight: 0.07 },
  { city: 'Jaipur', state: 'Rajasthan', weight: 0.03 },
  { city: 'Lucknow', state: 'Uttar Pradesh', weight: 0.03 }
];

// Indian customer names (120 unique customers)
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Rithvik', 'Ananya', 'Diya', 'Gauri', 'Isha', 'Kavya', 'Khushi', 'Navya', 'Pooja', 'Priya', 'Riya', 'Saanvi', 'Tanvi', 'Anushka', 'Meera', 'Roshni', 'Sneha', 'Deepika', 'Neha', 'Lakshmi', 'Swati', 'Manish', 'Rahul', 'Rohit', 'Suresh', 'Amit', 'Vikram', 'Rajesh', 'Sanjay', 'Sunil', 'Karan', 'Deepak'];
const lastNames = ['Patel', 'Sharma', 'Singh', 'Gupta', 'Kumar', 'Reddy', 'Rao', 'Iyer', 'Joshi', 'Nair', 'Verma', 'Chopra', 'Mehta', 'Bhat', 'Deshmukh', 'Mishra', 'Pandey', 'Yadav', 'Saxena', 'Mukherjee'];

const customers = [];
for (let i = 1; i <= 120; i++) {
  const custId = `C${String(i).padStart(3, '0')}`;
  const f = firstNames[(i * 7) % firstNames.length];
  const l = lastNames[(i * 11) % lastNames.length];
  const cityObj = cities[(i * 3) % cities.length];
  customers.push({
    customer_id: custId,
    customer_name: `${f} ${l}`,
    email: `${f.toLowerCase()}.${l.toLowerCase()}${i}@retailiq.in`,
    city: cityObj.city,
    state: cityObj.state,
    signup_date: '' // set on first order
  });
}

// Monthly revenue targets matching dashboard/index.html closely
const monthlyTargets = [
  { month: '2024-01', rev: 2368445, profit: 1171258, count: 142 },
  { month: '2024-02', rev: 2197956, profit: 1089764, count: 132 },
  { month: '2024-03', rev: 2544632, profit: 1264001, count: 153 },
  { month: '2024-04', rev: 2465832, profit: 1224413, count: 148 },
  { month: '2024-05', rev: 2494742, profit: 1245208, count: 150 },
  { month: '2024-06', rev: 2443148, profit: 1210872, count: 147 },
  { month: '2024-07', rev: 2607231, profit: 1300143, count: 157 },
  { month: '2024-08', rev: 2592363, profit: 1283926, count: 156 },
  { month: '2024-09', rev: 2362956, profit: 1167808, count: 142 },
  { month: '2024-10', rev: 2477812, profit: 1228519, count: 149 },
  { month: '2024-11', rev: 2644784, profit: 1318459, count: 159 },
  { month: '2024-12', rev: 2666041, profit: 1354161, count: 165 }
];

const paymentMethods = ['UPI', 'Credit Card', 'Net Banking', 'Debit Card', 'Cash on Delivery'];

const orderRows = [];
let orderCounter = 1;

// Pseudo-random deterministic generator
let seed = 42;
function random() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

// Generate 1800 orders across 12 months
monthlyTargets.forEach(mTarget => {
  const [yearStr, monthStr] = mTarget.month.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let i = 0; i < mTarget.count; i++) {
    const orderId = `O${String(orderCounter).padStart(4, '0')}`;
    const day = 1 + Math.floor((i / mTarget.count) * daysInMonth);
    const dateStr = `${mTarget.month}-${String(Math.min(day, daysInMonth)).padStart(2, '0')}`;

    // Select customer (with Pareto distribution to create Champions, Loyal, At-Risk)
    let custIndex;
    const rCust = random();
    if (rCust < 0.35) {
      // Top 20 customers (champions & loyal)
      custIndex = Math.floor(random() * 25);
    } else if (rCust < 0.80) {
      // Next 60 customers
      custIndex = 25 + Math.floor(random() * 65);
    } else {
      // Remaining customers (some at-risk / lost)
      custIndex = 90 + Math.floor(random() * 30);
    }
    const customer = customers[custIndex];
    if (!customer.signup_date || dateStr < customer.signup_date) {
      customer.signup_date = dateStr;
    }

    // Select product
    let prod;
    const rProd = random();
    if (rProd < 0.38) {
      // Electronics
      const elec = products.filter(p => p.category === 'Electronics');
      prod = elec[Math.floor(random() * elec.length)];
    } else if (rProd < 0.65) {
      // Furniture
      const furn = products.filter(p => p.category === 'Furniture');
      prod = furn[Math.floor(random() * furn.length)];
    } else if (rProd < 0.84) {
      // Fashion
      const fash = products.filter(p => p.category === 'Fashion');
      prod = fash[Math.floor(random() * fash.length)];
    } else if (rProd < 0.93) {
      // Books
      const books = products.filter(p => p.category === 'Books');
      prod = books[Math.floor(random() * books.length)];
    } else {
      // Grocery
      const groc = products.filter(p => p.category === 'Grocery');
      prod = groc[Math.floor(random() * groc.length)];
    }

    // Quantity (1-3 for expensive, 1-6 for cheap)
    let qty = 1;
    if (prod.unit_price < 1000) {
      qty = 1 + Math.floor(random() * 4);
    } else if (prod.unit_price < 10000) {
      qty = 1 + Math.floor(random() * 2);
    }

    // Discount: 0%, 5%, 10%, 15%
    const rDisc = random();
    let discount = 0;
    if (rDisc > 0.85) discount = 0.15;
    else if (rDisc > 0.65) discount = 0.10;
    else if (rDisc > 0.40) discount = 0.05;

    const baseRevenue = prod.unit_price * qty;
    const revenue = Math.round(baseRevenue * (1 - discount));
    const cost = prod.unit_cost * qty;
    const profit = Math.round(revenue - cost);

    orderRows.push({
      order_id: orderId,
      order_date: dateStr,
      customer_id: customer.customer_id,
      customer_name: customer.customer_name,
      city: customer.city,
      product_id: prod.product_id,
      product_name: prod.product_name,
      category: prod.category,
      quantity: qty,
      unit_cost: prod.unit_cost,
      unit_price: prod.unit_price,
      discount: discount,
      revenue: revenue,
      cost: cost,
      profit: profit
    });

    orderCounter++;
    if (orderCounter > 1800) break;
  }
});

// Trim or pad to exactly 1800
while (orderRows.length < 1800) {
  const last = orderRows[orderRows.length - 1];
  const orderId = `O${String(orderRows.length + 1).padStart(4, '0')}`;
  orderRows.push({ ...last, order_id: orderId });
}
if (orderRows.length > 1800) {
  orderRows.length = 1800;
}

// Write out orders.csv to data/orders.csv and data/raw/orders.csv
const orderCols = ['order_id','order_date','customer_id','customer_name','city','product_id','product_name','category','quantity','unit_cost','unit_price','discount','revenue','cost','profit'];
const ordersCsvContent = [orderCols.join(','), ...orderRows.map(r => orderCols.map(c => r[c]).join(','))].join('\n');

fs.writeFileSync('data/orders.csv', ordersCsvContent, 'utf-8');
fs.writeFileSync('data/raw/orders.csv', ordersCsvContent, 'utf-8');

// Generate normalized tables
const dataProcessedDir = 'data/processed';
if (!fs.existsSync(dataProcessedDir)) fs.mkdirSync(dataProcessedDir, { recursive: true });

// 1. dim_customers
const customerMap = new Map();
customers.forEach(c => customerMap.set(c.customer_id, c));
orderRows.forEach(r => {
  const c = customerMap.get(r.customer_id);
  if (!c.signup_date || r.order_date < c.signup_date) {
    c.signup_date = r.order_date;
  }
});
const dimCustomers = Array.from(customerMap.values()).map(c => ({
  customer_id: c.customer_id,
  customer_name: c.customer_name,
  email: c.email,
  city: c.city,
  state: c.state,
  signup_date: c.signup_date || '2024-01-01'
}));

// 2. dim_products
const dimProducts = products.map(p => ({
  product_id: p.product_id,
  product_name: p.product_name,
  category: p.category,
  cost_price: p.unit_cost,
  base_price: p.unit_price
}));

// 3. fact_orders
const orderMap = new Map();
orderRows.forEach(r => {
  if (!orderMap.has(r.order_id)) {
    orderMap.set(r.order_id, {
      order_id: r.order_id,
      customer_id: r.customer_id,
      order_date: r.order_date,
      status: 'Completed',
      total_amount: r.revenue
    });
  } else {
    const o = orderMap.get(r.order_id);
    o.total_amount += r.revenue;
  }
});
const factOrders = Array.from(orderMap.values());

// 4. fact_order_items
const factOrderItems = orderRows.map((r, idx) => ({
  order_item_id: `OI${String(idx + 1).padStart(4, '0')}`,
  order_id: r.order_id,
  product_id: r.product_id,
  quantity: r.quantity,
  unit_price: r.unit_price,
  discount: r.discount,
  line_total: r.revenue,
  profit: r.profit
}));

// 5. fact_payments
const factPayments = orderRows.map((r, idx) => {
  const method = paymentMethods[(idx + r.customer_id.charCodeAt(1)) % paymentMethods.length];
  return {
    payment_id: `PAY${String(idx + 1).padStart(4, '0')}`,
    order_id: r.order_id,
    payment_date: r.order_date,
    payment_method: method,
    payment_status: 'Success',
    amount: r.revenue
  };
});

function writeCsv(filepath, data, cols) {
  const header = cols.join(',');
  const lines = data.map(d => cols.map(c => `"${String(d[c] ?? '').replace(/"/g, '""')}"`).join(','));
  fs.writeFileSync(filepath, [header, ...lines].join('\n'), 'utf-8');
}

writeCsv(path.join(dataProcessedDir, 'dim_customers.csv'), dimCustomers, ['customer_id', 'customer_name', 'email', 'city', 'state', 'signup_date']);
writeCsv(path.join(dataProcessedDir, 'dim_products.csv'), dimProducts, ['product_id', 'product_name', 'category', 'cost_price', 'base_price']);
writeCsv(path.join(dataProcessedDir, 'fact_orders.csv'), factOrders, ['order_id', 'customer_id', 'order_date', 'status', 'total_amount']);
writeCsv(path.join(dataProcessedDir, 'fact_order_items.csv'), factOrderItems, ['order_item_id', 'order_id', 'product_id', 'quantity', 'unit_price', 'discount', 'line_total', 'profit']);
writeCsv(path.join(dataProcessedDir, 'fact_payments.csv'), factPayments, ['payment_id', 'order_id', 'payment_date', 'payment_method', 'payment_status', 'amount']);

console.log('Successfully generated full 1800 orders dataset and normalized tables:');
console.log(`- Orders: ${orderRows.length}`);
console.log(`- Unique Customers: ${dimCustomers.length}`);
console.log(`- Unique Products: ${dimProducts.length}`);
console.log(`- Total Revenue: ₹${(orderRows.reduce((s, r) => s + r.revenue, 0) / 100000).toFixed(2)}L`);
console.log(`- Total Profit: ₹${(orderRows.reduce((s, r) => s + r.profit, 0) / 100000).toFixed(2)}L`);
