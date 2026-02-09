# ✨ Code Style Guidelines

Maintain consistent, readable, and high-quality code across all projects.

## 1. General Principles

- **Readability First**: Code is read more often than written
- **Consistency**: Follow existing patterns in the codebase
- **Self-Documenting**: Use clear naming; add comments for "why", not "what"
- **DRY**: Don't Repeat Yourself, but don't over-abstract

## 2. Naming Conventions

| Element | Style | Example |
|---------|-------|---------|
| Variables | camelCase | `userName`, `itemCount` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Functions | camelCase (verb+noun) | `getUserById`, `validateInput` |
| Classes | PascalCase | `UserService`, `HttpClient` |
| Files (JS/TS) | camelCase or kebab-case | `userService.ts`, `user-service.ts` |
| Files (Python) | snake_case | `user_service.py` |

## 3. Code Organization

### File Structure
```
1. Imports (external → internal)
2. Constants/Types
3. Main code (classes/functions)
4. Exports
```

### Function Length
- Target: 20-30 lines
- Maximum: 50 lines
- If longer, consider breaking into smaller functions

### Import Order
1. Built-in/Standard library
2. External dependencies
3. Internal modules (absolute paths)
4. Internal modules (relative paths)

## 4. Comments

### When to Comment
- Complex business logic
- Non-obvious workarounds
- TODO items with context
- Public API documentation

### Comment Style
```javascript
// Single line for brief explanations

/**
 * Multi-line for function/class documentation
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<User>} The user object
 */
```

## 5. Error Handling

- Always handle errors explicitly
- Provide meaningful error messages
- Log errors with context
- Don't swallow errors silently

```javascript
// ❌ Bad
try { doSomething(); } catch (e) {}

// ✅ Good
try {
  doSomething();
} catch (error) {
  logger.error('Failed to do something', { error, context });
  throw new ApplicationError('Operation failed', { cause: error });
}
```

## 6. Formatting

- Use consistent indentation (2 or 4 spaces)
- Configure linter and formatter for your platform
- Run formatters on save
- Use `.editorconfig` for cross-editor consistency
