# 🌟 Maa Anpurna Aahar - Setup Guide

Complete guide to set up your professional handmade products website with SQL database integration!

## 🎯 What You'll Build
- Professional e-commerce website for handmade products
- User authentication and profile management
- Shopping cart and order management
- Admin panel for managing users and orders
- SQL database for secure data storage
- Internet-ready deployment

## 📋 Prerequisites

### Required Software:
1. **Node.js** (v14 or later) - [Download](https://nodejs.org/)
2. **MySQL** (v8.0 or later) - [Download](https://dev.mysql.com/downloads/mysql/)
3. **Git** (optional) - [Download](https://git-scm.com/)

### Windows Installation:
```powershell
# Install Node.js (download from nodejs.org)
# Install MySQL (download from mysql.com)

# Verify installations
node --version
npm --version
mysql --version
```

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
```powershell
# Navigate to your project folder
cd "c:\Users\dduc\Documents\GitHub\-maaanpurnaahar.me"

# Install all required packages
npm install
```

### Step 2: Configure Database
```powershell
# Copy environment template
copy .env.example .env

# Edit .env file with your MySQL credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_mysql_password
# DB_NAME=maa_anpurna_aahar
# JWT_SECRET=your_secret_key_here
```

### Step 3: Setup Database
```powershell
# Run database setup script
node setup-database.js
```

### Step 4: Start the Server
```powershell
# Start your website
npm start
```

### Step 5: Access Your Website
- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Documentation**: http://localhost:3000/api

## 🔧 Configuration Details

### Environment Variables (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=maa_anpurna_aahar
DB_PORT=3306

# Security
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# Server Configuration
PORT=3000
NODE_ENV=development

# Email (Optional - for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Payment Gateway (Optional)
PAYMENT_GATEWAY_KEY=your_payment_key
PAYMENT_GATEWAY_SECRET=your_payment_secret

# File Upload (Optional)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 🗄️ Database Schema

### Users Table
- User ID, Name, Email, Phone
- Password (encrypted with bcrypt)
- Profile information
- Registration and login tracking

### Products Table
- Product details and inventory
- Categories and pricing
- Stock management

### Orders Table
- Order tracking and status
- Payment information
- Shipping details

### Shopping Cart
- User cart persistence
- Product quantities

## 🔐 Security Features

### Authentication
- JWT tokens for secure sessions
- Password hashing with bcrypt
- Session management and expiration

### Data Protection
- SQL injection prevention
- XSS protection
- CORS security
- Input validation and sanitization

## 📱 Features Overview

### Frontend Pages
- **Homepage** (`index.html`) - Welcome and featured products
- **Products** (`products.html`) - Full product catalog
- **Profile** (`profile.html`) - User dashboard and settings
- **Cart** (`cart.html`) - Shopping cart and checkout
- **Contact** (`contact.html`) - Contact form and info
- **Login/Register** - Authentication pages
- **Admin Panel** - Management interface

### API Endpoints
```
Authentication:
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - Logout user
GET /api/auth/profile - Get user profile

Products:
GET /api/products - Get all products
GET /api/products/:id - Get specific product
POST /api/products - Add new product (admin)

Cart:
GET /api/cart - Get user cart
POST /api/cart/add - Add to cart
PUT /api/cart/update - Update quantities
DELETE /api/cart/remove - Remove from cart

Orders:
GET /api/orders - Get user orders
POST /api/orders/create - Create new order
GET /api/orders/:id - Get order details

Admin:
GET /api/admin/users - Manage users
GET /api/admin/orders - Manage orders
GET /api/admin/analytics - View analytics
```

## 🌐 Internet Deployment

### Option 1: Heroku (Free Tier)
```powershell
# Install Heroku CLI
# Create Heroku app
heroku create maa-anpurna-aahar

# Add MySQL addon
heroku addons:create cleardb:ignite

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 2: Railway
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: DigitalOcean App Platform
1. Connect your GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy automatically

## 🛠️ Customization Guide

### Adding New Products
1. Use admin panel: http://localhost:3000/admin
2. Or add directly to database via API
3. Update product images in uploads folder

### Modifying Design
- Edit CSS in each HTML file
- Update colors, fonts, and layouts
- Add new sections as needed

### Adding Features
- Payment gateway integration
- Email notifications
- SMS alerts
- Inventory management
- Analytics dashboard

## 📞 Support & Troubleshooting

### Common Issues

**Database Connection Failed:**
```powershell
# Check MySQL is running
net start mysql

# Verify credentials in .env file
# Check firewall settings
```

**Port Already in Use:**
```powershell
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

**Module Not Found:**
```powershell
# Reinstall dependencies
rm -r node_modules
rm package-lock.json
npm install
```

### Performance Optimization
- Enable database indexing
- Implement caching (Redis)
- Optimize images
- Use CDN for static files

## 🎨 Business Features

### Ready for E-commerce
- Product catalog management
- Shopping cart functionality
- Order processing
- User accounts and profiles
- Admin dashboard

### Marketing Features
- Coupon system
- Discount management
- Customer analytics
- Order history

### Security & Compliance
- Secure password storage
- Session management
- Data validation
- SQL injection protection

## 🚀 Production Checklist

- [ ] Database credentials secured
- [ ] JWT secret key generated
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Monitoring setup
- [ ] Error logging implemented
- [ ] Performance testing completed
- [ ] Security audit passed

## 📈 Future Enhancements

### Next Features to Add
- Payment gateway (Razorpay/PayPal)
- Email notifications
- SMS alerts
- Mobile app
- Advanced analytics
- Multi-vendor support
- Inventory alerts
- Customer reviews

### Scaling Options
- Load balancer setup
- Database clustering
- CDN integration
- Caching layers
- Microservices architecture

---

## 🎉 Congratulations!

You now have a complete, professional e-commerce website with:
- ✅ SQL database integration for internet connectivity
- ✅ Secure user authentication
- ✅ Professional product management
- ✅ Shopping cart and orders
- ✅ Admin panel for management
- ✅ Ready for production deployment

Your handmade products business is now ready to go online! 🌟

## 📞 Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Review the setup steps above

Happy selling! 🛒✨