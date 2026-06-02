# Rule: shadcn Form Pattern

## Requirements

- use react-hook-form
- use shadcn Form components
- validation via zod/yup
- keep form schema separated

---

# Preferred Structure

```txt
booking-form/
  booking-form.tsx
  booking-form.schema.ts
  booking-form.types.ts
```

---

# Preferred

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>

      <FormControl>
        <Input {...field} />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>
```

---

# Avoid

- large uncontrolled forms
- duplicated validation
- inline validation logic
- manual error rendering
