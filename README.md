# 🌟 Maa Anpurna Aahar - Complete E-commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://mysql.com/)

A comprehensive, production-ready e-commerce platform for selling handmade products online. Built with modern web technologies and designed for scalability, security, and exceptional user experience.

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/Vivek152989/-maaanpurnaahar.me.git
cd -maaanpurnaahar.me

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# Setup database
node setup-database.js

# Start the server
npm start

# Visit http://localhost:3000
```

## ✨ **Features**

### 🛒 **E-commerce Functionality**
- **Product Catalog** with filtering and search
- **Shopping Cart** with persistent storage
- **Secure Checkout** process
- **Order Management** and tracking
- **Coupon System** for promotions

### 👥 **User Management**
- **User Registration** and authentication
- **JWT-based Login** system
- **User Profiles** with order history
- **Address Management** for shipping
- **Account Security** with password hashing

### ⚙️ **Admin Dashboard**
- **User Analytics** and statistics
- **Order Processing** and management
- **Product Management** (CRUD operations)
- **Customer Support** message handling
- **Business Intelligence** reporting

### 📧 **Customer Support**
- **Contact Form** for inquiries
- **Message Tracking** system
- **Real-time Notifications**
- **Customer Communication** history

## 🛠️ **Tech Stack**

### **Frontend**
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript** - Interactive functionality and API calls
- **Responsive Design** - Mobile-first approach

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MySQL** - Relational database management
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing library

### **Database**
- **8 Normalized Tables** - Users, Products, Orders, etc.
- **Foreign Key Relationships** - Data integrity
- **Indexing** - Performance optimization
- **Sample Data** - Ready-to-test content

## 📦 **Installation**

### **Prerequisites**
- **Node.js** (v14 or later) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or later) - [Download](https://dev.mysql.com/downloads/mysql/)

### **Step-by-Step Setup**

1. **Clone and Install**
   ```bash
   git clone https://github.com/Vivek152989/-maaanpurnaahar.me.git
   cd -maaanpurnaahar.me
   npm install
   ```

2. **Database Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env file with your MySQL credentials
   ```

3. **Initialize Database**
   ```bash
   node setup-database.js
   node create-test-users.js  # Optional: Create test users
   ```

4. **Start Application**
   ```bash
   npm start
   ```

5. **Access Application**
   - **Main Website**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin
   - **User Activity**: http://localhost:3000/user-activity.html
   - **Contact Messages**: http://localhost:3000/contact-messages.html

## 📚 **API Documentation**

### **Authentication**
```bash
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
```

### **Products & Cart**
```bash
GET  /api/products         # Get all products
POST /api/cart/add         # Add item to cart
GET  /api/cart             # View cart items
```

### **Orders & Admin**
```bash
POST /api/orders/create    # Create new order
GET  /api/admin/users      # Get all users (admin)
GET  /api/admin/stats      # Get statistics (admin)
```

### **Contact System**
```bash
POST /api/contact/submit        # Submit contact form
GET  /api/contact/messages      # Get messages (admin)
```

## 🗂️ **Project Structure**

```
maa-anpurna-aahar/
├── 📄 Frontend Pages
│   ├── index.html              # Homepage
│   ├── products.html           # Product catalog
│   ├── profile.html            # User dashboard
│   ├── cart.html              # Shopping cart
│   ├── contact.html           # Contact form
│   └── admin.html             # Admin panel
├── 🖥️ Backend
│   ├── server.js              # Express server (500+ lines)
│   ├── package.json           # Dependencies
│   └── .env.example           # Environment config
├── 🗄️ Database Tools
│   ├── setup-database.js      # Database initialization
│   └── create-test-users.js   # Sample data creation
├── 🛠️ Management Tools
│   ├── user-tracker.js        # User activity monitoring
│   ├── contact-viewer.js      # Contact message viewer
│   └── user-activity.html     # Web-based analytics
└── 📚 Documentation
    ├── SETUP-GUIDE.md         # Detailed setup guide
    ├── PROJECT-DESCRIPTION.md # Comprehensive description
    └── COMMIT-MESSAGES.md     # Git commit templates
```

## 🌐 **Deployment Options**

### **Cloud Platforms**
- **Heroku** - Simple deployment with MySQL add-on
- **Railway** - Modern deployment platform
- **DigitalOcean** - VPS hosting with full control
- **Vercel** - Frontend hosting with API routes

### **Quick Deploy Commands**
```bash
# Heroku
heroku create maa-anpurna-aahar
git push heroku main

# Railway  
railway init && railway up

# DigitalOcean App Platform
# Connect GitHub repository in dashboard
```

## 🧪 **Testing & Monitoring**

### **Available Tools**
```bash
# Monitor user activity
node user-tracker.js

# View contact messages  
node contact-viewer.js

# Web dashboards
http://localhost:3000/user-activity.html
http://localhost:3000/contact-messages.html
```

## 🔧 **Configuration**

### **Environment Variables (.env)**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=maa_anpurna_aahar

# Security
JWT_SECRET=your_super_secret_key
BCRYPT_ROUNDS=12

# Server
PORT=3000
NODE_ENV=development
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 **Support**

- 📖 **Documentation**: Check [SETUP-GUIDE.md](SETUP-GUIDE.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Vivek152989/-maaanpurnaahar.me/issues)
- 💬 **Discussion**: [GitHub Discussions](https://github.com/Vivek152989/-maaanpurnaahar.me/discussions)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 **What Makes This Special**

✅ **Complete Business Solution** - From basic webpage to full e-commerce platform  
✅ **Production Ready** - Database, security, authentication, admin panel  
✅ **Scalable Architecture** - Node.js backend, MySQL database, RESTful APIs  
✅ **Professional Features** - User management, order processing, analytics  
✅ **Real Business Impact** - Ready to handle actual customers and orders  

---

**Built with ❤️ for Maa Anpurna Aahar - Bringing handmade products to the digital world**

*Transform your business today! [Get Started](#-quick-start)*
