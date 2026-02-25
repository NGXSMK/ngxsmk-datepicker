# Security Policy

**Last updated:** February 25, 2026 · **Current stable:** v2.2.0

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2.1.x   | :white_check_mark: |
| 2.0.x   | :white_check_mark: |
| 1.10.x  | :white_check_mark: |
| 1.9.x   | :white_check_mark: |
| 1.8.x   | :white_check_mark: |
| < 1.8   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT open a public issue

**Do not** report security vulnerabilities through public GitHub issues. This could expose the vulnerability before a fix is available.

### 2. Report privately

Please report security vulnerabilities by emailing the maintainer:

- **Email**: [Check GitHub profile for contact information]
- **Subject**: `[SECURITY] ngxsmk-datepicker vulnerability report`

### 3. Include details

Please include the following information in your report:

- Type of vulnerability (XSS, injection, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if available)

### 4. Response timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity, typically 30-90 days

### 5. Disclosure policy

- We will acknowledge receipt of your report within 48 hours
- We will keep you informed of the progress
- Once a fix is ready, we will:
  1. Release a security patch
  2. Credit you (if desired) in the security advisory
  3. Publish a security advisory on GitHub

## Security Best Practices

### For Users

1. **Keep dependencies updated**: Regularly update `ngxsmk-datepicker` to the latest version
2. **Review dependencies**: Use tools like `npm audit` to check for known vulnerabilities
3. **Sanitize inputs**: Always validate and sanitize date inputs from user sources
4. **Use Content Security Policy**: Implement CSP headers to prevent XSS attacks

### For Developers

1. **Input validation**: Always validate and sanitize user inputs
2. **Avoid eval()**: Never use `eval()` or similar dangerous functions
3. **XSS prevention**: Use Angular's built-in sanitization for user-generated content
4. **Dependency updates**: Keep dependencies up to date
5. **Security headers**: Implement proper security headers in your application

## Known Security Considerations

### XSS Prevention

The datepicker uses Angular's built-in sanitization for template rendering. However, when using custom templates or dynamic content:

- Always sanitize user-provided date formats
- Use Angular's `DomSanitizer` for any custom HTML
- Avoid `innerHTML` with user content

### Date Validation

- The datepicker validates date inputs, but always validate on the server side
- Be cautious with date parsing from strings
- Use proper timezone handling for server communication

### Dependency Security

We regularly update dependencies to address security vulnerabilities. To check for known vulnerabilities:

```bash
npm audit
```

## Security Updates

Security updates are released as:
- **Patch versions** (1.8.1, 1.8.2, etc.) for critical security fixes
- **Minor versions** (1.9.0, 1.9.1, etc.) for non-critical security improvements

## Credits

We appreciate responsible disclosure of security vulnerabilities. Contributors who report valid security issues will be credited (if desired) in our security advisories.

## Additional Resources

- [Angular Security Guide](https://angular.dev/guide/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

