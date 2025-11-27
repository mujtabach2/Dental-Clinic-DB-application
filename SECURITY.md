# Security Features

This document outlines the security features implemented in the Dental Clinic Management System.

## Authentication & Authorization

### Password Security
- **Password Hashing**: All passwords are hashed using bcrypt with a salt rounds of 10
- **Password Migration**: The system supports automatic migration from plain text to hashed passwords
- **Default Passwords**: New employees receive a default password (their empID) which should be changed immediately

### Session Management
- **Secure Sessions**: Uses express-session with secure cookie settings
- **Session Secret**: Configurable via `SESSION_SECRET` environment variable
- **HttpOnly Cookies**: Prevents XSS attacks by making cookies inaccessible to JavaScript
- **Secure Cookies**: Automatically enabled in production (HTTPS)

### Rate Limiting
- **Login Rate Limiting**: Maximum 5 login attempts per 15 minutes per IP address
- **Brute Force Protection**: Prevents automated password guessing attacks

## Input Validation

### Validation Features
- **Type Checking**: Validates input types (string, integer, email)
- **Length Limits**: Enforces maximum length constraints (255 characters for strings)
- **Required Fields**: Validates that required fields are present
- **Format Validation**: Email format validation using regex

### SQL Injection Prevention
- **Parameterized Queries**: All database queries use prepared statements with parameters
- **Input Sanitization**: Input is validated before being used in queries

## Role-Based Access Control (RBAC)

### User Roles
- **Admin**: Full system access (empID: 999)
- **Secretary**: Can manage appointments and appointment treatments
- **Dental Staff**: Access to dental-related functions
- **Billing Admin**: Access to financial records

### Route Protection
- All API routes (except `/api/login` and `/api/health`) require authentication
- Role-based middleware restricts access to specific routes based on user roles

## Security Best Practices

### Environment Variables
- Session secret should be set via `SESSION_SECRET` environment variable
- Never commit secrets to version control
- Use strong, random session secrets in production

### Password Requirements
- Minimum 3 characters (can be increased for production)
- Passwords are never stored in plain text
- Passwords are never sent in API responses

### Error Messages
- Generic error messages prevent user enumeration
- Detailed error messages are logged server-side only

## Migration Guide

### For Existing Databases

1. **Add Password Column** (if not already present):
   ```sql
   ALTER TABLE Employee ADD COLUMN password TEXT NOT NULL DEFAULT '';
   ```

2. **Run Migration Script**:
   ```bash
   cd server
   npm run migrate-passwords
   ```

   This will:
   - Hash all existing plain text passwords
   - Set default passwords (empID) for employees without passwords
   - Skip already hashed passwords

3. **Update Employee Passwords**:
   - All employees should change their default passwords
   - Default password for each employee is their empID

### For New Databases

1. Create tables:
   ```bash
   npm run create
   ```

2. Populate data:
   ```bash
   npm run populate
   ```

3. Hash passwords:
   ```bash
   npm run migrate-passwords
   ```

## Environment Setup

Create a `.env` file in the root directory:

```env
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=production
PORT=3001
```

Generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Security Recommendations

1. **Change Default Passwords**: All users should change their default passwords immediately
2. **Use HTTPS**: Enable HTTPS in production and set `secure: true` in session cookies
3. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities
4. **Strong Session Secrets**: Use cryptographically secure random strings for session secrets
5. **Monitor Logs**: Regularly review server logs for suspicious activity
6. **Password Policy**: Consider implementing stronger password requirements (length, complexity)
7. **Two-Factor Authentication**: Consider adding 2FA for admin accounts
8. **Audit Logging**: Consider adding audit logs for sensitive operations

## Known Limitations

- Plain text password fallback is included for migration compatibility (should be removed after migration)
- Rate limiting is IP-based (may need adjustment for proxy/load balancer setups)
- No password reset functionality (should be added for production)

