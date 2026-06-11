/** Duck-type tối thiểu — tránh phụ thuộc typeorm trong @ac/api-common */
export interface ListQueryBuilderLike {
  andWhere(
    condition: string,
    parameters?: Record<string, unknown>
  ): ListQueryBuilderLike;
}

export type ListFilterCompareType =
  | "eq"
  | "in"
  | "ilike"
  | "gte"
  | "lte"
  | "array-overlap";

export interface ListFilterColumnConfig {
  /** Tên field trong DTO / query params (snake_case) */
  paramKey: string;
  /** Biểu thức cột SQL, vd: `booking.trang_thai` */
  dbColumn: string;
  compare: ListFilterCompareType;
}

export interface ListQueryKeywordConfig {
  /** Mặc định `keyword` */
  paramKey?: string;
  /** Danh sách cột ILIKE, vd: `['booking.ma_dat_cho', 'booking.nguoi_tao']` */
  columns: string[];
}

export interface ListQueryFilterConfig {
  keyword?: ListQueryKeywordConfig;
  columns: ListFilterColumnConfig[];
}

/** Loại trừ bản ghi đã xoá — optional, bật khi cần */
export interface ListQueryExcludeDeletedOptions {
  column: string;
  value: string;
  /** Param bỏ qua exclude, mặc định `include_deleted` */
  unlessParam?: string;
}

/** Scope actor — map param DTO → cột SQL (vd: chủ tàu qua email) */
export interface ListQueryActorScopeOptions {
  paramKey: string;
  dbColumn: string;
}

export interface ApplyListQueryFiltersOptions<T extends object> {
  /** Hook trước apply — logic đặc biệt ngoài config */
  before?: (qb: ListQueryBuilderLike, params: T) => void;
  excludeDeleted?: ListQueryExcludeDeletedOptions;
  actorScope?: ListQueryActorScopeOptions;
}

function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Áp dụng filter danh sách lên QueryBuilder.
 * **Hàm filter duy nhất** — `config` do repository truyền theo spec (không preset trong @ac/api-common).
 */
export function applyListQueryFilters<T extends object>(
  qb: ListQueryBuilderLike,
  params: T,
  config: ListQueryFilterConfig,
  options?: ApplyListQueryFiltersOptions<T>
): void {
  const values = params as Record<string, unknown>;

  options?.before?.(qb, params);

  if (options?.excludeDeleted) {
    const unlessKey = options.excludeDeleted.unlessParam ?? "include_deleted";
    if (!values[unlessKey]) {
      qb.andWhere(`${options.excludeDeleted.column} != :__exclude_deleted`, {
        __exclude_deleted: options.excludeDeleted.value,
      });
    }
  }

  if (options?.actorScope) {
    const scopeValue = values[options.actorScope.paramKey];
    if (scopeValue !== undefined && scopeValue !== null && scopeValue !== "") {
      qb.andWhere(`${options.actorScope.dbColumn} = :${options.actorScope.paramKey}`, {
        [options.actorScope.paramKey]: scopeValue,
      });
    }
  }

  if (config.keyword) {
    const keywordKey = config.keyword.paramKey ?? "keyword";
    const keyword = values[keywordKey];
    if (typeof keyword === "string" && keyword.trim()) {
      const conditions = config.keyword.columns.map(
        (col, i) => `${col} ILIKE :keyword_${i}`
      );
      const bind: Record<string, string> = {};
      config.keyword.columns.forEach((_, i) => {
        bind[`keyword_${i}`] = `%${keyword.trim()}%`;
      });
      qb.andWhere(`(${conditions.join(" OR ")})`, bind);
    }
  }

  for (const col of config.columns) {
    const value = values[col.paramKey];
    if (value === undefined || value === null || value === "") continue;

    const bind = col.paramKey;

    switch (col.compare) {
      case "eq":
        qb.andWhere(`${col.dbColumn} = :${bind}`, { [bind]: value });
        break;

      case "in":
        if (isNonEmptyArray(value)) {
          qb.andWhere(`${col.dbColumn} IN (:...${bind})`, { [bind]: value });
        } else if (!Array.isArray(value)) {
          qb.andWhere(`${col.dbColumn} = :${bind}`, { [bind]: value });
        }
        break;

      case "ilike":
        if (typeof value === "string") {
          qb.andWhere(`${col.dbColumn} ILIKE :${bind}`, {
            [bind]: `%${value}%`,
          });
        }
        break;

      case "gte":
        qb.andWhere(`${col.dbColumn} >= :${bind}`, { [bind]: value });
        break;

      case "lte":
        qb.andWhere(`${col.dbColumn} <= :${bind}`, { [bind]: value });
        break;

      case "array-overlap":
        if (isNonEmptyArray(value)) {
          qb.andWhere(`${col.dbColumn} && :${bind}`, { [bind]: value });
        }
        break;
    }
  }
}
