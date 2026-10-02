import fs from 'fs';
import path from 'path';

function readCsv(file) {
  const content = fs.readFileSync(path.join('data/processed', file), 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  return lines.slice(1).map(line => {
    // simple regex for csv with quotes
    const values = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i+1] === '"') { cur += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (c === ',' && !inQuotes) {
        values.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    values.push(cur);
    const obj = {};
    headers.forEach((h, idx) => obj[h] = values[idx]);
    return obj;
  });
}

const customers = readCsv('dim_customers.csv');
const products = readCsv('dim_products.csv');
const orders = readCsv('fact_orders.csv');
const orderItems = readCsv('fact_order_items.csv');
const payments = readCsv('fact_payments.csv');

let sql = `-- =====================================================================
-- RETAILIQ ANALYTICS PLATFORM - SEED DATA
-- =====================================================================

BEGIN;

-- 1. Insert Customers
INSERT INTO customers (customer_id, customer_name, email, city, state, signup_date) VALUES
`;

sql += customers.map(c => 
  `  ('${c.customer_id}', '${c.customer_name.replace(/'/g, "''")}', '${c.email}', '${c.city}', '${c.state}', '${c.signup_date}')`
).join(',\n') + ';\n\n';

sql += '-- 2. Insert Products\nINSERT INTO products (product_id, product_name, category, cost_price, base_price) VALUES\n';
sql += products.map(p => 
  `  ('${p.product_id}', '${p.product_name}', '${p.category}', ${p.cost_price}, ${p.base_price})`
).join(',\n') + ';\n\n';

sql += '-- 3. Insert Orders (Sample batch of initial orders)\nINSERT INTO orders (order_id, customer_id, order_date, status, total_amount) VALUES\n';
sql += orders.slice(0, 100).map(o => 
  `  ('${o.order_id}', '${o.customer_id}', '${o.order_date}', '${o.status}', ${o.total_amount})`
).join(',\n') + ';\n\n';

sql += '-- 4. Insert Order Items (Sample batch)\nINSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price, discount, line_total, profit) VALUES\n';
sql += orderItems.slice(0, 100).map(oi => 
  `  ('${oi.order_item_id}', '${oi.order_id}', '${oi.product_id}', ${oi.quantity}, ${oi.unit_price}, ${oi.discount}, ${oi.line_total}, ${oi.profit})`
).join(',\n') + ';\n\n';

sql += '-- 5. Insert Payments (Sample batch)\nINSERT INTO payments (payment_id, order_id, payment_date, payment_method, payment_status, amount) VALUES\n';
sql += payments.slice(0, 100).map(p => 
  `  ('${p.payment_id}', '${p.order_id}', '${p.payment_date}', '${p.payment_method}', '${p.payment_status}', ${p.amount})`
).join(',\n') + ';\n\nCOMMIT;\n';

fs.writeFileSync('sql/seed.sql', sql, 'utf-8');
console.log('sql/seed.sql generated successfully.');
