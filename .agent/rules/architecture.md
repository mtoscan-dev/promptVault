# 🏗 Architecture & System Design Patterns

Guidelines for creating maintainable, scalable, and robust software architectures.

## 1. Project Structure Principles

### Separation of Concerns
```
src/
├── components/     # Reusable UI components
├── features/       # Feature-based modules
├── hooks/          # Custom hooks (React/Vue)
├── services/       # API clients, external integrations
├── stores/         # State management
├── utils/          # Pure utility functions
├── types/          # Type definitions
└── config/         # Configuration files
```

### Feature-Based Organization
Group related code by feature, not by type:
```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types.ts
└── dashboard/
    ├── components/
    ├── hooks/
    └── services/
```

## 2. Code Modularity

### Single Responsibility
- Each module/function should do ONE thing well
- If a function exceeds 50 lines, consider splitting it
- If a component has more than 3 responsibilities, refactor

### Dependency Injection
- Avoid hard-coded dependencies
- Use interfaces/types to define contracts
- Enable easy testing and mocking

## 3. API Design Guidelines

### RESTful Conventions
| Action | HTTP Method | URL Pattern |
|--------|-------------|-------------|
| List | GET | /resources |
| Read | GET | /resources/:id |
| Create | POST | /resources |
| Update | PUT/PATCH | /resources/:id |
| Delete | DELETE | /resources/:id |

### Response Format
```json
{
  "data": {},
  "meta": {
    "page": 1,
    "total": 100
  },
  "errors": []
}
```

## 4. State Management Patterns

### Client State vs Server State
- **Client State**: UI state, form inputs → Local state management
- **Server State**: API data → Data fetching libraries with caching

### State Colocation
- Keep state as close to where it's used as possible
- Lift state only when sharing is necessary

## 5. Error Handling

### Graceful Degradation
- Always have fallback UI for error states
- Log errors with context (user action, component, timestamp)
- Never expose raw error messages to users

### Error Boundaries (UI)
```
Wrap critical sections with error boundaries
to prevent entire app crashes
```

## 6. Performance Patterns

### Lazy Loading
- Code-split by route
- Lazy load heavy components
- Use dynamic imports for non-critical modules

### Memoization
- Memoize expensive calculations
- Cache stable function references
- Avoid premature optimization

### Caching Strategy
- Cache API responses with appropriate TTL
- Use stale-while-revalidate pattern
- Implement optimistic updates for better UX
