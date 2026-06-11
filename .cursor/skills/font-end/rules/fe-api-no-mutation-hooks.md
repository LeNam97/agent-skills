---
title: No Custom React Query Mutation Hooks
impact: CRITICAL
impactDescription: Simpler data flow; table handles query internally
tags: api, react-query, apiRequest
---

## No Custom React Query Mutation Hooks

CRUD gọi `apiRequest` functions trực tiếp từ `domains/{entity}/service.ts`. **Không** tạo `useMutation`/`useQuery` hooks riêng cho create/update/delete. List table dùng React Query nội bộ qua `useEnhancedTable`.

**Incorrect:**

```tsx
const useCreateMyEntity = () =>
  useMutation({ mutationFn: createMyEntity })

const handleSubmit = async (data) => {
  await useCreateMyEntity().mutateAsync(data)
}
```

**Correct:**

```tsx
// Import từ domain, không từ route-local
import { createMyEntity, getListMyEntity } from '@/domains/my-entity'

const handleSubmit = async (data: FormData) => {
  try {
    setIsLoading(true)
    await createMyEntity(data)
    router.push('/my-entity')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    setIsLoading(false)
  }
}

// List — React Query handled by useEnhancedTable
const { table } = useEnhancedTable({
  queryFn: async state => getListMyEntity({ params: generateQueryParams(state, { columns }) }),
  queryKey: ['my-entity'],
})
```

