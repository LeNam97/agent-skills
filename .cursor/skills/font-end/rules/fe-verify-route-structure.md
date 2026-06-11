---
title: Verify Route Structure
impact: HIGH
impactDescription: Audit module file layout against convention before coding
tags: structure, module, audit, verify
---

## Verify Route Structure

Khi được yêu cầu verify/audit cấu trúc route, thực hiện các bước sau:

### Bước 1 — Xác định module path

Xác định đường dẫn module cần verify, ví dụ: `apps/web/app/(admin)/my-entity/`

### Bước 2 — Scan file thực tế

Dùng Glob scan toàn bộ file trong module path đó. Liệt kê dạng tree.

### Bước 3 — So sánh với cấu trúc chuẩn

Cấu trúc mong đợi gồm **2 phần**: route module + domain module.

#### Route module

```
apps/web/app/(module)/{entity-name}/
├── page.tsx                    # Re-export list component
├── {entity-name}.list.tsx      # List + table + filters (useEnhancedTable)
├── fn.ts                       # Status/color helpers (nếu cần)
├── components/                 # Components riêng cho feature
├── create/
│   ├── page.tsx                # Re-export form component
│   └── {entity-name}-form.tsx  # Create form (RHF + Zod)
└── [id]/
    ├── page.tsx                # Detail page
    └── edit/
        └── page.tsx            # Edit page
```

#### Domain module

API endpoints, response types và constants nằm trong `domains/`, **không** nằm trong route.

```
apps/web/domains/{entity-name}/
├── service.ts                  # apiRequest CRUD functions
├── types.ts                    # Response/payload types
├── constants.ts                # Hằng số, enums
└── index.ts                    # Barrel export
```

Quy tắc cho `page.tsx`:

**Incorrect:**

```tsx
// page.tsx chứa logic trực tiếp
export default function Page() {
  const [data, setData] = useState([])
  // ... 200 lines logic
}
```

**Correct:**

```tsx
// page.tsx chỉ re-export
import { MyEntityListPage } from './my-entity.list'
export default function Page() {
  return <MyEntityListPage />
}
```

Quy tắc import API từ domain:

**Incorrect:**

```tsx
// Import từ file api cục bộ trong route
import { getListMyEntity } from './my-entity.api'
```

**Correct:**

```tsx
// Import từ domain module
import { getListMyEntity } from '@/domains/my-entity'
```

### Quy tắc chung

- **Không** tạo file tài liệu (`.md`, `.bak`) trong route hoặc domain module
- **Giữ nguyên** các file dùng chung đã tồn tại (`components/`, `hooks/`, `lib/`, `constants/`, `services/`) — chỉ verify file thuộc entity đang audit

### Bước 4 — Báo cáo

Liệt kê kết quả dạng checklist:

**Route module:**
- ✅ / ❌ `page.tsx` — chỉ re-export, không logic
- ✅ / ❌ `{entity}.list.tsx` — tồn tại, dùng useEnhancedTable
- ✅ / ❌ `fn.ts` — tồn tại nếu module có status/enum helpers
- ✅ / ❌ `create/page.tsx` — re-export form
- ✅ / ❌ `[id]/page.tsx` — detail page
- ✅ / ❌ `[id]/edit/page.tsx` — edit page
- ⚠️ Không có `{entity}.api.ts` trong route (phải nằm ở domains/)
- ⚠️ File thừa hoặc đặt sai chỗ (`.md`, `.bak`, v.v.)

**Domain module (`domains/{entity}/`):**
- ✅ / ❌ `service.ts` — apiRequest CRUD functions
- ✅ / ❌ `types.ts` — response/payload types
- ✅ / ❌ `constants.ts` — hằng số, enums
- ✅ / ❌ `index.ts` — barrel export
