# Contributing to FIT File Viewer

Thank you for your interest in contributing to the FIT File Viewer extension! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment
- Report unacceptable behavior

## Getting Started

### Prerequisites

- Node.js (see `.nvmrc` for version)
- npm (comes with Node.js)
- Visual Studio Code
- Git

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fit-viewer.git
   cd fit-viewer
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the extension:
   ```bash
   npm run compile
   ```

5. Open in VS Code and press `F5` to run in debug mode

## Making Changes

### Branch Naming

Use descriptive branch names with prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

Example: `feature/add-heart-rate-zones`

### Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Test your changes thoroughly
4. Commit with descriptive messages
5. Push to your fork
6. Create a pull request

### Code Organization

- `src/extension.ts` - Main extension entry point
- `src/fitFileEditorProvider.ts` - Custom editor provider
- `src/fitParser.ts` - FIT file parsing logic
- `src/parseMessages.ts` - Message processing
- `media/webview.html` - Webview HTML template
- `src/test/` - Test files

## Submitting Changes

### Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Add or update tests for your changes
4. Ensure all tests pass: `npm test`
5. Update CHANGELOG.md with your changes
6. Submit a pull request with:
   - Clear title and description
   - Reference any related issues
   - Screenshots if UI changes are involved

### Pull Request Template

Please fill out the provided pull request template completely.

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Follow the configured ESLint and Prettier rules

### Code Formatting

Run these commands before committing:

```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format

# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Git Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
- `feat(parser): add support for new FIT message types`
- `fix(webview): resolve map rendering issue`
- `docs(readme): update installation instructions`

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Check formatting
npm run format:check
```

### Writing Tests

- Add tests for new functionality
- Update existing tests when modifying code
- Place tests in `src/test/suite/`
- Use descriptive test names
- Test both success and error cases

### Test Structure

```typescript
import * as assert from 'assert';

suite('Feature Test Suite', () => {
  test('should handle valid input', () => {
    // Test implementation
  });

  test('should handle invalid input gracefully', () => {
    // Error case testing
  });
});
```

## Questions and Support

- Check existing [issues](https://github.com/thomascamminady/fit-viewer/issues)
- Create a new issue for bugs or feature requests
- Use [GitHub Discussions](https://github.com/thomascamminady/fit-viewer/discussions) for questions

## Recognition

Contributors will be recognized in:
- Release notes
- GitHub contributors list
- Special mentions for significant contributions

Thank you for contributing to FIT File Viewer!
