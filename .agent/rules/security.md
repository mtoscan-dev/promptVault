# 🔒 Security Guidelines

Protect applications from common vulnerabilities and secure sensitive data.

## 1. Sensitive Data Protection

### Never Commit
- API keys and secrets
- Database credentials
- Private keys
- Environment-specific configs with secrets

### Use Environment Variables
```bash
# Store in .env (add to .gitignore)
API_KEY=your-secret-key
DATABASE_URL=postgres://user:pass@host/db

# Access in code
# Node.js: process.env.API_KEY
# Python: os.environ.get('API_KEY')
```

### Secret Management
- Use secret managers (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate secrets regularly
- Use different secrets per environment

## 2. Input Validation

### Always Validate
- User inputs
- API request bodies
- Query parameters
- File uploads

### Validation Rules
- Whitelist allowed values when possible
- Sanitize before storing
- Encode before rendering

## 3. Authentication & Authorization

### Password Handling
- Never store plain text passwords
- Use strong hashing (bcrypt, Argon2)
- Enforce password complexity
- Implement account lockout

### Session Management
- Use secure, HTTP-only cookies
- Implement session expiration
- Regenerate session ID after login

## 4. Common Vulnerabilities to Prevent

| Vulnerability | Prevention |
|---------------|------------|
| SQL Injection | Parameterized queries |
| XSS | Output encoding, CSP |
| CSRF | CSRF tokens |
| Path Traversal | Input validation |
| Insecure Deserialization | Validate before deserialize |

## 5. HTTPS & Transport Security

- Enforce HTTPS everywhere
- Use HSTS headers
- Configure TLS properly (disable old versions)

## 6. Logging & Monitoring

### Do Log
- Authentication attempts
- Authorization failures
- Input validation failures
- Error conditions

### Never Log
- Passwords
- Secrets/API keys
- Full credit card numbers
- Personal identification data
