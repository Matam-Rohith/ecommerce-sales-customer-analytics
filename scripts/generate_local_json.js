import fs from 'fs';

const content = fs.readFileSync('data/orders.csv', 'utf-8');
const lines = content.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim());

const items = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const vals = line.split(',').map(v => v.trim());
  const r = {};
  headers.forEach((h, idx) => r[h] = vals[idx]);
  items.push({
    order_id: r.order_id,
    order_date: r.order_date,
    customer_id: r.customer_id,
    customer_name: r.customer_name,
    city: r.city,
    product_id: r.product_id,
    product_name: r.product_name,
    category: r.category,
    quantity: parseInt(r.quantity, 10) || 1,
    unit_cost: parseFloat(r.unit_cost) || 0,
    unit_price: parseFloat(r.unit_price) || 0,
    discount: parseFloat(r.discount) || 0,
    revenue: parseFloat(r.revenue) || 0,
    cost: parseFloat(r.cost) || 0,
    profit: parseFloat(r.profit) || 0
  });
}

fs.writeFileSync('src/services/localData.json', JSON.stringify(items), 'utf-8');
console.log(`localData.json created with ${items.length} records. Size: ${(fs.statSync('src/services/localData.json').size / 1024).toFixed(1)} KB`);
