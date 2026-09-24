'use strict';

const expenses = [
  { id: 'supplies', label: 'Office supplies', budget: 32000, actual: 34800 },
  { id: 'software', label: 'Software', budget: 16000, actual: 15000 },
  { id: 'marketing', label: 'Marketing', budget: 24000, actual: 27500 },
  { id: 'transport', label: 'Transportation', budget: 18000, actual: 16800 },
];
const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const dialog = document.querySelector('#finance-lab');
const openButton = document.querySelector('#open-lab');
const error = document.querySelector('#lab-error');
const result = document.querySelector('.lab-result');
const downloadButton = document.querySelector('#download-lab');
const inputs = document.querySelector('#expense-inputs');

expenses.forEach(item => {
  const row = document.createElement('div');
  row.className = 'expense-row';
  const label = document.createElement('label');
  label.htmlFor = item.id;
  label.textContent = item.label;
  const budget = document.createElement('span');
  budget.textContent = money(item.budget);
  const input = document.createElement('input');
  input.id = item.id;
  input.type = 'number';
  input.inputMode = 'decimal';
  input.min = '0';
  input.max = '100000';
  input.step = '0.01';
  input.value = (item.actual / 100).toFixed(2);
  input.setAttribute('aria-label', `${item.label} actual spending in US dollars`);
  input.setAttribute('aria-describedby', 'lab-error');
  input.addEventListener('input', updateTotals);
  row.append(label, budget, input);
  inputs.append(row);
});

function getValues() {
  let valid = true;
  const values = expenses.map(item => {
    const input = document.getElementById(item.id);
    const number = input.valueAsNumber;
    const isValid = input.value.trim() !== '' && Number.isFinite(number) && input.checkValidity();
    input.setAttribute('aria-invalid', String(!isValid));
    if (!isValid) valid = false;
    return { ...item, actual: Math.round(number * 100) };
  });
  return { valid, values };
}

function updateTotals() {
  const { valid, values } = getValues();
  error.hidden = valid;
  downloadButton.disabled = !valid;
  if (!valid) {
    error.textContent = 'Enter an amount from $0 to $100,000 with no more than two decimal places for each expense.';
    document.querySelector('#actual-total').textContent = '—';
    document.querySelector('#variance-total').textContent = '—';
    document.querySelector('#variance-label').textContent = 'Variance';
    document.querySelector('#lab-insight').textContent = 'Complete the highlighted amounts to see your result.';
    result.dataset.state = 'invalid';
    return;
  }
  error.textContent = '';
  const actual = values.reduce((sum, item) => sum + item.actual, 0);
  const budget = values.reduce((sum, item) => sum + item.budget, 0);
  const variance = actual - budget;
  const percentage = (Math.abs(variance) / budget * 100).toFixed(1);
  result.dataset.state = variance > 0 ? 'over' : variance < 0 ? 'under' : 'balanced';
  document.querySelector('#actual-total').textContent = money(actual);
  document.querySelector('#variance-label').textContent = variance > 0 ? 'Over budget' : variance < 0 ? 'Under budget' : 'On budget';
  document.querySelector('#variance-total').textContent = money(Math.abs(variance));
  document.querySelector('#lab-insight').textContent = variance === 0
    ? `Spending matches the ${money(budget)} budget exactly.`
    : `Spending is ${percentage}% ${variance > 0 ? 'above' : 'below'} the ${money(budget)} budget.`;
}

openButton.addEventListener('click', () => {
  dialog.showModal();
  document.body.classList.add('modal-open');
  document.querySelector('#close-lab').focus();
});
document.querySelector('#close-lab').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  openButton.focus();
});
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
document.querySelector('#reset-lab').addEventListener('click', () => {
  expenses.forEach(item => { document.getElementById(item.id).value = (item.actual / 100).toFixed(2); });
  updateTotals();
});
downloadButton.addEventListener('click', () => {
  const { valid, values } = getValues();
  if (!valid) return;
  const rows = [['Illustrative portfolio exercise - fictional data (USD)'], ['Expense', 'Budget', 'Actual', 'Variance (actual minus budget)']];
  values.forEach(item => rows.push([item.label, (item.budget / 100).toFixed(2), (item.actual / 100).toFixed(2), ((item.actual - item.budget) / 100).toFixed(2)]));
  const budget = values.reduce((sum, item) => sum + item.budget, 0);
  const actual = values.reduce((sum, item) => sum + item.actual, 0);
  rows.push(['Total', (budget / 100).toFixed(2), (actual / 100).toFixed(2), ((actual - budget) / 100).toFixed(2)]);
  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'expense-lab-sample.csv';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
updateTotals();
