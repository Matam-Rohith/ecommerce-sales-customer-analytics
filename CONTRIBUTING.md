# Contributing

This is a personal portfolio project, but suggestions, improvements, and bug reports are welcome.

---

## Getting Started

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/ecommerce-sales-customer-analytics.git
cd ecommerce-sales-customer-analytics

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes, then commit
git add .
git commit -m "feat: describe what you changed"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

---

## What You Can Contribute

- **New charts** — cohort retention heatmap, customer LTV over time, discount impact analysis
- **Dashboard improvements** — date range filter, category filter dropdown, export to PNG button
- **Python analysis** — Jupyter Notebook version of analysis.py, additional KPIs
- **SQL additions** — more window function examples, stored procedures
- **Mobile layout fixes** — improve responsiveness below 400px
- **Bug reports** — open an Issue with steps to reproduce

---

## Code Style

| File type | Convention |
|---|---|
| HTML / CSS | 2-space indent, semantic elements |
| JavaScript | ES6+, camelCase variables, no var |
| Python | PEP 8, snake_case, 4-space indent |
| SQL | UPPERCASE keywords, snake_case identifiers |

---

## Commit Message Format

```
feat: add cohort retention chart
fix: correct margin % calculation for Grocery
docs: update data dictionary with new columns
refactor: split analysis.py into separate modules
```

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/Matam-Rohith/ecommerce-sales-customer-analytics/issues) and include:

1. What you expected to happen
2. What actually happened
3. Steps to reproduce
4. Browser and OS (for dashboard issues)
