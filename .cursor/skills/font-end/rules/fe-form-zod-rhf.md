---
title: React Hook Form with Zod Validation
impact: HIGH
impactDescription: Type-safe forms with consistent validation messages
tags: form, zod, react-hook-form, validation
---

## React Hook Form with Zod Validation

Form dùng `useForm` + `zodResolver(formSchema)`. UI components từ `@workspace/ui/mi`. Gọi API trực tiếp trong `onSubmit`.

**Incorrect:**

```tsx
const [name, setName] = useState('')
const handleSubmit = () => {
  if (!name) alert('Required')
  createMyEntity({ name })
}
```

**Correct:**

```tsx
const formSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(255),
  code: z.string().min(1, 'Mã không được để trống').max(50),
})

type FormData = z.infer<typeof formSchema>

const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { name: '', code: '' },
})

const onSubmit = async (data: FormData) => {
  try {
    setIsLoading(true)
    await createMyEntity(data)
    onSuccess?.()
  } finally {
    setIsLoading(false)
  }
}
```

