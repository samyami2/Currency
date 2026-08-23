const express = require('express');
const router = express.Router();
const expensesData = require('../data/expenses');

const VALID_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'NPR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];

// GET /expenses
router.get('/', (req, res) => {
  res.json(expensesData.getAll());
});

// POST /expenses
router.post('/', (req, res) => {
  const { title, amount, currency } = req.body;
  
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
    errors.push('Valid positive amount is required');
  }
  
  if (!currency || !VALID_CURRENCIES.includes(currency.toUpperCase())) {
    errors.push('Valid currency code is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  const newExpense = expensesData.create(title.trim(), parseFloat(amount), currency.toUpperCase());
  res.status(201).json(newExpense);
});

// DELETE /expenses/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid expense ID' });
  }
  
  const deleted = expensesData.remove(id);
  
  if (!deleted) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  
  res.status(204).send();
});

module.exports = router;