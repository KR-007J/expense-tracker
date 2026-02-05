from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from datetime import datetime, timedelta
import os
import json
from functools import wraps

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
CORS(app)

# OAuth Setup
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# In-memory storage (replace with database in production)
users_expenses = {}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    token = google.authorize_access_token()
    user_info = token.get('userinfo')
    if user_info:
        session['user'] = {
            'email': user_info['email'],
            'name': user_info.get('name', 'User'),
            'picture': user_info.get('picture', '')
        }
        # Initialize user expenses if new
        if user_info['email'] not in users_expenses:
            users_expenses[user_info['email']] = []
    return redirect('/')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

@app.route('/api/user')
def get_user():
    if 'user' in session:
        return jsonify(session['user'])
    return jsonify({'error': 'Not authenticated'}), 401

@app.route('/api/expenses', methods=['GET'])
@login_required
def get_expenses():
    user_email = session['user']['email']
    expenses = users_expenses.get(user_email, [])
    return jsonify(expenses)

@app.route('/api/expenses', methods=['POST'])
@login_required
def add_expense():
    user_email = session['user']['email']
    data = request.json
    
    expense = {
        'id': len(users_expenses.get(user_email, [])) + 1,
        'title': data.get('title'),
        'amount': float(data.get('amount')),
        'category': data.get('category'),
        'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
        'description': data.get('description', ''),
        'created_at': datetime.now().isoformat()
    }
    
    if user_email not in users_expenses:
        users_expenses[user_email] = []
    
    users_expenses[user_email].append(expense)
    return jsonify(expense), 201

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
@login_required
def delete_expense(expense_id):
    user_email = session['user']['email']
    expenses = users_expenses.get(user_email, [])
    
    users_expenses[user_email] = [e for e in expenses if e['id'] != expense_id]
    return jsonify({'success': True})

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
@login_required
def update_expense(expense_id):
    user_email = session['user']['email']
    data = request.json
    expenses = users_expenses.get(user_email, [])
    
    for expense in expenses:
        if expense['id'] == expense_id:
            expense.update({
                'title': data.get('title', expense['title']),
                'amount': float(data.get('amount', expense['amount'])),
                'category': data.get('category', expense['category']),
                'date': data.get('date', expense['date']),
                'description': data.get('description', expense['description'])
            })
            return jsonify(expense)
    
    return jsonify({'error': 'Expense not found'}), 404

@app.route('/api/stats')
@login_required
def get_stats():
    user_email = session['user']['email']
    expenses = users_expenses.get(user_email, [])
    
    total = sum(e['amount'] for e in expenses)
    
    # Category breakdown
    categories = {}
    for expense in expenses:
        cat = expense['category']
        categories[cat] = categories.get(cat, 0) + expense['amount']
    
    # Monthly breakdown
    monthly = {}
    for expense in expenses:
        month = expense['date'][:7]  # YYYY-MM
        monthly[month] = monthly.get(month, 0) + expense['amount']
    
    return jsonify({
        'total': total,
        'count': len(expenses),
        'categories': categories,
        'monthly': monthly
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
