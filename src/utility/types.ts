// Remove from T keys that are also present in U
export type Remove<T, U> = Omit<T, keyof U>;

// Extracts the element type from an array
export type ArrayElement<T extends any[]> = T extends Array<infer Inner> ? Inner : never;
