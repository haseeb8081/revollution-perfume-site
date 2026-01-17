# MongoDB & Email Setup Guide for Revollution

## 📋 Overview
This guide will help you set up MongoDB Atlas for storing user accounts and orders, and configure email for sending order confirmations.

---

## 🗄️ MongoDB Atlas Setup (Free Forever)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Choose the **FREE tier** (M0 Sandbox - Forever Free)

### Step 2: Create a Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** shared cluster
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Name your cluster (e.g., `revollution-cluster`)
6. Click **"Create"**

### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `revollution-admin`
5. Password: Create a strong password (save it!)
6. Set privileges to: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For development only. In production, restrict to your server IP
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"** tab
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** driver
5. Copy the connection string
6. It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update .env.local
Replace in your `.env.local` file:
```env
MONGODB_URI=mongodb+srv://revollution-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/revollution-store?retryWrites=true&w=majority
```

Replace:
- `revollution-admin` with your username
- `YOUR_PASSWORD` with your actual password
- `cluster0.xxxxx.mongodb.net` with your cluster URL

---

## 📧 Email Setup for Order Confirmations

### Option 1: Gmail SMTP (Easiest for Testing)

#### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Enable **"2-Step Verification"**

#### Step 2: Create App Password
1. After enabling 2-Step, go to: https://myaccount.google.com/apppasswords
2. Select **"Mail"** and **"Other (Custom name)"**
3. Name it: `Revollution Store`
4. Click **"Generate"**
5. Copy the 16-character password (save it!)

#### Step 3: Update .env.local
```env
EMAIL_FROM=Revollution <your-email@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

**Important:** 
- Use the App Password, NOT your regular Gmail password
- Gmail has a daily sending limit (500 emails/day for free accounts)

---

### Option 2: SendGrid (Recommended for Production)

#### Step 1: Create SendGrid Account
1. Go to: https://signup.sendgrid.com/
2. Sign up for free (100 emails/day free forever)

#### Step 2: Create API Key
1. Go to **Settings → API Keys**
2. Click **"Create API Key"**
3. Name: `Revollution Store`
4. Permissions: **Full Access**
5. Copy the API key (you won't see it again!)

#### Step 3: Verify Sender Email
1. Go to **Settings → Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details
4. Verify the email they send you

#### Step 4: Update .env.local
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Revollution <verified-email@yourdomain.com>
```

Then update `src/lib/email.ts` to use SendGrid instead of nodemailer.

---

## 🧪 Testing Your Setup

### Test MongoDB Connection
1. Start your dev server: `npm run dev`
2. The console should show: `MongoDB connected successfully`
3. If error, check your connection string and network access

### Test Email Sending
1. Add products to cart
2. Go through checkout
3. Submit order
4. Check the email inbox you provided
5. You should receive a beautiful order confirmation email

### Troubleshooting MongoDB
- **Authentication failed**: Double-check username/password
- **Network error**: Check Network Access settings (allow 0.0.0.0/0)
- **Timeout**: Cluster might still be provisioning (wait 5-10 minutes)

### Troubleshooting Email
- **Gmail "Less secure apps"**: Use App Password instead
- **Authentication error**: Verify SMTP credentials
- **Connection timeout**: Check SMTP_HOST and SMTP_PORT
- **SendGrid not working**: Verify sender email first

---

## 📊 Database Collections Created Automatically

When you place your first order, these collections will be created:

1. **orders** - All customer orders
   - Order number, customer info, items, total, status
   
2. **users** - User accounts (when authentication is added)
   - Name, email, password hash, profile

3. **products** - Product catalog (currently using dummy data)
   - When you add real products through admin panel

---

## 🎉 You're All Set!

Your Revollution store now has:
✅ Cloud database (MongoDB Atlas)
✅ Order storage
✅ Email confirmations
✅ Professional order emails with your branding

### Next Steps:
1. Replace dummy products with real ones in database
2. Set up authentication (Google OAuth + credentials)
3. Create admin panel to manage orders
4. Add payment processing (Stripe)

---

## 📞 Need Help?

Common issues:
- MongoDB not connecting? → Check connection string format
- Emails not sending? → Verify SMTP credentials
- Orders not saving? → Check MongoDB user permissions

For more help, check:
- MongoDB Docs: https://docs.mongodb.com/
- Nodemailer Docs: https://nodemailer.com/
- SendGrid Docs: https://docs.sendgrid.com/
