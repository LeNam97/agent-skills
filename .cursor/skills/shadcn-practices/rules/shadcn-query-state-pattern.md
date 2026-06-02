# Rule: Query State Pattern

## Requirements

- server state -> react-query
- loading state required
- empty state required
- error state required

---

# Preferred

```tsx
if (isLoading) {
  return <Loading />;
}
```

---

# Avoid

- fetch inside useEffect
- duplicated loading logic
- manual caching
