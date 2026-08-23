// backend/data/expenses.js

const expenses = [];

let nextId = 1;

function getAll() {
  return expenses;
}

function getById(id) {
  return expenses.find(exp => exp.id === id);
}

function create(title, amount, currency) {
  const newExpense = {
    id: nextId++,
    title,
    amount,
    currency,
    date: new Date().toISOString()
  };
  expenses.push(newExpense);
  return newExpense;
}

function remove(id) {
  const index = expenses.findIndex(exp => exp.id === id);
  if (index === -1) {
    return false; // Not found
  }
  expenses.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  remove
};