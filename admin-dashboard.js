// admin-dashboard.js - Enhanced admin tools
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3001; // Different port to avoid conflicts

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

app.use(express.static('.'));

// Admin dashboard route
app.get('/admin-dashboard', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maa Anpurna Aahar - Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .dashboard {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #ff6b6b, #ffa500);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .users-table {
            padding: 30px;
        }
        
        .table-container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
        }
        
        .status-active {
            background: #d4edda;
            color: #155724;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8em;
        }
        
        .status-inactive {
            background: #f8d7da;
            color: #721c24;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8em;
        }
        
        .refresh-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            margin: 20px;
            transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .loading {
            text-align: center;
            padding: 50px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🏪 Maa Anpurna Aahar Admin Dashboard</h1>
            <p>Manage your handmade products business</p>
        </div>
        
        <div class="stats" id="stats">
            <div class="loading">Loading statistics...</div>
        </div>
        
        <div class="users-table">
            <h2 style="margin-bottom: 20px;">👥 Registered Users</h2>
            <button class="refresh-btn" onclick="loadData()">🔄 Refresh Data</button>
            
            <div class="table-container">
                <table id="usersTable">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Registered</th>
                            <th>Last Login</th>
                        </tr>
                    </thead>
                    <tbody id="usersBody">
                        <tr><td colspan="7" class="loading">Loading users...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        // Load data on page load
        loadData();
        
        // Auto refresh every 30 seconds
        setInterval(loadData, 30000);
        
        async function loadData() {
            try {
                // Load statistics
                const statsResponse = await fetch('/api/admin/stats');
                const stats = await statsResponse.json();
                
                document.getElementById('stats').innerHTML = \`
                    <div class="stat-card">
                        <div class="stat-number">\${stats.totalUsers}</div>
                        <div class="stat-label">Total Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">\${stats.activeUsers}</div>
                        <div class="stat-label">Active Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">\${stats.todayRegistrations}</div>
                        <div class="stat-label">Today's Signups</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">\${stats.weekRegistrations}</div>
                        <div class="stat-label">This Week</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">\${stats.totalOrders}</div>
                        <div class="stat-label">Total Orders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">₹\${stats.totalRevenue}</div>
                        <div class="stat-label">Total Revenue</div>
                    </div>
                \`;
                
                // Load users
                const usersResponse = await fetch('/api/admin/users');
                const users = await usersResponse.json();
                
                const usersBody = document.getElementById('usersBody');
                if (users.length === 0) {
                    usersBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No users registered yet</td></tr>';
                } else {
                    usersBody.innerHTML = users.map(user => \`
                        <tr>
                            <td>\${user.user_id}</td>
                            <td>\${user.full_name}</td>
                            <td>\${user.email}</td>
                            <td>\${user.phone || 'N/A'}</td>
                            <td><span class="status-\${user.is_active ? 'active' : 'inactive'}">\${user.is_active ? '✅ Active' : '❌ Inactive'}</span></td>
                            <td>\${formatDate(user.registration_date)}</td>
                            <td>\${user.last_login ? formatDate(user.last_login) : 'Never'}</td>
                        </tr>
                    \`).join('');
                }
                
            } catch (error) {
                console.error('Error loading data:', error);
                document.getElementById('stats').innerHTML = '<div class="loading">Error loading data</div>';
                document.getElementById('usersBody').innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Error loading users</td></tr>';
            }
        }
        
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
    </script>
</body>
</html>
  `);
});

// API Routes
app.get('/api/admin/stats', (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as totalUsers,
      COUNT(CASE WHEN is_active = 1 THEN 1 END) as activeUsers,
      COUNT(CASE WHEN DATE(registration_date) = CURDATE() THEN 1 END) as todayRegistrations,
      COUNT(CASE WHEN DATE(registration_date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as weekRegistrations
    FROM users
  `;

  db.query(statsQuery, (err, userStats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const orderStatsQuery = `
      SELECT 
        COUNT(*) as totalOrders,
        COALESCE(SUM(final_amount), 0) as totalRevenue
      FROM orders
    `;

    db.query(orderStatsQuery, (err, orderStats) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        ...userStats[0],
        ...orderStats[0]
      });
    });
  });
});

app.get('/api/admin/users', (req, res) => {
  const query = \`
    SELECT 
      user_id,
      CONCAT(first_name, ' ', last_name) as full_name,
      email,
      phone,
      is_active,
      registration_date,
      last_login
    FROM users 
    ORDER BY registration_date DESC
  \`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(\`🎛️  Admin Dashboard running at: http://localhost:\${port}/admin-dashboard\`);
  console.log('📊 Real-time user monitoring and statistics');
});