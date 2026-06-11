# Sections

## 1. List Page (fe-list)

**Impact:** CRITICAL  
**Description:** TanStack Table via useEnhancedTable, column layout, client components, permissions on actions.

## 2. API Client (fe-api)

**Impact:** CRITICAL  
**Description:** apiRequest functions, no custom React Query mutation hooks, toast via apiRequest options.

## 3. Form (fe-form)

**Impact:** HIGH  
**Description:** React Hook Form + Zod, direct API calls, useEffect for edit/detail data loading.

## 4. Filter (fe-filter)

**Impact:** HIGH  
**Description:** combobox for advanced position, select for default position; debounceMs 300 for text.

## 5. Component & Import (fe-ui)

**Impact:** MEDIUM  
**Description:** @workspace/ui first, file naming, Tailwind + cn(), Server vs Client components.

## 6. Auth & i18n (fe-auth, fe-i18n)

**Impact:** MEDIUM  
**Description:** hasPermissions checks, next-intl Vietnamese/English messages.
