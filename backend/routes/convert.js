const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
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
      'https://api.frankfurter.app/latest?amount=' + amount + '&from=' + from + '&to=' + to
    );

    if (!response.ok) {
      return res.status(400).json({ error: 'Invalid currency or conversion not supported' });
    }

    const data = await response.json();

    res.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: parseFloat(amount),
      converted: data.rates[to.toUpperCase()]
    });

  } catch (error) {
    console.error('Conversion error:', error.message);
    res.status(503).json({ error: 'Conversion service unavailable' });
  }
});

module.exports = router;