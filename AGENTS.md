# AGENTS.md

# General Engineering Guidelines

This document defines the development standards, architecture patterns, and best practices that should be followed when building applications using:

- Next.js (App Router)
- TypeScript
- Supabase
- Progressive Web Apps (PWA)
- Capacitor (optional mobile wrapper)

The primary goals are:

1. Maintainability
2. Simplicity
3. Scalability
4. Type Safety
5. Performance
6. Security

Always favor framework conventions over custom solutions.

---

# Core Principles

## Simplicity First

Prefer the simplest implementation that satisfies requirements.

Avoid:

- Premature optimization
- Over-engineering
- Excessive abstraction
- Enterprise patterns for small applications

Before introducing a new layer, ask:

> Does this solve a real problem that exists today?

---

## Convention Over Configuration

Follow official framework recommendations whenever possible.

Avoid creating custom patterns when Next.js, Supabase, or React already provide a standard solution.

---

## Build for Current Requirements

Do not build hypothetical future features.

Avoid:

- Generic factories
- Abstract repositories
- Complex plugin systems
- Dynamic architecture for unknown requirements

Build what is needed today.

---

# Next.js Standards

## App Router

Use App Router exclusively.

Preferred:

```text
src/
└── app/
```

Avoid mixing:

```text
pages/
app/
```

in the same project.

---

## Route Groups

Use route groups for organization.

Example:

```text
(auth)
(dashboard)
(marketing)
(settings)
```

Purpose:

- Organize routes
- Separate layouts
- Improve maintainability

Do not use route groups unnecessarily.

Create groups only when they represent meaningful application sections.

---

## Dynamic Routes

Use dynamic routes only when required.

Examples:

```text
[id]
[slug]
[...segments]
```

Avoid creating dynamic routes preemptively.

---

## Server Components by Default

Every component should start as a Server Component.

Only convert to Client Components when required.

Valid reasons:

- useState
- useEffect
- useReducer
- Browser APIs
- Event handlers
- Local storage
- Window/document access

Avoid unnecessary:

```tsx
"use client";
```

Client Components increase bundle size.

---

## Keep Pages Thin

Pages should focus on composition.

Avoid placing large amounts of business logic inside:

```tsx
page.tsx
```

Prefer:

```tsx
page.tsx
```

→ fetch data

→ render feature components

Keep responsibilities separated.

---

## Layout Usage

Use layouts for:

- Shared navigation
- Shared providers
- Shared UI wrappers

Do not duplicate layouts across pages.

---

## Error Boundaries

Implement:

```text
error.tsx
```

for route-level errors.

Use:

```text
global-error.tsx
```

when appropriate.

Always provide meaningful fallback UI.

---

## Loading States

Implement:

```text
loading.tsx
```

for routes that fetch data.

Avoid blank screens.

---

## Not Found Pages

Implement:

```text
not-found.tsx
```

when routes may return missing resources.

---

# Folder Structure Guidelines

Organize by responsibility.

Preferred:

```text
src/
├── app/
├── components/
├── lib/
├── hooks/
├── types/
└── middleware.ts
```

For larger applications:

```text
src/
├── app/
├── features/
├── components/
├── lib/
├── hooks/
└── types/
```

---

## Components

Keep components focused.

Good:

```text
user-profile.tsx
```

Bad:

```text
dashboard-everything.tsx
```

Aim for:

- Single responsibility
- Easy testing
- Easy reuse

Split large components.

---

## Shared Components

Place reusable UI inside:

```text
components/ui/
```

Examples:

```text
button.tsx
card.tsx
dialog.tsx
```

---

# TypeScript Standards

## Strict Type Safety

Enable strict mode.

Avoid:

```ts
any
```

Avoid:

```ts
as any
```

Avoid:

```ts
unknown as Something
```

Prefer explicit types.

---

## Shared Types

Place reusable types in:

```text
types/
```

Examples:

```text
database.ts
api.ts
shared.ts
```

---

## Naming

Use descriptive names.

Good:

```ts
createUser
fetchProjects
deleteTask
```

Bad:

```ts
handleStuff
processData
runThing
```

---

# Data Fetching Standards

## Server First

Fetch data on the server whenever possible.

Prefer:

```tsx
const data = await getData();
```

inside Server Components.

Avoid unnecessary client-side fetching.

---

## Minimize Waterfalls

Fetch independent data in parallel.

Prefer:

```ts
Promise.all(...)
```

when requests are unrelated.

---

## Cache Intentionally

Use caching deliberately.

Do not disable caching globally.

Understand:

- static rendering
- dynamic rendering
- revalidation

before making changes.

---

# Supabase Standards

## Authentication

Prefer built-in Supabase Auth.

Avoid creating custom authentication systems.

Use official providers when possible.

Examples:

- Google
- GitHub
- Email Magic Link

---

## Row Level Security

RLS is mandatory.

Every table containing user-owned data must have policies.

Never rely solely on frontend authorization.

Database authorization is required.

---

## Ownership Rules

User-owned records should generally contain:

```sql
user_id
```

and enforce ownership through RLS.

---

## Database Design

Prefer simple schemas.

Avoid excessive normalization.

Avoid premature optimization.

Choose clarity over theoretical perfection.

---

## Queries

Select only required fields.

Avoid:

```ts
select("*")
```

when only a few columns are needed.

---

## Generated Types

Generate database types.

Use generated types whenever possible.

Avoid manually duplicating schema definitions.

---

## Supabase Clients

Create centralized clients.

Example:

```text
lib/supabase/
├── client.ts
├── server.ts
└── middleware.ts
```

Never duplicate initialization logic.

---

# Forms

## Validation

Validate:

1. Client-side
2. Server-side

Never trust client validation alone.

---

## User Feedback

Provide:

- Loading states
- Success states
- Error states

Users should always know what is happening.

---

# Error Handling

Never swallow errors.

Bad:

```ts
try {
  ...
} catch {}
```

Good:

```ts
try {
  ...
} catch (error) {
  console.error(error);
}
```

Display meaningful messages when appropriate.

---

# State Management

Use the smallest tool possible.

Order of preference:

1. Server Components
2. React State
3. Context
4. External State Libraries

Do not introduce Redux, Zustand, or other state libraries without a clear need.

---

# React Standards

## Effects

Avoid unnecessary:

```ts
useEffect
```

Many effects can be replaced by:

- Server Components
- Derived state
- Event handlers

---

## Derived State

Do not store values that can be calculated.

Prefer:

```ts
const total = items.length;
```

instead of storing:

```ts
const [total, setTotal]
```

---

# Styling Standards

Prefer:

- Tailwind CSS
- Component composition

Avoid:

- Large global stylesheets
- Excessive custom CSS

Keep styling predictable.

---

# Accessibility

Required:

- Semantic HTML
- Labels for inputs
- Keyboard support
- Proper button elements
- Proper heading hierarchy

Avoid clickable divs.

---

# PWA Standards

## Installability

Every PWA should include:

- manifest
- icons
- install prompt support

---

## Offline Support

Provide meaningful offline behavior.

At minimum:

- Cache static assets
- Show offline fallback UI

---

## Service Workers

Use established tooling.

Avoid hand-writing service workers unless necessary.

---

## Offline Data

Choose the simplest storage solution that satisfies requirements.

Order of preference:

1. localStorage
2. IndexedDB
3. Advanced sync solutions

Do not build custom synchronization systems unless required.

---

# Capacitor Standards

Capacitor should be treated as a deployment target.

Build:

```text
Web App First
```

Then wrap:

```text
Capacitor
```

Avoid platform-specific code unless necessary.

Keep the web application fully functional before introducing native integrations.

---

# Security Standards

## Environment Variables

Only expose public values through:

```env
NEXT_PUBLIC_
```

Never expose:

- Service role keys
- API secrets
- Private credentials

---

## Input Validation

Treat all user input as untrusted.

Validate and sanitize appropriately.

---

## Authorization

Authentication ≠ Authorization

Always verify permissions.

Never trust the client.

---

# Performance Standards

Optimize only when necessary.

Prioritize:

1. Correctness
2. Readability
3. Maintainability
4. Performance

Avoid premature optimization.

---

# Code Review Checklist

Before submitting code, verify:

- Uses TypeScript correctly
- Avoids unnecessary Client Components
- Avoids unnecessary useEffect
- Has proper loading states
- Has proper error states
- Uses RLS for Supabase tables
- Uses generated database types
- Follows App Router conventions
- Uses semantic HTML
- Avoids duplicated logic
- Keeps components focused
- Avoids unnecessary abstractions
- Does not expose secrets
- Works as a PWA
- Works when wrapped with Capacitor

---

# Guiding Philosophy

Prefer:

- Simple over clever
- Explicit over abstract
- Framework conventions over custom patterns
- Maintainability over theoretical scalability
- Current requirements over hypothetical future requirements

Build software that is easy to understand six months later.