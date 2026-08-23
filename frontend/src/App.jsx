import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [convertedExpenses, setConvertedExpenses] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'NPR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];

  // Fetch expenses on load
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Convert all expenses when expenses or homeCurrency changes
  useEffect(() => {
    convertAllExpenses();
  }, [expenses, homeCurrency]);

  async function fetchExpenses() {
    try {
      const res = await fetch(API_URL + '/expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError('Failed to fetch expenses');
    }
  }

  async function convertAllExpenses() {
    if (expenses.length === 0) {
      setConvertedExpenses([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    let converted = [];
    let sum = 0;
    let hasError = false;

    for (const expense of expenses) {
      if (expense.currency === homeCurrency) {
        converted.push({ ...expense, convertedAmount: expense.amount });
        sum += expense.amount;
      } else {
        try {
          const res = await fetch(API_URL + '/convert?from=' + expense.currency + '&to=' + homeCurrency + '&amount=' + expense.amount);
          if (!res.ok) throw new Error();
          const data = await res.json();
          converted.push({ ...expense, convertedAmount: data.converted });
          sum += data.converted;
        } catch (err) {
          converted.push({ ...expense, convertedAmount: null });
          hasError = true;
        }
      }
    }

    setConvertedExpenses(converted);
    setTotal(hasError ? null : sum);
    setLoading(false);
  }

  async function addExpense(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(API_URL + '/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, amount: parseFloat(amount), currency })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      const newExpense = await res.json();
      setExpenses([...expenses, newExpense]);
      setTitle('');
      setAmount('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteExpense(id) {
    try {
      await fetch(API_URL + '/expenses/' + id, { method: 'DELETE' });
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (err) {
      setError('Failed to delete expense');
    }
  }

  return (
    <div className="app">
      <h1>Currency & Expense Tracker</h1>

      {error && <div className="error" onClick={() => setError(null)}>{error} (click to dismiss)</div>}

      <div className="home-currency">
        <label>Home Currency: </label>
        <select value={homeCurrency} onChange={(e) => setHomeCurrency(e.target.value)}>
          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <form className="expense-form" onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0.01"
          step="0.01"
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit">Add Expense</button>
      </form>

      <div className="expense-list">
        <h2>Expenses</h2>
        {convertedExpenses.length === 0 ? (
          <p className="empty">No expenses yet. Add one above!</p>
        ) : (
          <ul>
            {convertedExpenses.map(expense => (
              <li key={expense.id} className="expense-item">
                <div className="expense-info">
                  <span className="expense-title">{expense.title}</span>
                  <span className="expense-original">{expense.amount} {expense.currency}</span>
                  {expense.convertedAmount !== null ? (
                    <span className="expense-converted">≈ {expense.convertedAmount.toFixed(2)} {homeCurrency}</span>
                  ) : (
                    <span className="expense-converted error-text">Conversion failed</span>
                  )}
                </div>
                <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="total">
        <h2>
          Total: {loading ? 'Converting...' : total !== null ? total.toFixed(2) + ' ' + homeCurrency : 'Some conversions failed'}
        </h2>
      </div>
    </div>
  );
}

export default App;