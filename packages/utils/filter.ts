export const filterNulls = <T>(x: T | null): x is T => !!x;
