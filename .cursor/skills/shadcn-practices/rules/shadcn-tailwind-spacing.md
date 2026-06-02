# Rule: Tailwind Spacing

## Requirements

- use consistent spacing scale
- prefer gap utilities
- prefer flex/grid layout
- avoid spacing hacks

---

# Preferred

```tsx
<div className="flex flex-col gap-4">
```

---

# Avoid

```tsx
<div className="mt-3 mb-5">
```

---

# Width

Prefer responsive layout:

```tsx
w-full md:w-[400px]
```

Avoid desktop-only fixed layout.

---

# Styling

- avoid inline style
- avoid hardcoded color
- prefer semantic utility classes
