export function useMounted(): boolean {
  return typeof window !== "undefined";
}
