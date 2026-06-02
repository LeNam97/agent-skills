# Rule: shadcn Table Pattern

## Requirements

- server pagination preferred
- extract column definitions
- keep render logic minimal
- avoid business logic in cells

---

# Preferred Structure

```txt
booking-table/
  booking-columns.tsx
  booking-toolbar.tsx
  booking-table.tsx
```

---

# Preferred

```tsx
const columns: ColumnDef<Booking>[] = [];
```

---

# Avoid

- inline columns inside page
- giant render functions
- duplicated table logic
