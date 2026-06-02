# shadcn/ui Practices

Apply these rules when generating React UI using shadcn/ui.

## Required Rules

- shadcn-component-composition
- shadcn-form-pattern
- shadcn-dialog-pattern
- shadcn-table-pattern
- shadcn-tailwind-spacing
- shadcn-query-state-pattern

---

# Stack

- React
- TypeScript strict
- TailwindCSS
- shadcn/ui
- react-hook-form
- @tanstack/react-query

---

# General Rules

- prefer existing shadcn components
- reuse variants instead of custom styles
- keep components small and composable
- avoid duplicated JSX
- avoid inline styles
- prefer semantic Tailwind utilities
- accessibility is required

---

# Imports

Prefer:

```ts
import { Button } from "@/components/ui/button";
```

Avoid deep relative imports.

---

# Component Structure

Prefer:

```txt
components/
  booking/
    booking-table.tsx
    booking-dialog.tsx
    booking-form.tsx
```

Avoid huge multi-purpose component files.

---

# State Rules

- server state -> react-query
- form state -> react-hook-form
- UI state -> local component state

Avoid mixing responsibilities.

---

# Styling Rules

- use Tailwind only
- avoid hardcoded colors
- prefer theme tokens
- use consistent spacing scale

---

# Form Rules

- use shadcn Form primitives
- validation via zod/yup
- keep schema separated

---

# Table Rules

- server pagination preferred
- extract columns config
- avoid business logic inside cell render

---

# Dialog Rules

- use Dialog/Sheet from shadcn
- avoid custom modal implementation
- keep dialog state isolated
