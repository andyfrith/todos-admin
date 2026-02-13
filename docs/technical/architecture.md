# Modular Architecture Documentation

This document outlines the modular (layered) or "composable" architecture used in the application. The architecture follows a clean separation of concerns with distinct organization for data access, business logic, and server-side operations.

## Architecture Overview

The codebase implements a **modular architecture** that promotes:

- **Separation of concerns** - Each module (layer) has a specific responsibility
- **Testability** - Business logic can be tested independently
- **Maintainability** - Changes in one layer don't affect others
- **Reusability** - Business logic can be reused across different interface

### Components

- Base Setup (Router & Styles)
- Presentation
- Hooks
- Server Functions
- API & Data Access
- Data Storage

```
src/
├── router.tsx          # Router Setup
├── routeTree.gen       # Generated Routes
├── styles.css          # Styling Configuration
├── components/         # UI Components
├── data/               # Data Files
├── db/                 # Database and Drizzle Configuration
├── hooks/              # Reusable React Hooks
├── integrations        # External Tool Intergations
├── lib/                # Utils and Reusable Library Components
├── queries/            # Reusable Tan Stack Query Options
├── routes/             # Tan Stack Routes
├── types/              # Type Definitions
└── server/             # Tan Stack Server Functions
```

## Router (`src/router.tsx`)

## Route Tree (`src/routeTree.gen`)

## Styles (`src/styles.css`)

## Types (`src/types`)

## Components (`src/components`)

## Data (`src/data`)

## Hooks (`src/hooks`)

## Integrations (`src/integrations`)

## Lib (`src/lib`)

## Queries (`src/queries`)

Uses **TanStack Query** query options

## Routes (`src/routes`)

Uses **TanStack Router** routes

## Server Functions (`src/server/fn/`)

Uses **TanStack Start** server functions to expose business logic as API endpoints with middleware support.

### Structure:

```
src/server/fn/
├── posts.ts          # Post server functions
└── todos.ts          # Todo server functions
```

### Example: `src/server/fn/todos.ts`

```typescript
import { createServerFn } from '@tanstack/react-start';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db/index';
import { todos } from '@/db/schema';

export const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.query.todos.findMany({
    orderBy: [desc(todos.createdAt)],
  });
});

export const createTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(todos).values({ title: data.title });
    return { success: true };
  });

export const deleteTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.delete(todos).where(eq(todos.id, parseInt(data.id)));
    return { success: true };
  });
```

### Key Characteristics:

- **Middleware support** - Authentication, validation, rate limiting
- **Type safety** - Full TypeScript support
- **HTTP method specification** - GET, POST, PUT, DELETE
- **Context injection** - User authentication, request data
- **Direct data access** - Can call data access layer directly for simple operations

## Layer 5: Presentation Layer

The top layer that handles HTTP requests, renders UI, and manages user interactions.

### API Routes (`src/routes/api/`)

... ADD MORE INFO

### React Components (`src/components/`)

Components consume server functions and use cases through hooks and direct calls.

## Data Flow

### Typical Request Flow:

... ADD MORE INFO

### Example Flow for Creating a Todo:

... ADD MORE INFO

## Benefits of This Architecture

### 1. **Separation of Concerns**

- Data access logic is isolated from business rules
- Business logic is independent of UI and infrastructure
- Server functions handle HTTP concerns separately

### 2. **Testability**

- Use cases can be unit tested without database
- Data access functions can be mocked
- Business logic is pure and predictable

### 3. **Maintainability**

- Changes in one layer don't cascade to others
- Clear interfaces between layers
- Easy to add new features or modify existing ones

### 4. **Reusability**

- Business logic can be reused across different interfaces
- Data access functions can be called from multiple use cases
- Server functions can be consumed by different clients

### 5. **Type Safety**

- Full TypeScript support across all layers
- Shared types ensure consistency
- Compile-time error checking

## Best Practices

### 1. **Layer Dependencies**

- Higher layers can depend on lower layers
- Lower layers should never depend on higher layers
- Use cases should not import from routes or components

### 2. **Error Handling**

- Use custom error classes in use cases
- Handle infrastructure errors at the server function level
- Provide meaningful error messages to users

### 3. **Type Definitions**

- Keep shared types in `use-cases/types.ts`
- Use specific types for function parameters and return values
- Avoid `any` types and use proper TypeScript features

### 4. **Function Naming**

- Use cases: `verbNounUseCase` (e.g., `createUserUseCase`)
- Data access: `verbNoun` (e.g., `createUser`)
- Server functions: `verbNounFn` (e.g., `createUserFn`)

### 5. **Middleware Usage**

- Use middleware for cross-cutting concerns
- Keep business logic in use cases, not middleware
- Use middleware for authentication, validation, logging

## Conclusion

This modular (layererd) architecture provides a solid foundation for building maintainable, testable, and scalable applications. The clear separation of concerns makes it easy to understand the codebase structure and modify individual components without affecting others.
