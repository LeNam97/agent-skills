---
title: Edit and Detail Load via useEffect
impact: HIGH
impactDescription: Consistent data loading without extra query hooks
tags: form, edit, detail, useEffect
---

## Edit and Detail Load via useEffect

Edit/detail pages load data bằng `useEffect` + API function trực tiếp. **Không** dùng React Query hooks (`useQuery`).

**Incorrect:**

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['my-entity', id],
  queryFn: () => getMyEntityById(id),
})
```

**Correct:**

```tsx
const [data, setData] = useState<MyEntity | null>(null)
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const result = await getMyEntityById(params.id)
      setData(result.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [params.id])

if (isLoading) return <div>Đang tải...</div>
```

