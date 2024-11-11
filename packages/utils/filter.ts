export const filterNulls = <T>(x: T | null): x is T => !!x;
export const filterUndefineds = <T>(x: T | undefined): x is T => !!x;
