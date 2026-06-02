---
title: Permission Constants in @workspace/permissions
impact: HIGH
impactDescription: Centralized, typed permission keys per product module
tags: auth, permissions, rbac
---

## Permission Constants in @workspace/permissions

Permission key định nghĩa tập trung theo module PM (PM01, PM02…), dạng `SCREAMING_SNAKE`, export `as const`.

**Incorrect (string literal rải rác):**

```typescript
if (user.permissions.includes("view_booking")) { /* ... */ }
if (user.permissions.includes("VIEW_BOOKING")) { /* ... */ }
```

**Correct (theo `pm1.permission.ts`):**

```typescript
export const PM01_QUAN_LY_BOOKING = {
  VIEW_BOOKING: "VIEW_BOOKING",
  UPDATE_BOOKING: "UPDATE_BOOKING",
  BOOKING_CREATE: "BOOKING_CREATE",
  DELETE_BOOKING: "DELETE_BOOKING",
  BOOKING_APPROVAL: "BOOKING_APPROVAL",
} as const;

export const PM01_PERMISSION = {
  ...PM01_DASHBOARD,
  ...PM01_QUAN_LY_BOOKING,
  // ...
} as const;
```

Runtime check dùng `isAllowed(path, permissions)` từ `@ac/api-utils` (wildcard `*` support).

Reference: `demo/packages/permissions/src/permissions/pm1.permission.ts`, `demo/packages/api-utils/src/lib/check_permissions.ts`
