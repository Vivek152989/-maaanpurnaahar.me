// view-users.js - Simple tool to view registered users
const mysql = require('mysql2');
require('dotenv').config();

console.log('👥 Viewing Registered Users - Maa Anpurna Aahar\n');

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to database\n');
  viewUsers();
});

function viewUsers() {
  // Get user statistics
  const statsQuery = `
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
      COUNT(CASE WHEN email_verified = 1 THEN 1 END) as verified_users,
      COUNT(CASE WHEN DATE(registration_date) = CURDATE() THEN 1 END) as today_registrations,
      COUNT(CASE WHEN DATE(registration_date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as week_registrations
    FROM users
  `;

  connection.query(statsQuery, (err, stats) => {
    if (err) {
      console.error('❌ Error fetching statistics:', err.message);
      return;
    }

    const stat = stats[0];
    console.log('📊 USER STATISTICS:');
    console.log('═'.repeat(50));
    console.log(`👥 Total Users: ${stat.total_users}`);
    console.log(`✅ Active Users: ${stat.active_users}`);
    console.log(`📧 Verified Users: ${stat.verified_users}`);
    console.log(`🆕 Today's Registrations: ${stat.today_registrations}`);
    console.log(`📅 This Week: ${stat.week_registrations}`);
    console.log('═'.repeat(50));
    console.log();

    // Get detailed user list
    getUserList();
  });
}

function getUserList() {
  const usersQuery = `
    SELECT 
      user_id,
      CONCAT(first_name, ' ', last_name) as full_name,
      email,
      phone,
      is_active,
      email_verified,
      DATE_FORMAT(registration_date, '%Y-%m-%d %H:%i') as registered,
      DATE_FORMAT(last_login, '%Y-%m-%d %H:%i') as last_login
    FROM users 
    ORDER BY registration_date DESC
  `;

  connection.query(usersQuery, (err, users) => {
    if (err) {
      console.error('❌ Error fetching users:', err.message);
      return;
    }

    if (users.length === 0) {
      console.log('📝 No users registered yet.');
      console.log('\n💡 Users will appear here after they register on your website.');
      console.log('🌐 Website: http://localhost:3000/register');
    } else {
      console.log('👥 REGISTERED USERS:');
      console.log('═'.repeat(120));
      console.log('USER ID'.padEnd(15) + 'NAME'.padEnd(25) + 'EMAIL'.padEnd(30) + 'PHONE'.padEnd(15) + 'STATUS'.padEnd(10) + 'REGISTERED'.padEnd(20));
      console.log('─'.repeat(120));

      users.forEach(user => {
        const status = user.is_active ? '✅ Active' : '❌ Inactive';
        const verified = user.email_verified ? '📧' : '⚠️';
        
        console.log(
          user.user_id.padEnd(15) +
          user.full_name.padEnd(25) +
          user.email.padEnd(30) +
          (user.phone || 'N/A').padEnd(15) +
          status.padEnd(10) +
          user.registered.padEnd(20)
        );
      });

      console.log('─'.repeat(120));
      console.log(`\n📋 Showing ${users.length} registered users`);
    }

    // Show recent orders if any
    showRecentActivity();
  });
}

function showRecentActivity() {
  const ordersQuery = `
    SELECT 
      o.order_id,
      CONCAT(u.first_name, ' ', u.last_name) as customer_name,
      o.total_amount,
      o.order_status,
      DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i') as order_date
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    ORDER BY o.created_at DESC
    LIMIT 5
  `;

  connection.query(ordersQuery, (err, orders) => {
    if (err) {
      console.error('❌ Error fetching orders:', err.message);
      connection.end();
      return;
    }

    if (orders.length > 0) {
      console.log('\n🛒 RECENT ORDERS:');
      console.log('═'.repeat(80));
      console.log('ORDER ID'.padEnd(15) + 'CUSTOMER'.padEnd(25) + 'AMOUNT'.padEnd(12) + 'STATUS'.padEnd(15) + 'DATE');
      console.log('─'.repeat(80));

      orders.forEach(order => {
        console.log(
          order.order_id.padEnd(15) +
          order.customer_name.padEnd(25) +
          `₹${order.total_amount}`.padEnd(12) +
          order.order_status.padEnd(15) +
          order.order_date
        );
      });
    }

    console.log('\n🔄 Database connection closed');
    connection.end();
  });
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});