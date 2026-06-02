# Rule: shadcn Component Composition

## Requirements

- prefer composition over monolithic component
- reuse shadcn primitives
- extract reusable sections
- avoid duplicated JSX

---

# Prefer

```tsx
<Card>
  <CardHeader />
  <CardContent />
</Card>
```

---

# Avoid

```tsx
<div className="border rounded p-4 shadow">
```

when equivalent shadcn component exists.

---

# Layout

Prefer:

```tsx
<div className="flex flex-col gap-4">
```

Avoid excessive nesting.

---

# Reusability

Extract reusable:
- toolbars
- filters
- form sections
- dialogs
- table columns