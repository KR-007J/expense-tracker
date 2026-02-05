# 🚀 Complete Deployment Guide

## 📌 Pre-Deployment Checklist

- [ ] Google OAuth credentials obtained
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Environment variables ready

---

## 🎯 Option 1: Deploy to Render (Recommended for Python)

Render is the easiest option for Python Flask applications.

### Step 1: Setup Google OAuth

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. For Application type, select **Web application**
7. Add Authorized redirect URIs:
   ```
   https://your-app-name.onrender.com/authorize
   ```
   (Replace `your-app-name` with your chosen name)
8. Save and copy your **Client ID** and **Client Secret**

### Step 2: Prepare Your Code

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/expense-tracker.git
git push -u origin main
```

### Step 3: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub account and select your repository
4. Configure your service:
   - **Name**: `expense-tracker` (or your preferred name)
   - **Environment**: `Python 3`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free

5. Add Environment Variables (click **Advanced**):
   ```
   GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = your-client-secret
   SECRET_KEY = generate-a-random-string-here
   ```
   
   To generate SECRET_KEY, run in Python:
   ```python
   import secrets
   print(secrets.token_hex(32))
   ```

6. Click **Create Web Service**

7. Wait for deployment (5-10 minutes)

8. Once deployed, your app will be at: `https://your-app-name.onrender.com`

### Step 4: Update Google OAuth

1. Go back to Google Cloud Console
2. Update your OAuth 2.0 Client ID
3. Make sure the redirect URI matches exactly:
   ```
   https://your-app-name.onrender.com/authorize
   ```

### Step 5: Test Your App

1. Visit your Render URL
2. Click "Continue with Google"
3. Authorize the app
4. Start adding expenses!

---

## 🔥 Option 2: Deploy to Firebase

Firebase Hosting with Cloud Functions can also work, but requires more setup.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login and Initialize

```bash
firebase login
firebase init
```

Select:
- ☑ Functions
- ☑ Hosting

### Step 3: Setup Functions

1. Create `functions/requirements.txt`:
```
Flask==3.0.0
Flask-Cors==4.0.0
Authlib==1.3.0
```

2. Move your Python code to `functions/main.py`

3. Update imports to work with Firebase Functions

### Step 4: Configure firebase.json

```json
{
  "hosting": {
    "public": "public",
    "rewrites": [{
      "source": "**",
      "function": "app"
    }]
  }
}
```

### Step 5: Deploy

```bash
firebase deploy
```

**Note**: Firebase's free tier has limitations. Render is recommended for Python apps.

---

## 🌐 Custom Domain (Optional)

### For Render:

1. Go to your service settings
2. Click **Custom Domains**
3. Add your domain
4. Update DNS records as instructed

### For Firebase:

1. Firebase Console → Hosting
2. Add custom domain
3. Follow DNS configuration steps

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   - Add to `.gitignore` ✓ (already done)

2. **Use strong SECRET_KEY**
   - Generate using Python secrets module
   - Different for each environment

3. **Enable HTTPS**
   - Render provides this automatically ✓
   - Firebase provides this automatically ✓

4. **Review OAuth Scopes**
   - Only request necessary permissions
   - Current: email, profile (minimal) ✓

5. **Add CORS restrictions**
   - Update CORS to only allow your domain in production

---

## 💾 Adding Database Persistence

Current app uses in-memory storage. To add persistence:

### Option 1: PostgreSQL (Render)

1. Add PostgreSQL database in Render:
   - Dashboard → New → PostgreSQL
   - Copy connection string

2. Update `requirements.txt`:
```
psycopg2-binary==2.9.9
Flask-SQLAlchemy==3.1.1
```

3. Update `app.py`:
```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(255))
    title = db.Column(db.String(255))
    amount = db.Column(db.Float)
    category = db.Column(db.String(100))
    date = db.Column(db.String(100))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime)
```

### Option 2: MongoDB

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Update `requirements.txt`:
```
pymongo==4.6.0
```

3. Add connection string to environment variables

---

## 🐛 Common Issues & Solutions

### Issue: "OAuth Error: redirect_uri_mismatch"
**Solution**: Make sure redirect URI in Google Console exactly matches:
- Format: `https://your-app.onrender.com/authorize`
- No trailing slash
- Must be HTTPS (not HTTP)

### Issue: "Module not found" error
**Solution**: 
```bash
pip install -r requirements.txt
```
Make sure all dependencies are listed in requirements.txt

### Issue: App crashes after deployment
**Solution**: Check Render logs:
- Dashboard → Your Service → Logs
- Look for specific error messages

### Issue: "Not authenticated" after login
**Solution**: 
- Check SECRET_KEY is set
- Verify OAuth credentials are correct
- Check redirect URI matches

### Issue: Styles not loading
**Solution**:
- Check file paths in HTML
- Verify static folder structure
- Clear browser cache

---

## 📊 Monitoring & Maintenance

### Render Dashboard

- **Logs**: Real-time application logs
- **Metrics**: CPU, memory usage
- **Environment**: Manage environment variables
- **Settings**: Deploy hooks, custom domains

### Health Checks

Render automatically pings your app to keep it alive (free tier may sleep after 15 min of inactivity).

To prevent sleeping:
1. Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com/)
2. Ping your app every 10 minutes

---

## 🚀 Deployment Automation

### Auto-deploy on Git Push

Render automatically deploys when you push to GitHub!

```bash
git add .
git commit -m "Update feature"
git push
```

Render will automatically:
1. Pull latest code
2. Install dependencies
3. Restart service

---

## 📈 Scaling & Upgrades

### When to Upgrade from Free Tier:

- Need faster performance
- Want custom domain
- Need 24/7 uptime (no sleeping)
- Need more resources

### Render Pricing:
- **Free**: $0/month (sleeps after 15 min)
- **Starter**: $7/month (always on)
- **Standard**: $25/month (more resources)

---

## ✅ Final Checklist

Before submitting your project:

- [ ] App deploys successfully
- [ ] Google login works
- [ ] Can add expenses
- [ ] Can delete expenses
- [ ] Stats update correctly
- [ ] Responsive on mobile
- [ ] README is complete
- [ ] Code is commented
- [ ] No sensitive data in code
- [ ] GitHub repository is public/accessible

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Flask Docs**: https://flask.palletsprojects.com/
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Stack Overflow**: Tag questions with `flask`, `oauth`, `render`

---

## 🎓 Project Presentation Tips

For your Python subject project:

1. **Demo the app live**: Show the deployed version
2. **Explain the tech stack**: Why Flask? Why Google OAuth?
3. **Highlight features**: Authentication, CRUD operations, UI/UX
4. **Discuss challenges**: What problems did you solve?
5. **Show the code**: Walk through key parts
6. **Future improvements**: What would you add next?

---

Good luck with your project! 🚀
