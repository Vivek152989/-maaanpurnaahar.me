// create-test-user.js - Create test users for demonstration
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

console.log('👥 Creating Test Users for Demonstration...\n');

async function createTestUsers() {
  try {
    // Test users data
    const testUsers = [
      {
        firstName: 'Rohit',
        lastName: 'Sharma',
        email: 'rohit@example.com',
        phone: '+91 98765 43210',
        password: 'password123'
      },
      {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya@example.com',
        phone: '+91 87654 32109',
        password: 'mypassword456'
      },
      {
        firstName: 'Amit',
        lastName: 'Kumar',
        email: 'amit@example.com',
        phone: '+91 76543 21098',
        password: 'secure789'
      }
    ];

    console.log('🔐 Creating test users with encrypted passwords...\n');

    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i];
      
      // Generate unique user ID
      const userId = 'USER_' + Date.now() + '_' + (i + 1);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 12);
      
      // Insert user into database
      const query = `
        INSERT INTO users (user_id, first_name, last_name, email, phone, password_hash, is_active, registration_date)
        VALUES (?, ?, ?, ?, ?, ?, TRUE, NOW())
      `;
      
      db.query(query, [userId, user.firstName, user.lastName, user.email, user.phone, hashedPassword], (err, result) => {
        if (err) {
          console.error(`❌ Error creating user ${user.firstName}:`, err.message);
        } else {
          console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
          console.log(`   🆔 User ID: ${userId}`);
          console.log(`   📞 Phone: ${user.phone}`);
          console.log(`   🔐 Password: ${user.password} (for testing)`);
          console.log('');
        }
        
        // If this is the last user, show summary and close connection
        if (i === testUsers.length - 1) {
          setTimeout(showSummary, 1000);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
    db.end();
  }
}

function showSummary() {
  console.log('📊 Fetching user summary...\n');
  
  const summaryQuery = `
    SELECT 
      user_id,
      CONCAT(first_name, ' ', last_name) as full_name,
      email,
      phone,
      DATE_FORMAT(registration_date, '%Y-%m-%d %H:%i:%s') as registered_at,
      is_active
    FROM users 
    ORDER BY registration_date DESC
  `;
  
  db.query(summaryQuery, (err, results) => {
    if (err) {
      console.error('❌ Error fetching summary:', err.message);
    } else {
      console.log('🎉 Test Users Created Successfully!\n');
      console.log('═'.repeat(80));
      console.log('👥 REGISTERED USERS:');
      console.log('─'.repeat(80));
      
      results.forEach((user, index) => {
        console.log(`${index + 1}. 👤 ${user.full_name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   📞 Phone: ${user.phone}`);
        console.log(`   🆔 User ID: ${user.user_id}`);
        console.log(`   📅 Registered: ${user.registered_at}`);
        console.log(`   ⭐ Status: ${user.is_active ? '✅ Active' : '❌ Inactive'}`);
        console.log('   ' + '─'.repeat(40));
      });
      
      console.log('\n💡 Now you can:');
      console.log('   1. Run: node user-tracker.js (to see users)');
      console.log('   2. Visit: http://localhost:3000/user-activity.html');
      console.log('   3. Check MySQL Workbench: SELECT * FROM users;');
      console.log('   4. Login with any test user on your website');
    }
    
    db.end(() => {
      console.log('\n✅ Database connection closed');
    });
  });
}

// Connect and create users
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure MySQL server is running');
    console.log('   2. Check .env file database credentials');
    console.log('   3. Run: node setup-database.js');
    process.exit(1);
  }

  console.log('✅ Connected to database');
  createTestUsers();
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});