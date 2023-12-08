export const sum: (a: number[]) => number = (a: number[]): number => a.reduce((acc, v) => acc + v)

export const product: (a: number[]) => number = (a: number[]): number => a.reduce((acc, v) => acc * v)

export const enumerate: (n: number) => number[] = (n: number): number[] => Array.from(Array(n).keys())
