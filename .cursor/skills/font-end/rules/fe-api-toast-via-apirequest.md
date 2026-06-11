---
title: Toast Messages via apiRequest Options
impact: HIGH
impactDescription: Consistent user feedback without duplicate toasts
tags: api, toast, apiRequest, ux
---

## Toast Messages via apiRequest Options

`apiRequest` tự hiện toast khi có `successMessage`/`errorMessage`. **Không** gọi `toast.success()`/`toast.error()` thủ công sau API call.

**Incorrect:**

```tsx
export function createMyEntity(data, options) {
  return apiRequest({ url: BASE_URL, method: 'POST', payload: data, ...options })
}

const handleSubmit = async (data) => {
  await createMyEntity(data)
  toast.success('Tạo mới thành công')
}
```

**Correct:**

```tsx
// domains/my-entity/service.ts
export function createMyEntity(data: MyEntityPayload, options?: ApiOptions) {
  return apiRequest({
    url: BASE_URL,
    method: 'POST',
    payload: data,
    successMessage: 'Tạo mới thành công',
    errorMessage: 'Lỗi tạo mới',
    ...options,
  })
}

// GET list — không cần successMessage
export function getListMyEntity(options?: ApiOptions) {
  return apiRequest({
    url: BASE_URL,
    method: 'GET',
    errorMessage: 'Lỗi lấy danh sách',
    ...options,
  })
}
```

API functions nằm trong `domains/{entity}/service.ts`, import qua barrel:

```tsx
import { createMyEntity, getListMyEntity } from '@/domains/my-entity'
```

