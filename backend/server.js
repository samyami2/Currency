const express = require('express');
const cors = require('cors');          
const expensesRouter = require('./routes/expenses');

const app = express();
const PORT = 3000;

app.use(cors());                       
app.use(express.json());
app.use('/expenses', expensesRouter);
// Convert route
app.get('/convert', async (req, res) => {
  const { from, to, amount } = req.query;

  const errors = [];

  if (!from) errors.push('Missing from currency');
  if (!to) errors.push('Missing to currency');
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    errors.push('Valid positive amount is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/' + from
    );

    if (!response.ok) {
      return res.status(400).json({ error: 'Invalid currency or conversion not supported' });
    }

    const data = await response.json();
    const rate = data.rates[to.toUpperCase()];

    if (!rate) {
      return res.status(400).json({ error: 'Currency not supported' });
    }

    res.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: parseFloat(amount),
      converted: parseFloat(amount) * rate
    });

  } catch (error) {
    console.error('Conversion error:', error.message);
    res.status(503).json({ error: 'Conversion service unavailable' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Currency & Expense API is running' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});