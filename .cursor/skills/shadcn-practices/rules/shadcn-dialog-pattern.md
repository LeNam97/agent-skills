# Rule: shadcn Dialog Pattern

## Requirements

- use Dialog or Sheet from shadcn
- keep dialog state isolated
- avoid nested dialogs
- separate form from dialog wrapper

---

# Preferred Structure

```txt
booking-dialog/
  booking-dialog.tsx
  booking-form.tsx
```

---

# Preferred

```tsx
<Dialog>
  <DialogContent>
    <BookingForm />
  </DialogContent>
</Dialog>
```

---

# Avoid

- huge dialog components
- business logic inside dialog UI
- duplicated modal implementation
