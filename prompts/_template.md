---
title: Tên prompt (vd. Review full-stack feature X)
mode: implement # implement | review | refactor | fix | created
skills:
  - vercel-react-best-practices # bỏ dòng nếu không cần
  - backend-best-practices # bỏ dòng nếu không cần
---

# [Tên task]

> **Cách chạy:** Trong Cursor Agent chat, gõ:
>
> ```
> @.agents/prompts/ten-file.md
> Thực hiện toàn bộ yêu cầu trong file prompt này.
> ```

## Skills áp dụng

Agent **phải đọc** các skill sau trước khi làm việc:

- [vercel-react-best-practices](../skills/vercel-react-best-practices/SKILL.md) — frontend React/Next.js
- [backend-best-practices](../skills/backend-best-practices/SKILL.md) — backend Node.js

<!-- Chỉ dùng 1 skill? Xóa dòng không cần. Chỉ định rule cụ thể (tùy chọn):
- [async-parallel](../skills/vercel-react-best-practices/rules/async-parallel.md)
- [db-parameterized-queries](../skills/backend-best-practices/rules/db-parameterized-queries.md)
-->

## Bối cảnh

Mô tả ngắn feature / vấn đề / lý do cần làm:

- ...
- ...

## Phạm vi file

| Layer    | File / thư mục | Ghi chú |
| -------- | -------------- | ------- |
| Frontend | `src/...`      |         |
| Backend  | `src/...`      |         |
| Khác     |                |         |

**Không sửa** (nếu có): liệt kê file/folder out of scope.

## Yêu cầu

### Frontend (nếu có)

- [ ] ...
- [ ] ...

### Backend (nếu có)

- [ ] ...
- [ ] ...

## Ràng buộc

- Giữ nguyên API contract hiện có (nếu có)
- Không thêm dependency mới trừ khi ghi rõ lý do
- ...

## Đầu ra mong đợi

Agent trả về:

1. **Tóm tắt** — đã làm gì, theo skill/rule nào
2. **Thay đổi code** — implement trực tiếp (không chỉ gợi ý)
3. **Vi phạm còn lại** (nếu review) — bảng: file | rule | mức độ | đề xuất

## Tiêu chí hoàn thành

- [ ] Code tuân thủ skill đã chọn
- [ ] Không hardcode secret (`security-no-secrets-in-code`)
- [ ] Error handling nhất quán (`error-centralized-handler`) — backend
- [ ] Không waterfall I/O không cần thiết (`async-parallel`) — frontend/backend
- [ ] ...
