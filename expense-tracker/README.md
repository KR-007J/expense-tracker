# ExpenseFlow - Vibrant Expense Tracker 💰

A beautiful, modern expense tracking web application built with Python Flask and vanilla JavaScript. Features Google OAuth authentication, real-time expense tracking, and a stunning gradient UI.

## ✨ Features

- 🔐 Google OAuth Authentication
- 💸 Add, view, and delete expenses
- 📊 Real-time statistics and category breakdowns
- 🎨 Vibrant, modern UI with smooth animations
- 📱 Fully responsive design
- 🚀 Deploy to Render or Firebase

## 🎯 Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Google OAuth 2.0
- **Hosting**: Render / Firebase (compatible with both)

## 📋 Prerequisites

- Python 3.8 or higher
- Google Cloud Console account (for OAuth)
- Render or Firebase account (for deployment)

## 🚀 Local Setup

### 1. Clone and Install

```bash
# Install dependencies
pip install -r requirements.txt
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:5000/authorize` (for local)
     - `https://your-app-name.onrender.com/authorize` (for Render)

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
SECRET_KEY=your-secret-key-here
PORT=5000
```

### 4. Run Locally

```bash
python app.py
```

Visit `http://localhost:5000` in your browser!

## 🌐 Deployment

### Option 1: Deploy to Render

1. **Create a new Web Service** on [Render](https://render.com)

2. **Connect your GitHub repository**

3. **Configure the service:**
   - **Name**: your-app-name
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

4. **Add Environment Variables:**
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `SECRET_KEY`: A random secret key
   - `PORT`: 10000 (Render's default)

5. **Update Google OAuth redirect URI:**
   - Add `https://your-app-name.onrender.com/authorize`

6. **Deploy!** Your app will be live at `https://your-app-name.onrender.com`

### Option 2: Deploy to Firebase

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase:**
```bash
firebase login
```

3. **Initialize Firebase:**
```bash
firebase init hosting
```

4. **Create firebase.json:**
```json
{
  "hosting": {
    "public": "static",
    "rewrites": [{
      "source": "**",
      "function": "app"
    }]
  }
}
```

5. **Deploy:**
```bash
firebase deploy
```

**Note**: For Firebase, you'll need to set up Firebase Functions for the backend. Consider using Render for easier Python deployment.

## 📁 Project Structure

```
expense-tracker/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Vibrant CSS styles
│   └── js/
│       └── app.js        # Frontend JavaScript
└── README.md
```

## 🎨 Design Features

- **Sunset Gradient Theme**: Vibrant colors with smooth gradients
- **Animated Login Screen**: Floating card animations
- **Responsive Design**: Works perfectly on mobile and desktop
- **Smooth Transitions**: All interactions are buttery smooth
- **Category Icons**: Visual emoji-based categorization

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use strong SECRET_KEY in production
- Enable HTTPS in production
- Review OAuth scopes and permissions

## 📊 Data Storage

Currently uses in-memory storage (data resets on server restart). For production:

1. Add PostgreSQL database:
```bash
pip install psycopg2-binary
```

2. Use SQLAlchemy for ORM:
```bash
pip install Flask-SQLAlchemy
```

3. Update `app.py` to use database instead of `users_expenses` dictionary

## 🐛 Troubleshooting

**OAuth Error**: Make sure redirect URI matches exactly in Google Console

**Module Not Found**: Run `pip install -r requirements.txt`

**Port Already in Use**: Change PORT in `.env` file

**CORS Issues**: Check CORS configuration in `app.py`

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

This is a student project. Feel free to fork and modify for your own use!

## 🌟 Future Enhancements

- [ ] Add database persistence (PostgreSQL/MongoDB)
- [ ] Export expenses to CSV/PDF
- [ ] Budget setting and alerts
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Charts and visualizations
- [ ] Email notifications

## 📧 Support

For issues or questions, please open an issue on GitHub or contact your instructor.

---

Made with ❤️ for Python subject project
