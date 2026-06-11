---
title: next-intl for Internationalization
impact: MEDIUM
impactDescription: Vietnamese and English support across admin UI
tags: i18n, next-intl, localization
---

## next-intl for Internationalization

Dùng `useTranslations()` hook. Messages trong `apps/web/messages/{domain}/{locale}.json`. Hỗ trợ `vi` và `en`.

**Incorrect:**

```tsx
<Button>Thêm mới</Button>
<span>Status: Active</span>
```

**Correct:**

```tsx
import { useTranslations } from 'next-intl'

const t = useTranslations('MyEntity')

<Button>{t('actions.create')}</Button>
<span>{t('status.active')}</span>
```

Label action trong list page có thể hardcode tiếng Việt theo convention hiện tại (Xem chi tiết, Chỉnh sửa, Xóa) — ưu tiên i18n cho text lặp lại nhiều module.

