# WordPress + Astra Theme Migration Guide
## Maa Anpurna Aahar Website Migration

### Phase 1: WordPress Installation (Local Development)

#### Method 1: Local by Flywheel (Recommended)
1. Download Local by Flywheel: https://localwp.com/
2. Install and create new site: "maa-anpurna-aahar"
3. Choose WordPress version: Latest
4. Set up admin credentials

#### Method 2: XAMPP Setup
1. Download XAMPP: https://www.apachefriends.org/
2. Install and start Apache + MySQL
3. Download WordPress: https://wordpress.org/download/
4. Extract to `C:\xampp\htdocs\maa-anpurna-aahar`
5. Create database in phpMyAdmin
6. Run WordPress installer

### Phase 2: Astra Theme Installation

#### 1. Install Astra Theme
```
Appearance → Themes → Add New → Search "Astra" → Install & Activate
```

#### 2. Install Astra Pro (Premium Features)
- Purchase from: https://wpastra.com/
- Upload via Appearance → Themes → Upload Theme

#### 3. Install Required Plugins
- Astra Pro Addon
- Elementor Page Builder
- WooCommerce (for products)
- Contact Form 7
- Yoast SEO

### Phase 3: Content Migration

#### Your Current Website Structure:
- ✅ Homepage (index.html)
- ✅ Products Page (products.html) 
- ✅ Contact Page (contact.html)
- ✅ Login/Register (login.html, register.html)
- ✅ User Profile (profile.html)
- ✅ Admin Dashboard
- ✅ Firebase Authentication

#### WordPress Pages to Create:
1. **Homepage** - Using Astra Starter Template
2. **About Us** - Company story
3. **Products** - WooCommerce shop page
4. **Contact** - Contact form
5. **My Account** - User dashboard
6. **Blog** - For SEO content

### Phase 4: Astra Configuration

#### 1. Choose Astra Starter Template
- Go to Appearance → Astra Options → Starter Templates
- Select "Food & Restaurant" category
- Choose template similar to your orange/blue theme
- Import template

#### 2. Customize Colors (Match Current Theme)
```
Customizer → Global → Colors:
- Primary Color: #ff9800 (Orange)
- Secondary Color: #2c3e50 (Dark Blue)
- Text Color: #333333
- Link Color: #ff9800
```

#### 3. Typography Settings
```
Customizer → Global → Typography:
- Base Font: Segoe UI
- Headings: Segoe UI, Bold
```

#### 4. Layout Options
```
Customizer → Layout:
- Site Layout: Full Width
- Container: 1200px max-width
- Sidebar: No sidebar for main pages
```

### Phase 5: Firebase Integration with WordPress

#### 1. Custom Plugin Creation
Create custom plugin to integrate Firebase with WordPress user system

#### 2. Authentication Bridge
- Map Firebase users to WordPress users
- Maintain existing user data
- Sync authentication between systems

### Phase 6: WooCommerce Setup (Products)

#### 1. Product Categories
- Snacks & Namkeen
- Sweets & Mithai
- Pickles & Preserves
- Traditional Foods

#### 2. Product Migration
Transfer product data from your current system

### Phase 7: Performance Optimization

#### 1. Essential Plugins
- WP Rocket (Caching)
- Smush (Image optimization)
- Yoast SEO
- Security plugin

#### 2. Astra Performance Features
- Minify CSS/JS
- Lazy loading
- Fast Google Fonts loading

### Phase 8: Testing & Launch

#### 1. Local Testing
- All pages working
- Forms functional
- Authentication working
- Mobile responsive

#### 2. Live Migration
- Backup current site
- Upload to hosting
- Configure DNS
- SSL certificate

## Next Steps:
1. Choose installation method (Local/XAMPP)
2. Install WordPress + Astra
3. Configure basic settings
4. Import starter template
5. Begin content migration

Would you like me to help with any specific phase?