# 🍛 Aroma Biriyani

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" />
  <img src="https://img.shields.io/github/last-commit/pragatisingh1556/aroma-biryani-?style=for-the-badge&color=d4580a" />
  <img src="https://img.shields.io/github/repo-size/pragatisingh1556/aroma-biryani-?style=for-the-badge&color=blueviolet" />
</p>

<p align="center">
  <b>A full-stack food ordering web app for Aroma Biriyani restaurant 🚀</b><br/>
  Order online · Track delivery · Manage with admin panel
</p>

---

## ✨ Features

### 👤 Customer
- 🛒 Browse menu with categories & search
- 🍱 Add to cart with addons
- 🎟 Apply coupon codes & loyalty points
- 🚚 Delivery or pickup options
- 📍 Saved addresses with delivery range check
- 📦 Order tracking with real-time status
- 🔐 OTP-based delivery confirmation
- ⭐ Loyalty points system (Bronze / Silver / Gold)
- 📸 Gallery, Blog, What's New section
- 🏪 Store locator with Google Maps

### 🔧 Admin Panel
- 📋 Manage orders (confirm, assign, update status)
- 🍛 Add / edit / delete products & categories
- 🎟 Create & manage coupons
- 🏪 Store management with delivery radius
- 📸 Media & gallery upload
- 📰 Blog & What's New posts
- 👥 User management
- 💰 Payments & loyalty points overview

### 👨‍🍳 Kitchen & Delivery Staff Dashboards
- Kitchen: view confirmed orders, set cooking time
- Delivery: view assigned orders, verify OTP on delivery

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Context API |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | JWT + bcryptjs |
| Styling | Inline styles + Custom CSS classes |
| SMS OTP | Twilio |

---

## 📁 Project Structure

```
aroma-biriyani/
├── client/          # React frontend
│   └── src/
│       ├── pages/       # All page components
│       ├── components/  # Navbar, Footer, CartBar etc.
│       ├── context/     # Auth & Cart context
│       └── api/         # Axios instance
├── server/          # Node.js backend
│   ├── routes/      # API routes
│   ├── controllers/ # Business logic
│   ├── middleware/  # Auth middleware
│   └── config/      # DB config
└── database/        # SQL schema & seed data
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/pragatisingh1556/aroma-biryani-.git
cd aroma-biryani-
```

### 2. Setup Server
```bash
cd server
npm install
```
Create a `.env` file in `/server`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=aroma_biriyani
JWT_SECRET=your_jwt_secret
PORT=5000
```
```bash
npm start
```

### 3. Setup Client
```bash
cd client
npm install
npm start
```

### 4. Setup Database
Import the SQL file:
```bash
mysql -u root -p aroma_biriyani < database/schema.sql
```

---

## 📸 Screenshots

> Coming soon...

---

## 👩‍💻 Developer

Made with ❤️ by **[pragatisingh1556](https://github.com/pragatisingh1556)**

---

<p align="center">
  <i>Made with ❤️ and a lot of spices 🌶️</i>
</p>
