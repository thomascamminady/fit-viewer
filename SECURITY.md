# Security Policy

## Supported Versions

We actively support the following versions of the FIT File Viewer extension:

| Version | Supported          |
| ------- | ------------------ |
| 0.6.x   | :white_check_mark: |
| < 0.6   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this extension, please report it responsibly:

### Private Disclosure

1. **Do not** create a public GitHub issue for security vulnerabilities
2. Email security reports to: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Resolution**: Varies based on complexity

### What to Expect

1. Acknowledgment of your report
2. Investigation and assessment
3. Development of a fix
4. Coordinated disclosure after fix is released
5. Credit in release notes (if desired)

## Security Considerations

This extension:
- Processes binary FIT files locally
- Does not transmit data over networks
- Runs in VS Code's webview sandbox
- Uses trusted external libraries for data processing

For general security best practices when using VS Code extensions, see [VS Code's security documentation](https://code.visualstudio.com/docs/editor/extension-marketplace#_extension-security).
