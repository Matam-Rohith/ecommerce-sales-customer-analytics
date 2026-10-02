import fs from 'fs';
import path from 'path';

const rawOrdersPath = path.resolve('data/orders.csv');
const dataRawDir = path.resolve('data/raw');
const dataProcessedDir = path.resolve('data/processed');

if (!fs.existsSync(dataRawDir)) fs.mkdirSync(dataRawDir, { recursive: true });
if (!fs.existsSync(dataProcessedDir)) fs.mkdirSync(dataProcessedDir, { recursive: true });

// Copy raw orders.csv
fs.copyFileSync(rawOrdersPath, path.join(dataRawDir, 'orders.csv'));

const csvContent = fs.readFileSync(rawOrdersPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim());

const rows = lines.slice(1).map(line => {
  const values = line.split(',').map(v => v.trim());
  const row = {};
  headers.forEach((h, idx) => {
    row[h] = values[idx];
  });
  return row;
});

// 1. Customers: customer_id, customer_name, email, city, signup_date
const customerMap = new Map();
// 2. Products: product_id, product_name, category, cost_price, base_price
const productMap = new Map();
// 3. Orders: order_id, customer_id, order_date, status, total_amount
const orderMap = new Map();
// 4. Order Items: order_item_id, order_id, product_id, quantity, unit_price, discount, line_total, profit
const orderItems = [];
// 5. Payments: payment_id, order_id, payment_date, payment_method, payment_status, amount
const payments = [];

const paymentMethods = ['UPI', 'Credit Card', 'Net Banking', 'Debit Card', 'Cash on Delivery'];

rows.forEach((r, idx) => {
  // Customers
  if (!customerMap.has(r.customer_id)) {
    const cleanName = r.customer_name.toLowerCase().replace(/[^a-z0-9]/g, '.');
    customerMap.set(r.customer_id, {
      customer_id: r.customer_id,
      customer_name: r.customer_name,
      email: `${cleanName}@retailiq.in`,
      city: r.city,
      signup_date: r.order_date
    });
  } else {
    // Keep earliest date as signup_date
    const existing = customerMap.get(r.customer_id);
    if (r.order_date < existing.signup_date) {
      existing.signup_date = r.order_date;
    }
  }

  // Products
  if (!productMap.has(r.product_id)) {
    productMap.set(r.product_id, {
      product_id: r.product_id,
      product_name: r.product_name,
      category: r.category,
      cost_price: parseFloat(r.unit_cost),
      base_price: parseFloat(r.unit_price)
    });
  }

  // Orders
  const rev = parseFloat(r.revenue);
  if (!orderMap.has(r.order_id)) {
    orderMap.set(r.order_id, {
      order_id: r.order_id,
      customer_id: r.customer_id,
      order_date: r.order_date,
      status: 'Completed',
      total_amount: rev
    });
  } else {
    const o = orderMap.get(r.order_id);
    o.total_amount = +(o.total_amount + rev).toFixed(2);
  }

  // Order Items
  const orderItemId = `OI${String(idx + 1).padStart(4, '0')}`;
  orderItems.push({
    order_item_id: orderItemId,
    order_id: r.order_id,
    product_id: r.product_id,
    quantity: parseInt(r.quantity, 10),
    unit_price: parseFloat(r.unit_price),
    discount: parseFloat(r.discount),
    line_total: rev,
    profit: parseFloat(r.profit)
  });

  // Payments (one per order or matching order)
  const paymentMethod = paymentMethods[(idx + r.customer_id.charCodeAt(1)) % paymentMethods.length];
  payments.push({
    payment_id: `PAY${String(idx + 1).padStart(4, '0')}`,
    order_id: r.order_id,
    payment_date: r.order_date,
    payment_method: paymentMethod,
    payment_status: 'Success',
    amount: rev
  });
});

// Export CSVs
function saveCsv(filepath, data, cols) {
  const headerRow = cols.join(',');
  const rowStrings = data.map(d => cols.map(c => `"${String(d[c] ?? '').replace(/"/g, '""')}"`).join(','));
  fs.writeFileSync(filepath, [headerRow, ...rowStrings].join('\n'), 'utf-8');
}

saveCsv(path.join(dataProcessedDir, 'dim_customers.csv'), Array.from(customerMap.values()), ['customer_id', 'customer_name', 'email', 'city', 'signup_date']);
saveCsv(path.join(dataProcessedDir, 'dim_products.csv'), Array.from(productMap.values()), ['product_id', 'product_name', 'category', 'cost_price', 'base_price']);
saveCsv(path.join(dataProcessedDir, 'fact_orders.csv'), Array.from(orderMap.values()), ['order_id', 'customer_id', 'order_date', 'status', 'total_amount']);
saveCsv(path.join(dataProcessedDir, 'fact_order_items.csv'), orderItems, ['order_item_id', 'order_id', 'product_id', 'quantity', 'unit_price', 'discount', 'line_total', 'profit']);
saveCsv(path.join(dataProcessedDir, 'fact_payments.csv'), payments, ['payment_id', 'order_id', 'payment_date', 'payment_method', 'payment_status', 'amount']);

console.log('Relational tables generated successfully:');
console.log(`- Customers: ${customerMap.size}`);
console.log(`- Products: ${productMap.size}`);
console.log(`- Orders: ${orderMap.size}`);
console.log(`- Order Items: ${orderItems.length}`);
console.log(`- Payments: ${payments.length}`);
