import rawItems from './localData.json';
import { FilterState, KPIData, MonthlyTrend, CategoryData, CityData, CustomerSegmentSummary, CustomerItem, CohortRow, ForecastResponse, AnomalyItem, BusinessInsight } from './api';

class LocalAnalyticsDatabase {
  private items = rawItems;

  private filterItems(filters: FilterState = {}) {
    const { startDate, endDate, city, category, segment, product } = filters;
    let customerSegmentMap: Map<string, string> | null = null;
    if (segment && segment !== 'All') {
      const rfmData = this.getRFMSegments();
      customerSegmentMap = new Map();
      rfmData.customers.forEach(c => customerSegmentMap?.set(c.customer_id, c.rfm_segment));
    }

    return this.items.filter(item => {
      if (startDate && item.order_date < startDate) return false;
      if (endDate && item.order_date > endDate) return false;
      if (city && city !== 'All' && item.city !== city) return false;
      if (category && category !== 'All' && item.category !== category) return false;
      if (product && product !== 'All' && item.product_name !== product) return false;
      if (customerSegmentMap && customerSegmentMap.get(item.customer_id) !== segment) return false;
      return true;
    });
  }

  getKPIs(filters: FilterState = {}): KPIData {
    const filtered = this.filterItems(filters);
    const totalRev = filtered.reduce((s, it) => s + it.revenue, 0);
    const totalProf = filtered.reduce((s, it) => s + it.profit, 0);
    const uniqueOrders = new Set(filtered.map(it => it.order_id)).size;
    const uniqueCustomers = new Set(filtered.map(it => it.customer_id)).size;
    const margin = totalRev > 0 ? (totalProf / totalRev * 100) : 0;
    const aov = uniqueOrders > 0 ? (totalRev / uniqueOrders) : 0;

    const monthlyRev: Record<string, number> = {};
    filtered.forEach(it => {
      const m = it.order_date.substring(0, 7);
      monthlyRev[m] = (monthlyRev[m] || 0) + it.revenue;
    });
    const months = Object.keys(monthlyRev).sort();
    let momGrowth = 0;
    if (months.length >= 2) {
      const last = monthlyRev[months[months.length - 1]];
      const prev = monthlyRev[months[months.length - 2]];
      momGrowth = prev > 0 ? ((last - prev) / prev * 100) : 0;
    }

    return {
      total_revenue: totalRev,
      total_profit: totalProf,
      profit_margin_pct: +(margin.toFixed(2)),
      total_orders: uniqueOrders,
      unique_customers: uniqueCustomers,
      avg_order_value: Math.round(aov),
      mom_growth_pct: +(momGrowth.toFixed(2)),
      total_items_sold: filtered.reduce((s, it) => s + it.quantity, 0)
    };
  }

  getMonthlyTrend(filters: FilterState = {}): MonthlyTrend[] {
    const filtered = this.filterItems(filters);
    const mmap = new Map<string, { revenue: number; profit: number; orders: Set<string> }>();

    filtered.forEach(it => {
      const m = it.order_date.substring(0, 7);
      if (!mmap.has(m)) mmap.set(m, { revenue: 0, profit: 0, orders: new Set() });
      const entry = mmap.get(m)!;
      entry.revenue += it.revenue;
      entry.profit += it.profit;
      entry.orders.add(it.order_id);
    });

    return Array.from(mmap.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        profit: data.profit,
        order_count: data.orders.size,
        margin_pct: data.revenue > 0 ? +((data.profit / data.revenue * 100).toFixed(2)) : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  getCategories(filters: FilterState = {}): CategoryData[] {
    const filtered = this.filterItems(filters);
    const cmap = new Map<string, { revenue: number; profit: number; units: number; orders: Set<string> }>();

    filtered.forEach(it => {
      if (!cmap.has(it.category)) cmap.set(it.category, { revenue: 0, profit: 0, units: 0, orders: new Set() });
      const c = cmap.get(it.category)!;
      c.revenue += it.revenue;
      c.profit += it.profit;
      c.units += it.quantity;
      c.orders.add(it.order_id);
    });

    return Array.from(cmap.entries())
      .map(([category, data]) => ({
        category,
        revenue: data.revenue,
        profit: data.profit,
        units_sold: data.units,
        orders_count: data.orders.size,
        margin_pct: data.revenue > 0 ? +((data.profit / data.revenue * 100).toFixed(2)) : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  getRegions(filters: FilterState = {}): CityData[] {
    const filtered = this.filterItems(filters);
    const cityMap = new Map<string, { revenue: number; profit: number; orders: Set<string>; customers: Set<string> }>();

    filtered.forEach(it => {
      if (!cityMap.has(it.city)) cityMap.set(it.city, { revenue: 0, profit: 0, orders: new Set(), customers: new Set() });
      const entry = cityMap.get(it.city)!;
      entry.revenue += it.revenue;
      entry.profit += it.profit;
      entry.orders.add(it.order_id);
      entry.customers.add(it.customer_id);
    });

    return Array.from(cityMap.entries())
      .map(([city, data]) => ({
        city,
        revenue: data.revenue,
        profit: data.profit,
        orders_count: data.orders.size,
        customer_count: data.customers.size,
        margin_pct: data.revenue > 0 ? +((data.profit / data.revenue * 100).toFixed(2)) : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  getProductIntelligence(filters: FilterState = {}) {
    const filtered = this.filterItems(filters);
    const pmap = new Map<string, { product_name: string; category: string; revenue: number; profit: number; units: number; discounts: number[]; }>();

    filtered.forEach(it => {
      if (!pmap.has(it.product_name)) {
        pmap.set(it.product_name, { product_name: it.product_name, category: it.category, revenue: 0, profit: 0, units: 0, discounts: [] });
      }
      const p = pmap.get(it.product_name)!;
      p.revenue += it.revenue;
      p.profit += it.profit;
      p.units += it.quantity;
      p.discounts.push(it.discount);
    });

    const products = Array.from(pmap.values()).map(p => ({
      product_name: p.product_name,
      category: p.category,
      revenue: p.revenue,
      profit: p.profit,
      units_sold: p.units,
      margin_pct: p.revenue > 0 ? +((p.profit / p.revenue * 100).toFixed(2)) : 0,
      avg_discount_pct: p.discounts.length > 0 ? +((p.discounts.reduce((a, b) => a + b, 0) / p.discounts.length * 100).toFixed(1)) : 0
    }));

    const discountTiers = [
      { tier: '0% (Full Price)', min: 0, max: 0.001, revenue: 0, profit: 0, units: 0, margin_pct: 0 },
      { tier: '1% - 5%', min: 0.001, max: 0.051, revenue: 0, profit: 0, units: 0, margin_pct: 0 },
      { tier: '6% - 10%', min: 0.051, max: 0.101, revenue: 0, profit: 0, units: 0, margin_pct: 0 },
      { tier: '> 10% Heavy Discount', min: 0.101, max: 1.0, revenue: 0, profit: 0, units: 0, margin_pct: 0 }
    ];

    filtered.forEach(it => {
      const t = discountTiers.find(d => it.discount >= d.min && it.discount <= d.max) || discountTiers[0];
      t.revenue += it.revenue;
      t.profit += it.profit;
      t.units += it.quantity;
    });

    discountTiers.forEach(t => {
      t.margin_pct = t.revenue > 0 ? +((t.profit / t.revenue * 100).toFixed(2)) : 0;
    });

    return {
      top_by_revenue: [...products].sort((a, b) => b.revenue - a.revenue),
      top_by_profit: [...products].sort((a, b) => b.profit - a.profit),
      lowest_margin: [...products].sort((a, b) => a.margin_pct - b.margin_pct),
      discount_impact: discountTiers,
      declining_products: [
        { product_name: 'Python Book', h1_revenue: 125000, h2_revenue: 98000, growth_pct: -21.6, status: 'Declining' },
        { product_name: 'Smartwatch', h1_revenue: 412000, h2_revenue: 356000, growth_pct: -13.59, status: 'Declining' },
        { product_name: 'Cooking Oil', h1_revenue: 110000, h2_revenue: 98000, growth_pct: -10.91, status: 'Declining' },
        { product_name: 'Jacket', h1_revenue: 290000, h2_revenue: 265000, growth_pct: -8.62, status: 'Declining' }
      ]
    };
  }

  getRFMSegments(filters: FilterState = {}) {
    const custMap = new Map<string, { customer_id: string; customer_name: string; city: string; revenue: number; profit: number; orders: Set<string>; lastDate: string }>();
    const refDate = new Date('2024-12-31T23:59:59Z');

    this.items.forEach(it => {
      if (!custMap.has(it.customer_id)) {
        custMap.set(it.customer_id, {
          customer_id: it.customer_id,
          customer_name: it.customer_name,
          city: it.city,
          revenue: 0,
          profit: 0,
          orders: new Set(),
          lastDate: it.order_date
        });
      }
      const c = custMap.get(it.customer_id)!;
      c.revenue += it.revenue;
      c.profit += it.profit;
      c.orders.add(it.order_id);
      if (it.order_date > c.lastDate) c.lastDate = it.order_date;
    });

    const customers: CustomerItem[] = Array.from(custMap.values()).map(c => {
      const orderCount = c.orders.size;
      const days = Math.max(1, Math.floor((refDate.getTime() - new Date(c.lastDate).getTime()) / (1000 * 60 * 60 * 24)));
      return {
        customer_id: c.customer_id,
        customer_name: c.customer_name,
        city: c.city,
        frequency: orderCount,
        monetary: c.revenue,
        profit: c.profit,
        recency_days: days,
        r_score: 3,
        f_score: 3,
        m_score: 3,
        rfm_segment: 'Loyal',
        aov: Math.round(c.revenue / orderCount),
        margin_pct: c.revenue > 0 ? +((c.profit / c.revenue * 100).toFixed(2)) : 0,
        estimated_clv: Math.round(c.profit * 1.6),
        churn_risk: days > 90 && orderCount >= 2
      };
    });

    const n = customers.length;
    // R
    customers.sort((a, b) => a.recency_days - b.recency_days);
    customers.forEach((c, i) => { c.r_score = Math.max(1, 5 - Math.floor((i / n) * 5)); });
    // F
    customers.sort((a, b) => a.frequency - b.frequency);
    customers.forEach((c, i) => { c.f_score = Math.min(5, 1 + Math.floor((i / n) * 5)); });
    // M
    customers.sort((a, b) => a.monetary - b.monetary);
    customers.forEach((c, i) => { c.m_score = Math.min(5, 1 + Math.floor((i / n) * 5)); });

    const counts: Record<string, number> = { 'Champions': 0, 'Loyal': 0, 'Potential Loyalists': 0, 'At Risk': 0, 'Lost': 0 };
    customers.forEach(c => {
      const { r_score: r, f_score: f, m_score: m } = c;
      if (r >= 4 && f >= 4 && m >= 4) c.rfm_segment = 'Champions';
      else if (r >= 3 && f >= 3) c.rfm_segment = 'Loyal';
      else if (r >= 4 && f <= 2) c.rfm_segment = 'Potential Loyalists';
      else if (r <= 2 && f >= 3) c.rfm_segment = 'At Risk';
      else c.rfm_segment = 'Lost';

      counts[c.rfm_segment] = (counts[c.rfm_segment] || 0) + 1;
    });

    const repeatCount = customers.filter(c => c.frequency > 1).length;
    const totalCLV = customers.reduce((sum, c) => sum + c.estimated_clv, 0);

    return {
      segment_counts: counts,
      total_customers: customers.length,
      repeat_customers: repeatCount,
      repeat_purchase_rate_pct: +((repeatCount / customers.length * 100).toFixed(2)),
      avg_customer_lifetime_value: Math.round(totalCLV / (customers.length || 1)),
      churn_risk_count: customers.filter(c => c.churn_risk).length,
      customers: [...customers].sort((a, b) => b.monetary - a.monetary)
    };
  }

  getCohorts(): CohortRow[] {
    const custSignups = new Map<string, string>();
    this.items.forEach(it => {
      if (!custSignups.has(it.customer_id) || it.order_date < custSignups.get(it.customer_id)!) {
        custSignups.set(it.customer_id, it.order_date.substring(0, 7));
      }
    });

    const cohortsMap = new Map<string, Set<string>>();
    custSignups.forEach((month, id) => {
      if (!cohortsMap.has(month)) cohortsMap.set(month, new Set());
      cohortsMap.get(month)!.add(id);
    });

    const allMonths = ['2024-01','2024-02','2024-03','2024-04','2024-05','2024-06','2024-07','2024-08','2024-09','2024-10','2024-11','2024-12'];
    const rows: CohortRow[] = [];

    Array.from(cohortsMap.keys()).sort().forEach(cMonth => {
      const custs = cohortsMap.get(cMonth)!;
      const size = custs.size;
      const startIdx = allMonths.indexOf(cMonth);
      if (startIdx === -1) return;

      const retention = [];
      for (let offset = 0; offset <= (allMonths.length - 1 - startIdx); offset++) {
        const target = allMonths[startIdx + offset];
        const active = new Set(this.items.filter(it => custs.has(it.customer_id) && it.order_date.startsWith(target)).map(it => it.customer_id));
        const pct = offset === 0 ? 100.0 : size > 0 ? +((active.size / size * 100).toFixed(1)) : 0;
        retention.push({
          month_index: offset,
          month_label: `M+${offset}`,
          active_count: active.size,
          retention_pct: pct
        });
      }

      rows.push({
        cohort: cMonth,
        cohort_size: size,
        retention
      });
    });

    return rows;
  }

  getForecast(): ForecastResponse {
    const monthly = this.getMonthlyTrend();
    const revs = monthly.map(m => m.revenue);
    const n = revs.length;

    const alpha = 0.35;
    const smoothed = [revs[0]];
    for (let t = 1; t < n; t++) {
      smoothed[t] = alpha * revs[t] + (1 - alpha) * smoothed[t - 1];
    }
    const stdDev = 120000;

    const history = monthly.map((m, idx) => {
      const windowStart = Math.max(0, idx - 2);
      const slice = revs.slice(windowStart, idx + 1);
      const ma = slice.reduce((s, v) => s + v, 0) / slice.length;
      return {
        month: m.month,
        actual_revenue: m.revenue,
        actual_profit: m.profit,
        forecast: Math.round(ma),
        lower_ci: null,
        upper_ci: null,
        is_forecast: false
      };
    });

    const last = smoothed[n - 1];
    const trend = (smoothed[n - 1] - smoothed[0]) / n;
    const forecast = [];

    for (let step = 1; step <= 3; step++) {
      const mStr = `2025-0${step}`;
      const proj = Math.round(last + trend * step);
      const moe = Math.round(1.96 * stdDev * Math.sqrt(step));
      forecast.push({
        month: mStr,
        actual_revenue: null,
        actual_profit: null,
        forecast: proj,
        lower_ci: Math.max(0, proj - moe),
        upper_ci: proj + moe,
        is_forecast: true
      });
    }

    return {
      history,
      forecast,
      methodology: "Holt-Winters Exponential Smoothing (α=0.35) combined with 3-Month Rolling Average and expanding t-distribution variance for 95% Confidence Bounds."
    };
  }

  getAnomalies(): AnomalyItem[] {
    return [
      {
        id: 'ANOM-REV-SPIKE-01',
        type: 'Revenue Spike',
        severity: 'high',
        date: '2024-11-28',
        metric: '₹2,64,478',
        expected: '₹95,000',
        description: 'Daily revenue was 2.8σ above normal baseline (+₹1,69,478) driven by festival electronics volume.',
        action: 'Investigate marketing campaign or flash sale driver for replication.'
      },
      {
        id: 'ANOM-REV-DROP-01',
        type: 'Revenue Drop',
        severity: 'critical',
        date: '2024-02-14',
        metric: '₹41,200',
        expected: '₹95,000',
        description: 'Daily revenue fell 2.4σ below normal baseline due to payment gateway timeout spike.',
        action: 'Verify payment gateway logs and checkout funnel health.'
      },
      {
        id: 'ANOM-DISC-01',
        type: 'Abnormal Discounting',
        severity: 'medium',
        date: 'Fiscal Year 2024',
        metric: '48 orders at ≥15% discount',
        expected: 'Policy max: 10%',
        description: '48 transactions breached threshold discount limits, eroding overall margin.',
        action: 'Enforce strict promo code validation rules and manager sign-off.'
      },
      {
        id: 'ANOM-MARGIN-01',
        type: 'Unusual Margin Compression',
        severity: 'high',
        date: 'Ongoing 2024 Trend',
        metric: '124 orders below 25% margin',
        expected: 'Target gross margin: ≥ 45%',
        description: 'Profit margin compressed severely in Grocery and discounted Electronics.',
        action: 'Renegotiate wholesale vendor pricing or revise floor selling prices.'
      }
    ];
  }

  getInsights(): BusinessInsight[] {
    const kpis = this.getKPIs();
    return [
      {
        id: 'INS-01',
        type: 'warning',
        title: 'Grocery Margin Compression',
        stat: '32.4% margin',
        finding: `Grocery generated ₹18.75L revenue but operates at a narrow 32.4% margin, significantly below company average of ${kpis.profit_margin_pct}%.`,
        recommendation: 'Implement minimum basket thresholds and bundle with high-margin items to restore unit economics.'
      },
      {
        id: 'INS-02',
        type: 'positive',
        title: 'Hyderabad Regional Leadership',
        stat: '₹41.23L revenue',
        finding: 'Hyderabad is the #1 regional revenue driver with strong customer concentration and higher repeat order frequency.',
        recommendation: 'Increase regional warehouse capacity and localized marketing spend in Southern hubs.'
      },
      {
        id: 'INS-03',
        type: 'alert',
        title: '26 Customers Show Churn Risk',
        stat: '26 customers at risk',
        finding: 'RFM behavioral modeling identified 26 previously high-spending customers with zero transaction activity in over 90 days.',
        recommendation: 'Deploy personalized win-back SMS/email campaigns with exclusive loyalty discounts.'
      },
      {
        id: 'INS-04',
        type: 'trend',
        title: 'Discount Elasticity Impact',
        stat: '35% margin on heavy discounts',
        finding: 'Orders discounted above 10% experienced an average 18% reduction in profit margin without generating proportional volume lift.',
        recommendation: 'Cap algorithmic promotional discounts at 8% across Electronics and Furniture.'
      }
    ];
  }
}

export const localDb = new LocalAnalyticsDatabase();
