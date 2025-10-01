// test-users.js - Create sample users for testing
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

console.log('🧪 Creating Test Users for Maa Anpurna Aahar...\n');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Test users data
const testUsers = [
  {
    firstName: 'Rohit',
    lastName: 'Kumar',
    email: 'rohit.kumar@gmail.com',
    phone: '+91 9876543210',
    password: '123456'
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@yahoo.com',
    phone: '+91 8765432109',
    password: 'password123'
  },
  {
    firstName: 'Vivek',
    lastName: 'Singh',
    email: 'vivek.singh@hotmail.com',
    phone: '+91 7654321098',
    password: 'vivek2024'
  },
  {
    firstName: 'Anjali',
    lastName: 'Gupta',
    email: 'anjali.gupta@gmail.com',
    phone: '+91 6543210987',
    password: 'anjali123'
  },
  {
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@rediffmail.com',
    phone: '+91 5432109876',
    password: 'amit2025'
  }
];

async function createTestUsers() {
  console.log('📝 Creating test users...\n');
  
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(user.password, 12);
      
      // Generate unique user ID
      const userId = 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      // Simulate different registration times (last 7 days)
      const registrationDate = new Date();
      registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 7));
      
      // Simulate last login (some users logged in recently, some never)
      let lastLogin = null;
      if (Math.random() > 0.3) { // 70% chance of having logged in
        lastLogin = new Date();
        lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 3));
        lastLogin.setHours(Math.floor(Math.random() * 24));
      }
      
      const insertQuery = `
        INSERT INTO users 
        (user_id, first_name, last_name, email, phone, password_hash, registration_date, last_login) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [userId, user.firstName, user.lastName, user.email, user.phone, passwordHash, registrationDate, lastLogin];
      
      await new Promise((resolve, reject) => {
        db.query(insertQuery, values, (err, result) => {
          if (err) {
            console.error(`❌ Error creating user ${user.firstName}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Created: ${user.firstName} ${user.lastName} (${user.email})`);
            console.log(`   🆔 User ID: ${userId}`);
            console.log(`   📅 Registered: ${registrationDate.toLocaleString()}`);
            console.log(`   🔐 Last Login: ${lastLogin ? lastLogin.toLocaleString() : 'Never'}`);
            console.log(`   📱 Password: ${user.password} (for testing)\n`);
            resolve(result);
          }
        });
      });
      
      // Add small delay between users
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to create user ${user.firstName}:`, error.message);
    }
  }
}

// Connect and create users
db.connect(async (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to database\n');
  
  try {
    await createTestUsers();
    
    // Show summary
    console.log('🎉 Test users created successfully!\n');
    
    // Get count
    db.query('SELECT COUNT(*) as total FROM users', (err, result) => {
      if (!err) {
        console.log(`📊 Total users in database: ${result[0].total}`);
      }
      
      console.log('\n🚀 Now you can test:');
      console.log('   1. Run: node user-tracker.js');
      console.log('   2. Visit: http://localhost:3000/user-activity.html');
      console.log('   3. MySQL Workbench: SELECT * FROM users;');
      console.log('\n🔐 Test Login Credentials:');
      testUsers.forEach(user => {
        console.log(`   📧 ${user.email} / 🔑 ${user.password}`);
      });
      
      db.end();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    db.end();
    process.exit(1);
  }
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});