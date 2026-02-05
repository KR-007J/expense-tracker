// State management
let currentUser = null;
let expenses = [];

// Category emoji mapping
const categoryEmojis = {
    'Food': '🍔',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills': '💡',
    'Health': '🏥',
    'Other': '📦'
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    // Check if user is logged in
    await checkAuth();
    
    // Event listeners
    document.getElementById('google-login-btn').addEventListener('click', login);
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('expense-form').addEventListener('submit', handleAddExpense);
});

// Authentication functions
async function checkAuth() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            currentUser = await response.json();
            showAppScreen();
            await loadExpenses();
        } else {
            showLoginScreen();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showLoginScreen();
    }
}

function login() {
    window.location.href = '/login';
}

function logout() {
    window.location.href = '/logout';
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('app-screen').classList.remove('active');
}

function showAppScreen() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('app-screen').classList.add('active');
    
    // Update user info
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-avatar').src = currentUser.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name);
}

// Expense management
async function loadExpenses() {
    try {
        const response = await fetch('/api/expenses');
        if (response.ok) {
            expenses = await response.json();
            renderExpenses();
            updateStats();
        }
    } catch (error) {
        console.error('Failed to load expenses:', error);
    }
}

async function handleAddExpense(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };
    
    try {
        const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            const newExpense = await response.json();
            expenses.push(newExpense);
            renderExpenses();
            updateStats();
            
            // Reset form
            e.target.reset();
            document.getElementById('date').valueAsDate = new Date();
            
            // Show success animation
            showNotification('Expense added successfully!');
        }
    } catch (error) {
        console.error('Failed to add expense:', error);
        showNotification('Failed to add expense', 'error');
    }
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/expenses/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            expenses = expenses.filter(e => e.id !== id);
            renderExpenses();
            updateStats();
            showNotification('Expense deleted');
        }
    } catch (error) {
        console.error('Failed to delete expense:', error);
        showNotification('Failed to delete expense', 'error');
    }
}

// Rendering functions
function renderExpenses() {
    const container = document.getElementById('expenses-list');
    
    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💸</div>
                <p>No expenses yet. Start tracking your spending!</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    container.innerHTML = sortedExpenses.map(expense => `
        <div class="expense-item">
            <div class="expense-emoji">${categoryEmojis[expense.category]}</div>
            <div class="expense-info">
                <h3>${expense.title}</h3>
                <div class="expense-meta">
                    <span>${expense.category}</span>
                    <span>•</span>
                    <span>${formatDate(expense.date)}</span>
                    ${expense.description ? `<span>•</span><span>${expense.description}</span>` : ''}
                </div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `).join('');
}

function updateStats() {
    // Calculate totals
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;
    
    // Update stats cards
    document.getElementById('total-spent').textContent = `$${total.toFixed(2)}`;
    document.getElementById('total-count').textContent = count;
    document.getElementById('avg-spent').textContent = `$${average.toFixed(2)}`;
    
    // Update categories
    renderCategories();
}

function renderCategories() {
    const categoryTotals = {};
    
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const container = document.getElementById('categories-grid');
    
    if (Object.keys(categoryTotals).length === 0) {
        container.innerHTML = '<p style="color: var(--text-dim); grid-column: 1/-1;">No category data yet</p>';
        return;
    }
    
    container.innerHTML = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => `
            <div class="category-card">
                <span class="category-emoji">${categoryEmojis[category]}</span>
                <div class="category-name">${category}</div>
                <div class="category-amount">$${amount.toFixed(2)}</div>
            </div>
        `).join('');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--accent)' : '#EF4444'};
        color: white;
        border-radius: 12px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make deleteExpense available globally
window.deleteExpense = deleteExpense;
