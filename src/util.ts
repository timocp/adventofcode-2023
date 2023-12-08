export const sum: (a: number[]) => number = (a: number[]): number => a.reduce((acc, v) => acc + v)

export const product: (a: number[]) => number = (a: number[]): number => a.reduce((acc, v) => acc * v)

export const enumerate: (n: number) => number[] = (n: number): number[] => Array.from(Array(n).keys())

export const gcd: (a: number, b: number) => number = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)

export const lcm: (a: number, b: number) => number = (a: number, b: number): number => a / gcd(a, b) * b

export const lcmAll: (a: number[]) => number = (a: number[]): number => a.reduce(lcm, 1)
