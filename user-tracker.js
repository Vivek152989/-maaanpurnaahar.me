// user-tracker.js - Track user registrations and logins
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

console.log('👥 Maa Anpurna Aahar - User Activity Tracker\n');
console.log('═'.repeat(80));

function displayUserStats() {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
      COUNT(CASE WHEN DATE(registration_date) = CURDATE() THEN 1 END) as today_registrations,
      COUNT(CASE WHEN DATE(registration_date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as week_registrations,
      COUNT(CASE WHEN last_login IS NOT NULL THEN 1 END) as users_who_logged_in,
      COUNT(CASE WHEN DATE(last_login) = CURDATE() THEN 1 END) as today_logins
    FROM users
  `;

  db.query(statsQuery, (err, results) => {
    if (err) {
      console.error('❌ Error fetching stats:', err.message);
      return;
    }

    const stats = results[0];
    console.log('📊 USER STATISTICS:');
    console.log('─'.repeat(50));
    console.log(`👥 कुल Users: ${stats.total_users}`);
    console.log(`✅ Active Users: ${stats.active_users}`);
    console.log(`📅 आज Registration: ${stats.today_registrations}`);
    console.log(`📆 इस हफ्ते Registration: ${stats.week_registrations}`);
    console.log(`🔐 कभी Login किए: ${stats.users_who_logged_in}`);
    console.log(`🕒 आज Login किए: ${stats.today_logins}`);
    console.log('═'.repeat(50));
  });
}

function displayRecentRegistrations() {
  const recentQuery = `
    SELECT 
      user_id,
      CONCAT(first_name, ' ', last_name) as full_name,
      email,
      phone,
      DATE_FORMAT(registration_date, '%Y-%m-%d %H:%i:%s') as registered_at,
      CASE WHEN is_active = 1 THEN 'Active' ELSE 'Inactive' END as status
    FROM users 
    ORDER BY registration_date DESC 
    LIMIT 10
  `;

  db.query(recentQuery, (err, results) => {
    if (err) {
      console.error('❌ Error fetching recent registrations:', err.message);
      return;
    }

    console.log('\n🆕 RECENT REGISTRATIONS (Last 10):');
    console.log('─'.repeat(80));
    
    if (results.length === 0) {
      console.log('📭 कोई user अभी तक register नहीं हुआ है');
      return;
    }

    results.forEach((user, index) => {
      console.log(`\n${index + 1}. 👤 ${user.full_name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📞 Phone: ${user.phone || 'Not provided'}`);
      console.log(`   🆔 User ID: ${user.user_id}`);
      console.log(`   📅 Registered: ${user.registered_at}`);
      console.log(`   ⭐ Status: ${user.status}`);
      console.log('   ' + '─'.repeat(40));
    });
  });
}

function displayRecentLogins() {
  const loginQuery = `
    SELECT 
      user_id,
      CONCAT(first_name, ' ', last_name) as full_name,
      email,
      DATE_FORMAT(last_login, '%Y-%m-%d %H:%i:%s') as last_login_formatted,
      TIMESTAMPDIFF(MINUTE, last_login, NOW()) as minutes_ago
    FROM users 
    WHERE last_login IS NOT NULL
    ORDER BY last_login DESC 
    LIMIT 10
  `;

  db.query(loginQuery, (err, results) => {
    if (err) {
      console.error('❌ Error fetching recent logins:', err.message);
      return;
    }

    console.log('\n🔐 RECENT LOGINS (Last 10):');
    console.log('─'.repeat(80));
    
    if (results.length === 0) {
      console.log('📭 कोई user अभी तक login नहीं हुआ है');
      return;
    }

    results.forEach((user, index) => {
      let timeAgo;
      if (user.minutes_ago < 60) {
        timeAgo = `${user.minutes_ago} minutes ago`;
      } else if (user.minutes_ago < 1440) {
        timeAgo = `${Math.floor(user.minutes_ago / 60)} hours ago`;
      } else {
        timeAgo = `${Math.floor(user.minutes_ago / 1440)} days ago`;
      }

      console.log(`\n${index + 1}. 🔐 ${user.full_name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 User ID: ${user.user_id}`);
      console.log(`   ⏰ Last Login: ${user.last_login_formatted} (${timeAgo})`);
      console.log('   ' + '─'.repeat(40));
    });
  });
}

function displayTodayActivity() {
  const todayQuery = `
    SELECT 
      'Registration' as activity_type,
      CONCAT(first_name, ' ', last_name) as user_name,
      email,
      DATE_FORMAT(registration_date, '%H:%i:%s') as time
    FROM users 
    WHERE DATE(registration_date) = CURDATE()
    
    UNION ALL
    
    SELECT 
      'Login' as activity_type,
      CONCAT(first_name, ' ', last_name) as user_name,
      email,
      DATE_FORMAT(last_login, '%H:%i:%s') as time
    FROM users 
    WHERE DATE(last_login) = CURDATE()
    
    ORDER BY time DESC
  `;

  db.query(todayQuery, (err, results) => {
    if (err) {
      console.error('❌ Error fetching today activity:', err.message);
      return;
    }

    console.log('\n📅 TODAY\'S ACTIVITY:');
    console.log('─'.repeat(60));
    
    if (results.length === 0) {
      console.log('📭 आज कोई activity नहीं है');
      return;
    }

    results.forEach((activity, index) => {
      const icon = activity.activity_type === 'Registration' ? '🆕' : '🔐';
      console.log(`${icon} ${activity.time} - ${activity.activity_type}: ${activity.user_name} (${activity.email})`);
    });
  });
}

// Connect and display all information
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure MySQL server is running');
    console.log('   2. Check .env file database credentials');
    console.log('   3. Run: node setup-database.js');
    process.exit(1);
  }

  console.log('✅ Connected to database\n');
  
  // Display all information
  displayUserStats();
  
  setTimeout(() => {
    displayRecentRegistrations();
    
    setTimeout(() => {
      displayRecentLogins();
      
      setTimeout(() => {
        displayTodayActivity();
        
        // Close connection
        setTimeout(() => {
          console.log('\n' + '═'.repeat(80));
          console.log('🔄 Run this again: node user-tracker.js');
          console.log('🌐 Web dashboard: http://localhost:3000/contact-messages.html');
          console.log('🗄️ MySQL Workbench: Run SELECT queries above');
          
          db.end();
          process.exit(0);
        }, 100);
      }, 100);
    }, 100);
  }, 100);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});