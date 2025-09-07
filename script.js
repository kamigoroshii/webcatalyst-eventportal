// Global Variables
let currentUser = null;
let expenses = [];
let expenseId = 1;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalAmount = document.getElementById('totalAmount');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize App
document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    expenseForm.addEventListener('submit', handleAddExpense);
    logoutBtn.addEventListener('click', handleLogout);
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();

    if (username) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        showExpenseTracker();
        loadExpenses();
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expenses');
    expenses = [];
    showLogin();
}

function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showExpenseTracker();
        loadExpenses();
    } else {
        showLogin();
    }
}

// UI Display Functions
function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('expenseSection').style.display = 'none';
}

function showExpenseTracker() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('expenseSection').style.display = 'block';
    userDisplay.textContent = currentUser;
}

// Expense Management Functions
function handleAddExpense(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (description && amount > 0) {
        const expense = {
            id: expenseId++,
            description,
            amount,
            category,
            date: new Date().toLocaleDateString()
        };

        expenses.push(expense);
        saveExpenses();
        renderExpenses();
        updateTotal();
        expenseForm.reset();
    }
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    renderExpenses();
    updateTotal();
}

function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        document.getElementById('description').value = expense.description;
        document.getElementById('amount').value = expense.amount;
        document.getElementById('category').value = expense.category;

        deleteExpense(id);
    }
}

// Data Persistence
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpenses() {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        expenseId = Math.max(...expenses.map(exp => exp.id), 0) + 1;
        renderExpenses();
        updateTotal();
    }
}

// Rendering Functions
function renderExpenses() {
    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <div class="expense-info">
                <div class="expense-description">${expense.description}</div>
                <div class="expense-details">
                    <span class="expense-category">${expense.category}</span>
                    <span class="expense-date">${expense.date}</span>
                </div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <div class="expense-actions">
                <button onclick="editExpense(${expense.id})" class="edit-btn">Edit</button>
                <button onclick="deleteExpense(${expense.id})" class="delete-btn">Delete</button>
            </div>
        `;
        expenseList.appendChild(expenseItem);
    });
}

function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = total.toFixed(2);
}