// setup-database.js - Database setup script
const mysql = require('mysql2');
require('dotenv').config();

console.log('🔧 Setting up Maa Anpurna Aahar Database...\n');

// Database connection without database name (to create it)
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306
});

// Database name
const DB_NAME = process.env.DB_NAME || 'maa_anpurna_aahar';

// Connect and create database
connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('\n🔍 Please check:');
    console.log('   - MySQL server is running');
    console.log('   - Database credentials in .env file');
    console.log('   - Network connectivity');
    process.exit(1);
  }

  console.log('✅ Connected to MySQL server');

  // Create database if it doesn't exist
  const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
  
  connection.query(createDbQuery, (err, result) => {
    if (err) {
      console.error('❌ Error creating database:', err.message);
      connection.end();
      process.exit(1);
    }

    console.log(`✅ Database '${DB_NAME}' created/verified`);
    
    // Switch to the database
    connection.changeUser({database: DB_NAME}, (err) => {
      if (err) {
        console.error('❌ Error switching to database:', err.message);
        connection.end();
        process.exit(1);
      }

      console.log(`✅ Switched to database '${DB_NAME}'`);
      
      // Create tables
      createTables();
    });
  });
});

function createTables() {
  console.log('\n📋 Creating tables...');

  const tables = [
    {
      name: 'users',
      query: `
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
          date_of_birth DATE,
          gender ENUM('male', 'female', 'other'),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_user_id (user_id),
          INDEX idx_registration_date (registration_date)
        ) ENGINE=InnoDB
      `
    },
    {
      name: 'user_addresses',
      query: `
        CREATE TABLE IF NOT EXISTS user_addresses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(50),
          address_type ENUM('home', 'office', 'other') DEFAULT 'home',
          full_name VARCHAR(200),
          street_address VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL,
          postal_code VARCHAR(20) NOT NULL,
          country VARCHAR(100) DEFAULT 'India',
          landmark VARCHAR(255),
          phone VARCHAR(20),
          is_default BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id)
        ) ENGINE=InnoDB
      `
    },
    {
      name: 'products',
      query: `
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          price DECIMAL(10,2) NOT NULL,
          discount_price DECIMAL(10,2),
          unit VARCHAR(50) DEFAULT 'piece',
          stock_quantity INT DEFAULT 0,
          image_url VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_category (category),
          INDEX idx_active (is_active)
        ) ENGINE=InnoDB
      `
    },
    {
      name: 'orders',
      query: `
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(50) UNIQUE NOT NULL,
          user_id VARCHAR(50),
          total_amount DECIMAL(10,2) NOT NULL,
          discount_amount DECIMAL(10,2) DEFAULT 0,
          shipping_amount DECIMAL(10,2) DEFAULT 0,
          tax_amount DECIMAL(10,2) DEFAULT 0,
          final_amount DECIMAL(10,2) NOT NULL,
          order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned') DEFAULT 'pending',
          payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partial') DEFAULT 'pending',
          payment_method VARCHAR(100),
          coupon_code VARCHAR(50),
          shipping_address JSON,
          order_notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
          INDEX idx_user_id (user_id),
          INDEX idx_status (order_status),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB
      `
    },
    {
      name: 'order_items',
      query: `
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(50),
          product_id VARCHAR(50),
          product_name VARCHAR(255),
          product_price DECIMAL(10,2),
          quantity INT NOT NULL,
          subtotal DECIMAL(10,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
          INDEX idx_order_id (order_id)
        ) ENGINE=InnoDB
      `
    },
    {
      name: 'user_sessions',
      query: `
        CREATE TABLE IF NOT EXISTS user_sessions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(50),
          session_token VARCHAR(255) UNIQUE NOT NULL,
          refresh_token VARCHAR(255),
          expires_at TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE,
          ip_address VARCHAR(45),
          user_agent TEXT,
          device_info VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_session_token (session_token),
          INDEX idx_expires_at (expires_at)
        ) ENGINE=InnoDB
      `
    },
    {
      name: 'shopping_cart',
      query: `
        CREATE TABLE IF NOT EXISTS shopping_cart (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(50),
          product_id VARCHAR(50),
          quantity INT NOT NULL,
          added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_user_product (user_id, product_id),
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id)
        ) ENGINE=InnoDB
      `
    },
    {
      name: 'coupons',
      query: `
        CREATE TABLE IF NOT EXISTS coupons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(50) UNIQUE NOT NULL,
          description VARCHAR(255),
          discount_type ENUM('percentage', 'fixed') NOT NULL,
          discount_value DECIMAL(10,2) NOT NULL,
          min_order_amount DECIMAL(10,2) DEFAULT 0,
          max_discount_amount DECIMAL(10,2),
          usage_limit INT,
          used_count INT DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          valid_until TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_code (code),
          INDEX idx_active (is_active)
        ) ENGINE=InnoDB
      `
    }
  ];

  let completedTables = 0;
  
  tables.forEach((table) => {
    connection.query(table.query, (err, result) => {
      if (err) {
        console.error(`❌ Error creating table '${table.name}':`, err.message);
      } else {
        console.log(`✅ Table '${table.name}' created/verified`);
      }
      
      completedTables++;
      
      if (completedTables === tables.length) {
        insertSampleData();
      }
    });
  });
}

function insertSampleData() {
  console.log('\n🌱 Inserting sample data...');

  // Sample products
  const sampleProducts = [
    ['wheat-atta', 'Handmade Wheat Atta', 'Stone-ground wheat flour, preservative-free and nutritious', 'grains', 80.00, null, 'kg', 100, '🌾'],
    ['pure-honey', 'Pure Honey', 'Fresh, organic honey directly from our beehives', 'honey', 450.00, 420.00, 'kg', 50, '🍯'],
    ['mixed-pickle', 'Mixed Vegetable Pickle', 'Traditional homemade pickle with authentic taste', 'pickles', 120.00, null, 'jar', 75, '🥒'],
    ['garam-masala', 'Garam Masala', 'Freshly ground traditional garam masala blend', 'spices', 200.00, null, '250g', 60, '🌶️'],
    ['coconut-oil', 'Pure Coconut Oil', 'Cold-pressed coconut oil for cooking and health', 'oils', 320.00, 300.00, '500ml', 40, '🥥'],
    ['desi-ghee', 'Desi Ghee', 'Pure cow ghee made with traditional methods', 'oils', 800.00, 750.00, '500g', 30, '🧈']
  ];

  const insertProductsQuery = `
    INSERT IGNORE INTO products (product_id, name, description, category, price, discount_price, unit, stock_quantity, image_url)
    VALUES ?
  `;

  connection.query(insertProductsQuery, [sampleProducts], (err, result) => {
    if (err) {
      console.error('❌ Error inserting sample products:', err.message);
    } else {
      console.log(`✅ Sample products inserted (${result.affectedRows} items)`);
    }

    // Sample coupons
    const sampleCoupons = [
      ['WELCOME10', 'Welcome discount for new users', 'fixed', 50.00, 200.00, null, 100, 0],
      ['SAVE20', 'Save on bulk orders', 'fixed', 100.00, 500.00, 100.00, 50, 0],
      ['FIRST100', 'First order special', 'fixed', 100.00, 300.00, 100.00, 200, 0],
      ['FESTIVE25', 'Festival special offer', 'percentage', 25.00, 1000.00, 500.00, null, 0]
    ];

    const insertCouponsQuery = `
      INSERT IGNORE INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, used_count)
      VALUES ?
    `;

    connection.query(insertCouponsQuery, [sampleCoupons], (err, result) => {
      if (err) {
        console.error('❌ Error inserting sample coupons:', err.message);
      } else {
        console.log(`✅ Sample coupons inserted (${result.affectedRows} items)`);
      }

      finishSetup();
    });
  });
}

function finishSetup() {
  console.log('\n🎉 Database setup completed successfully!');
  console.log('\n📋 Summary:');
  console.log('   ✅ Database created/verified');
  console.log('   ✅ All tables created');
  console.log('   ✅ Sample data inserted');
  console.log('\n🚀 Next steps:');
  console.log('   1. Copy .env.example to .env and update credentials');
  console.log('   2. Run: npm start');
  console.log('   3. Open: http://localhost:3000');
  console.log('\n💡 Default admin access:');
  console.log('   Admin panel: http://localhost:3000/admin');
  console.log('\n🔐 Test credentials will be created when you register users');
  
  connection.end(() => {
    console.log('\n✅ Database connection closed');
    process.exit(0);
  });
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});