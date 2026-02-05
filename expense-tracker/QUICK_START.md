# ⚡ Quick Setup Reference

## 🏃 5-Minute Local Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Create .env file
cp .env.example .env

# 3. Edit .env and add your Google OAuth credentials

# 4. Run the app
python app.py

# 5. Visit http://localhost:5000
```

## 🔑 Get Google OAuth Credentials (3 minutes)

1. https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Create OAuth Client ID
4. Add redirect URI: `http://localhost:5000/authorize`
5. Copy Client ID & Secret to `.env`

## 🚀 Deploy to Render (10 minutes)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Go to render.com
# 3. New → Web Service
# 4. Connect GitHub repo
# 5. Add environment variables:
#    - GOOGLE_CLIENT_ID
#    - GOOGLE_CLIENT_SECRET  
#    - SECRET_KEY
# 6. Deploy!
```

## 📂 Project Structure

```
expense-tracker/
├── app.py              ← Flask backend
├── templates/
│   └── index.html      ← Main page
├── static/
│   ├── css/style.css   ← Styles
│   └── js/app.js       ← Frontend JS
├── requirements.txt    ← Dependencies
├── .env.example        ← Config template
└── README.md           ← Full documentation
```

## 🎯 Key Environment Variables

```env
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
SECRET_KEY=random-secret-string
PORT=5000
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| OAuth error | Check redirect URI matches exactly |
| Module not found | Run `pip install -r requirements.txt` |
| Port in use | Change PORT in .env |
| Not authenticated | Check SECRET_KEY is set |

## 📱 Features Included

✅ Google OAuth login
✅ Add/delete expenses
✅ Category breakdown
✅ Real-time stats
✅ Responsive design
✅ Beautiful UI with animations
✅ Deploy-ready (Render/Firebase)

## 🎨 Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML/CSS/JavaScript
- **Auth**: Google OAuth 2.0
- **Styling**: Custom CSS with gradients
- **Hosting**: Render / Firebase compatible

## 📚 Important Files

- `app.py` - Main Flask application with routes
- `templates/index.html` - Single page app structure
- `static/css/style.css` - Vibrant UI styling
- `static/js/app.js` - Frontend logic and API calls
- `requirements.txt` - Python dependencies
- `.env` - Environment variables (create this!)

## 🔗 Useful Links

- [README](README.md) - Complete documentation
- [DEPLOYMENT_GUIDE](DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [Google Console](https://console.cloud.google.com/)
- [Render](https://render.com/)

## 💡 Pro Tips

1. **Generate SECRET_KEY**: 
   ```python
   import secrets
   print(secrets.token_hex(32))
   ```

2. **Test locally first** before deploying

3. **Use Render for easy Python deployment**

4. **Keep .env out of Git** (in .gitignore ✓)

5. **Update OAuth redirect URI** for each environment

---

Need help? Check the full README.md and DEPLOYMENT_GUIDE.md!
