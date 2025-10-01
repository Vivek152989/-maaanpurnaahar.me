// server.js - Node.js Express Server with MySQL Database
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'maa_anpurna_aahar'
});

// Connect to Database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL Database');
  
  // Create tables if they don't exist
  createTables();
});

// Create necessary tables
function createTables() {
  // Users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      password_hash VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      email_verified BOOLEAN DEFAULT FALSE,
      registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL,
      profile_image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // User addresses table
  const createAddressesTable = `
    CREATE TABLE IF NOT EXISTS user_addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(50),
      address_type ENUM('home', 'office', 'other') DEFAULT 'home',
      street_address VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(100),
      postal_code VARCHAR(20),
      country VARCHAR(100) DEFAULT 'India',
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  // Orders table
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(50) UNIQUE NOT NULL,
      user_id VARCHAR(50),
      total_amount DECIMAL(10,2) NOT NULL,
      order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
      shipping_address JSON,
      order_items JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    )
  `;

  // User sessions table for better session management
  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(50),
      session_token VARCHAR(255) UNIQUE NOT NULL,
      refresh_token VARCHAR(255),
      expires_at TIMESTAMP,
      is_active BOOLEAN DEFAULT TRUE,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `;

  // Execute table creation
  db.query(createUsersTable, (err) => {
    if (err) console.error('Error creating users table:', err);
    else console.log('✅ Users table ready');
  });

  db.query(createAddressesTable, (err) => {
    if (err) console.error('Error creating addresses table:', err);
    else console.log('✅ Addresses table ready');
  });

  db.query(createOrdersTable, (err) => {
    if (err) console.error('Error creating orders table:', err);
    else console.log('✅ Orders table ready');
  });

  db.query(createSessionsTable, (err) => {
    if (err) console.error('Error creating sessions table:', err);
    else console.log('✅ Sessions table ready');
  });
}

// Utility function to generate unique IDs
function generateUserId() {
  return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function generateOrderId() {
  return 'ORD-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
}

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// =======================
// AUTHENTICATION ROUTES
// =======================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        error: 'First name, last name, email, and password are required' 
      });
    }

    // Check if user already exists
    const checkUserQuery = 'SELECT email FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const userId = generateUserId();

      // Insert new user
      const insertUserQuery = `
        INSERT INTO users (user_id, first_name, last_name, email, phone, password_hash)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(insertUserQuery, [userId, firstName, lastName, email, phone, passwordHash], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        res.status(201).json({
          message: 'User registered successfully',
          userId: userId,
          user: {
            id: userId,
            firstName,
            lastName,
            email,
            phone
          }
        });
      });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const findUserQuery = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
    db.query(findUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = results[0];

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const tokenPayload = {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      };

      const tokenExpiry = rememberMe ? '30d' : '24h';
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: tokenExpiry });

      // Update last login
      const updateLoginQuery = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?';
      db.query(updateLoginQuery, [user.user_id]);

      // Save session to database
      const sessionToken = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: tokenExpiry });
      const expiresAt = new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000));
      
      const insertSessionQuery = `
        INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.query(insertSessionQuery, [
        user.user_id, 
        sessionToken, 
        expiresAt, 
        req.ip, 
        req.get('User-Agent')
      ]);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone,
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
          rememberMe
        }
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout user
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const { userId } = req.user;

  // Deactivate user sessions
  const deactivateSessionsQuery = 'UPDATE user_sessions SET is_active = FALSE WHERE user_id = ?';
  db.query(deactivateSessionsQuery, [userId], (err) => {
    if (err) {
      console.error('Error deactivating sessions:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    res.json({ message: 'Logout successful' });
  });
});

// =======================
// USER MANAGEMENT ROUTES
// =======================

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const { userId } = req.user;

  const getUserQuery = `
    SELECT user_id, first_name, last_name, email, phone, is_active, 
           email_verified, registration_date, last_login, profile_image
    FROM users WHERE user_id = ?
  `;

  db.query(getUserQuery, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: results[0] });
  });
});

// Update user profile
app.put('/api/user/profile', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { firstName, lastName, phone } = req.body;

  const updateUserQuery = `
    UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;

  db.query(updateUserQuery, [firstName, lastName, phone, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    res.json({ message: 'Profile updated successfully' });
  });
});

// =======================
// ORDER MANAGEMENT ROUTES
// =======================

// Create new order
app.post('/api/orders', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { items, totalAmount, shippingAddress } = req.body;

  const orderId = generateOrderId();

  const createOrderQuery = `
    INSERT INTO orders (order_id, user_id, total_amount, shipping_address, order_items)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(createOrderQuery, [
    orderId, 
    userId, 
    totalAmount, 
    JSON.stringify(shippingAddress), 
    JSON.stringify(items)
  ], (err, result) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Failed to create order' });
    }

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      order: {
        id: orderId,
        userId,
        totalAmount,
        status: 'pending',
        items,
        shippingAddress
      }
    });
  });
});

// Get user orders
app.get('/api/orders', authenticateToken, (req, res) => {
  const { userId } = req.user;

  const getOrdersQuery = `
    SELECT order_id, total_amount, order_status, payment_status, 
           shipping_address, order_items, created_at, updated_at
    FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `;

  db.query(getOrdersQuery, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    // Parse JSON fields
    const orders = results.map(order => ({
      ...order,
      shipping_address: JSON.parse(order.shipping_address),
      order_items: JSON.parse(order.order_items)
    }));

    res.json({ orders });
  });
});

// =======================
// ADMIN ROUTES
// =======================

// Get all users (admin only - add admin authentication in production)
app.get('/api/admin/users', (req, res) => {
  const getAllUsersQuery = `
    SELECT user_id, first_name, last_name, email, phone, is_active, 
           email_verified, registration_date, last_login
    FROM users ORDER BY registration_date DESC
  `;

  db.query(getAllUsersQuery, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ users: results });
  });
});

// Get analytics data
app.get('/api/admin/analytics', (req, res) => {
  const analyticsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM users WHERE DATE(registration_date) = CURDATE()) as new_users_today,
      (SELECT COUNT(*) FROM orders) as total_orders,
      (SELECT AVG(total_amount) FROM orders) as avg_order_value,
      (SELECT COUNT(*) FROM user_sessions WHERE is_active = TRUE) as active_sessions
  `;

  db.query(analyticsQuery, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ analytics: results[0] });
  });
});

// =======================
// SERVE FRONTEND
// =======================

// ========================================================================================
// CONTACT MESSAGES API
// ========================================================================================

// Submit contact form
app.post('/api/contact/submit', (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;
  
  // Validate required fields
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please fill in all required fields' 
    });
  }
  
  // Generate unique message ID
  const messageId = 'MSG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  // Get client info
  const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  const query = `
    INSERT INTO contact_messages 
    (message_id, first_name, last_name, email, phone, subject, message, ip_address, user_agent) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [messageId, firstName, lastName, email, phone, subject, message, ipAddress, userAgent], (err, result) => {
    if (err) {
      console.error('Error saving contact message:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save message. Please try again.' 
      });
    }
    
    console.log(`📧 New contact message received from ${firstName} ${lastName} (${email})`);
    
    res.json({ 
      success: true, 
      messageId: messageId,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.' 
    });
  });
});

// Get all contact messages (admin)
app.get('/api/contact/messages', (req, res) => {
  const query = `
    SELECT 
      message_id,
      CONCAT(first_name, ' ', last_name) as full_name,
      first_name,
      last_name,
      email,
      phone,
      subject,
      message,
      is_read,
      ip_address,
      created_at
    FROM contact_messages 
    ORDER BY created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching contact messages:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    
    res.json(results);
  });
});

// Mark message as read
app.put('/api/contact/messages/:messageId/read', (req, res) => {
  const { messageId } = req.params;
  
  const query = `UPDATE contact_messages SET is_read = TRUE WHERE message_id = ?`;
  
  db.query(query, [messageId], (err, result) => {
    if (err) {
      console.error('Error marking message as read:', err);
      return res.status(500).json({ error: 'Failed to update message' });
    }
    
    res.json({ success: true, message: 'Message marked as read' });
  });
});

// Get contact message statistics
app.get('/api/contact/stats', (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_messages,
      COUNT(CASE WHEN is_read = 0 THEN 1 END) as unread_messages,
      COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_messages,
      COUNT(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as week_messages
    FROM contact_messages
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching contact stats:', err);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
    
    res.json(results[0]);
  });
});

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`🏠 Website: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Shutting down server...');
  db.end(() => {
    console.log('✅ Database connection closed');
    process.exit(0);
  });
});