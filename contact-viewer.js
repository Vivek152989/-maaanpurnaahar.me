// contact-viewer.js - View and manage contact messages
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

console.log('📧 Maa Anpurna Aahar - Contact Messages Viewer\n');

function displayMessages() {
  const query = `
    SELECT 
      message_id,
      CONCAT(first_name, ' ', last_name) as full_name,
      email,
      phone,
      subject,
      message,
      is_read,
      created_at
    FROM contact_messages 
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching messages:', err.message);
      return;
    }

    if (results.length === 0) {
      console.log('📭 No contact messages found');
      console.log('💡 Messages will appear here when visitors use the contact form');
      return;
    }

    console.log(`📨 Found ${results.length} contact message(s):\n`);
    console.log('═'.repeat(100));

    results.forEach((msg, index) => {
      const status = msg.is_read ? '✅ READ' : '🆕 NEW';
      const date = new Date(msg.created_at).toLocaleString();
      
      console.log(`\n📧 Message #${index + 1} [${status}]`);
      console.log('─'.repeat(50));
      console.log(`👤 Name: ${msg.full_name}`);
      console.log(`📧 Email: ${msg.email}`);
      console.log(`📞 Phone: ${msg.phone || 'Not provided'}`);
      console.log(`📝 Subject: ${msg.subject || 'No subject'}`);
      console.log(`📅 Received: ${date}`);
      console.log(`💬 Message: ${msg.message}`);
      console.log('─'.repeat(50));
    });

    console.log('\n📊 Summary:');
    const unreadCount = results.filter(msg => !msg.is_read).length;
    console.log(`   📧 Total Messages: ${results.length}`);
    console.log(`   🆕 New Messages: ${unreadCount}`);
    console.log(`   ✅ Read Messages: ${results.length - unreadCount}`);
  });
}

function getStats() {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_messages,
      COUNT(CASE WHEN is_read = 0 THEN 1 END) as unread_messages,
      COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_messages,
      COUNT(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as week_messages
    FROM contact_messages
  `;

  db.query(statsQuery, (err, results) => {
    if (err) {
      console.error('❌ Error fetching stats:', err.message);
      return;
    }

    const stats = results[0];
    console.log('\n📈 Contact Messages Statistics:');
    console.log('═'.repeat(40));
    console.log(`📧 Total Messages: ${stats.total_messages}`);
    console.log(`🆕 Unread Messages: ${stats.unread_messages}`);
    console.log(`📅 Today's Messages: ${stats.today_messages}`);
    console.log(`📆 This Week: ${stats.week_messages}`);
    console.log('═'.repeat(40));
  });
}

// Connect and display
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure MySQL server is running');
    console.log('   2. Check .env file database credentials');
    console.log('   3. Run: node contact-messages-setup.js');
    process.exit(1);
  }

  console.log('✅ Connected to database\n');
  
  // Display stats first
  getStats();
  
  // Then display all messages
  setTimeout(() => {
    displayMessages();
    
    // Close connection
    setTimeout(() => {
      db.end();
      console.log('\n✅ Connection closed');
      
      console.log('\n🔄 Auto-refresh options:');
      console.log('   - Run this script again: node contact-viewer.js');
      console.log('   - View in MySQL Workbench');
      console.log('   - Use web dashboard (coming next)');
    }, 100);
  }, 100);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});