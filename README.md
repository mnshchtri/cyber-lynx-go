# Cyber-LynX Dashboard

A modern, responsive cybersecurity dashboard with user authentication, target management, and enhanced light/dark mode functionality.

## Features

### ✨ Enhanced Features
- **Full CRUD operations for targets** - Add, edit, delete targets with proper user isolation
- **Improved Light/Dark Mode** - Smooth transitions and comprehensive theme support
- **AJAX-powered interface** - Real-time updates without page refreshes
- **User authentication** - Secure login/signup system
- **Responsive design** - Works on desktop and mobile devices
- **Modern UI/UX** - Clean, professional interface with animations

### 🎯 Target Management
- Add targets with different types (Website, IP, Domain, Subdomain)
- Edit existing targets inline
- Delete targets with confirmation
- User-specific target isolation (users only see their own targets)
- Real-time target count updates

### 🎨 Theme System
- Comprehensive light/dark mode support
- Smooth transitions between themes
- Theme persistence across sessions
- CSS custom properties for consistent theming
- Enhanced shadows and colors for both modes

### 🔐 Security Features
- User authentication with session management
- CSRF protection through user validation
- SQL injection prevention with prepared statements
- User isolation for all data operations

## Installation

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)

### Setup Steps

1. **Configure database**
   - Create a MySQL database
   - Update `config.php` with your database credentials:
   ```php
   <?php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   define('DB_NAME', 'your_database_name');
   ?>
   ```

2. **Run database setup**
   ```bash
   # Create tables
   php setup.php
   
   # Run migration (if upgrading from older version)
   php migrate.php
   ```

3. **Set up web server**
   - Point your web server to the project directory
   - Ensure PHP has write permissions for session management

4. **Access the application**
   - Open your web browser
   - Navigate to your domain/localhost
   - Create a new account using the signup form

## Usage

### Managing Targets

1. **Add a Target**
   - Click "Add Target" button
   - Select target type (Website, IP, Domain, Subdomain)
   - Enter target value
   - Add optional description
   - Click "Add Target"

2. **Edit a Target**
   - Click the edit icon (✏️) on any target card
   - Modify the information
   - Click "Update Target"

3. **Delete a Target**
   - Click the delete icon (🗑️) on any target card
   - Confirm the deletion in the popup
   - Target is removed immediately from database and UI

### Theme Management

- Click the theme toggle button in the sidebar
- Switches between light and dark modes
- Changes apply immediately with smooth transitions
- Theme preference is saved to localStorage

## Key Files Modified/Added

- `api/delete_target.php` - Enhanced with JSON responses and better error handling
- `api/add_target.php` - Updated to support both AJAX and regular requests
- `js/main.js` - Improved AJAX handling and theme management
- `css/style.css` - Enhanced theme system with better light/dark mode support
- `setup.php` - Updated database schema with user relationships
- `migrate.php` - Database migration script for existing installations
- `views/dashboard.php` - Enhanced with edit/delete functionality

## Database Structure

### Users Table
```sql
CREATE TABLE users (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Targets Table
```sql
CREATE TABLE targets (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    target_type VARCHAR(30) NOT NULL,
    target_value VARCHAR(255) NOT NULL,
    target_description TEXT,
    user_id INT(6) UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Troubleshooting

### Common Issues

1. **Targets not showing after upgrade**
   - Run `php migrate.php` to add the user_id column
   - Existing targets will be assigned to user ID 1

2. **Delete functionality not working**
   - Check browser console for JavaScript errors
   - Verify the delete API endpoint is accessible
   - Ensure user is properly logged in

3. **Theme switching issues**
   - Clear browser cache and localStorage
   - Check if CSS custom properties are supported
   - Verify JavaScript is enabled

4. **AJAX requests failing**
   - Check browser network tab for HTTP errors
   - Verify API endpoints return valid JSON
   - Check PHP error logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request with detailed description

## License

MIT License - feel free to use and modify as needed.
