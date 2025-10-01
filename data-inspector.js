// Data Inspector - Run this in browser console to view stored user data
// Copy and paste this code in your browser's developer console (F12)

console.log("🔍 Maa Anpurna Aahar - Data Inspector");
console.log("=====================================");

// Function to display all stored data
function inspectStoredData() {
    console.log("\n📊 STORAGE OVERVIEW:");
    console.log("==================");
    
    // Get all localStorage data
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences'));
    
    console.log(`📈 Total Registered Users: ${registeredUsers.length}`);
    console.log(`👤 Current User: ${currentUser ? `${currentUser.firstName} ${currentUser.lastName} (${currentUser.email})` : 'None (Logged out)'}`);
    console.log(`🛒 Cart Items: ${cart.length}`);
    console.log(`⚙️ User Preferences: ${userPreferences ? 'Set' : 'Not set'}`);
    
    return {
        registeredUsers,
        currentUser,
        cart,
        userData,
        userPreferences
    };
}

// Function to display all registered users
function showAllUsers() {
    console.log("\n👥 REGISTERED USERS:");
    console.log("===================");
    
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    if (users.length === 0) {
        console.log("No users registered yet.");
        return;
    }
    
    users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   📱 Phone: ${user.phone || 'Not provided'}`);
        console.log(`   🆔 ID: ${user.id}`);
        console.log(`   🗓️ Registered: ${new Date(user.registrationDate).toLocaleString()}`);
        console.log(`   🔑 Password: ${user.password}`); // Only shown in development
    });
    
    return users;
}

// Function to show current session info
function showCurrentSession() {
    console.log("\n🔐 CURRENT SESSION:");
    console.log("==================");
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        console.log("No user is currently logged in.");
        return null;
    }
    
    console.log(`👤 Name: ${currentUser.firstName} ${currentUser.lastName}`);
    console.log(`📧 Email: ${currentUser.email}`);
    console.log(`🔑 Status: ${currentUser.isLoggedIn ? 'Logged In' : 'Logged Out'}`);
    console.log(`⏰ Login Time: ${new Date(currentUser.loginTime).toLocaleString()}`);
    console.log(`💭 Remember Me: ${currentUser.rememberMe ? 'Yes' : 'No'}`);
    
    return currentUser;
}

// Function to show cart contents
function showCartContents() {
    console.log("\n🛒 SHOPPING CART:");
    console.log("=================");
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        console.log("Cart is empty.");
        return [];
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.name}`);
        console.log(`   💰 Price: ₹${item.price}`);
        console.log(`   🔢 Quantity: ${item.quantity}`);
        console.log(`   💵 Subtotal: ₹${item.price * item.quantity}`);
        console.log(`   🆔 ID: ${item.id}`);
        total += item.price * item.quantity;
    });
    
    console.log(`\n💸 TOTAL CART VALUE: ₹${total}`);
    return cart;
}

// Function to export data to JSON
function exportUserData() {
    const data = inspectStoredData();
    const exportData = {
        exportDate: new Date().toISOString(),
        website: "Maa Anpurna Aahar",
        data: data
    };
    
    console.log("\n📤 EXPORTED DATA:");
    console.log("=================");
    console.log(JSON.stringify(exportData, null, 2));
    
    return exportData;
}

// Function to create a demo user for testing
function createDemoUser() {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const demoUser = {
        id: 'demo-' + Date.now(),
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@maaanpurnaahar.me',
        phone: '+91 98765 43210',
        password: 'demo123',
        registrationDate: new Date().toISOString()
    };
    
    // Check if demo user already exists
    if (users.find(u => u.email === demoUser.email)) {
        console.log("Demo user already exists!");
        return;
    }
    
    users.push(demoUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    console.log("✅ Demo user created:");
    console.log(`Email: ${demoUser.email}`);
    console.log(`Password: ${demoUser.password}`);
}

// Function to clear all data
function clearAllStoredData() {
    const keys = ['registeredUsers', 'currentUser', 'cart', 'userData', 'userPreferences'];
    keys.forEach(key => localStorage.removeItem(key));
    console.log("🗑️ All data cleared!");
}

// Available commands
console.log("\n🛠️ AVAILABLE COMMANDS:");
console.log("======================");
console.log("inspectStoredData()     - View storage overview");
console.log("showAllUsers()          - List all registered users");
console.log("showCurrentSession()    - Show current user session");
console.log("showCartContents()      - Display cart contents");
console.log("exportUserData()        - Export all data as JSON");
console.log("createDemoUser()        - Create demo user for testing");
console.log("clearAllStoredData()    - Clear all stored data (⚠️ Warning!)");

// Auto-run inspection
inspectStoredData();