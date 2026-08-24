
# Currency & Expense Tracker

A full-stack app to log expenses in different currencies and see them converted into a single "home currency" with a running total.

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** React (Vite)
- **Storage:** In-memory (no database)
- **Styling:** Plain CSS
- **Exchange Rate API:** [exchangerate-api.com](https://www.exchangerate-api.com/) (free, no API key required)

## Setup & Run

### Backend

```bash
cd backend
npm install
node server.js
```

Server runs on http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on http://localhost:5173

**Note:** Both servers must be running at the same time.

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /expenses | Get all expenses |
| POST | /expenses | Add new expense (body: title, amount, currency) |
| DELETE | /expenses/:id | Delete expense by ID |
| GET | /convert?from=X&to=Y&amount=Z | Convert currency |

## Assumptions

1. Used exchangerate-api.com instead of frankfurter.app because frankfurter does not support NPR (Nepalese Rupee), which was listed in the assignment requirements.
2. No authentication required — single user assumed.
3. Data does not persist after server restart (as per requirements).
4. Conversion happens sequentially for each expense (could be parallelized with more time).

## Improvements With More Time

1. **Parallel conversion:** Use Promise.all() to convert all expenses simultaneously instead of one by one.
2. **Caching:** Cache conversion rates to avoid repeated API calls for the same currency pair.
3. **Currency formatting:** Format numbers with proper symbols and decimal places (e.g., $100.00, ₹5,000.00).
4. **Responsive design:** Better mobile layout.
5. **Edit expense:** Currently only add/delete, could add edit functionality.
6. **Date display:** Show expense dates in a readable format.
7. **Tests:** Add unit tests for API endpoints and React components.
