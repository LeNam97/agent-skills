---
title: Permission Checks on List Actions
impact: HIGH
impactDescription: Security — hide actions user cannot perform
tags: list, permissions, hasPermissions
---

## Permission Checks on List Actions

Kiểm tra `hasPermissions([PERMISSIONS.X])` trước render row actions và header buttons. Dùng `AddButton`/`ExportButton` với built-in permission prop.

**Incorrect:**

```tsx
<DropdownMenuItem onClick={() => handleDelete(id)}>
  <Trash2 /> Xóa
</DropdownMenuItem>

<Button onClick={() => router.push('/my-entity/create')}>
  Thêm mới
</Button>
```

**Correct:**

```tsx
const { hasPermissions } = useUserStore()

{hasPermissions([PERMISSIONS.MY_MODULE_DELETE]) && (
  <DropdownMenuItem onClick={() => handleDelete(id)} className="text-red-600">
    <Trash2 /> Xóa
  </DropdownMenuItem>
)}

<AddButton
  permission={PERMISSIONS.MY_MODULE_CREATE}
  onClick={() => router.push('/my-entity/create')}
/>
```

