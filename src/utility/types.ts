// Remove from T keys that are also present in U
export type Remove<T, U> = Omit<T, keyof U>;
