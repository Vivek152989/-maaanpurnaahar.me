// contact-messages-setup.js - Setup contact messages table
const mysql = require('mysql2');
require('dotenv').config();

console.log('📧 Setting up Contact Messages Database...\n');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'maa_anpurna_aahar',
  port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('🔍 Please ensure:');
    console.log('   - MySQL server is running');
    console.log('   - Database credentials are correct in .env file');
    process.exit(1);
  }

  console.log('✅ Connected to MySQL database');

  // Create contact_messages table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message_id VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_created_at (created_at),
      INDEX idx_is_read (is_read)
    ) ENGINE=InnoDB
  `;

  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('❌ Error creating contact_messages table:', err.message);
      connection.end();
      process.exit(1);
    }

    console.log('✅ Contact messages table created successfully');

    // Insert sample contact message for testing
    const sampleMessage = [
      ['MSG_' + Date.now(), 'Rohit', 'Vivek', 'demo@maaanpurnaahar.me', '+91 98765 43210', 'Product Inquiry', 'I am interested in your handmade products. Can you please provide more details about bulk orders?', false, '127.0.0.1', 'Sample Browser']
    ];

    const insertSampleQuery = `
      INSERT INTO contact_messages (message_id, first_name, last_name, email, phone, subject, message, is_read, ip_address, user_agent)
      VALUES ?
    `;

    connection.query(insertSampleQuery, [sampleMessage], (err, result) => {
      if (err) {
        console.error('❌ Error inserting sample message:', err.message);
      } else {
        console.log('✅ Sample contact message inserted for testing');
      }

      console.log('\n🎉 Contact messages setup completed successfully!');
      console.log('\n📋 Summary:');
      console.log('   ✅ contact_messages table created');
      console.log('   ✅ Sample message added for testing');
      console.log('\n🚀 Next steps:');
      console.log('   1. Update your contact form to save to database');
      console.log('   2. Run the message viewer: node contact-viewer.js');
      console.log('   3. Or view in MySQL Workbench');

      connection.end(() => {
        console.log('✅ Database connection closed');
        process.exit(0);
      });
    });
  });
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});