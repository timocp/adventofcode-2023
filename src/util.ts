export const sum: (a: number[]) => number = (a: number[]): number => a.reduce((acc, v) => acc + v, 0)

export const product: (a: number[]) => number = (a: number[]): number => a.reduce((acc, v) => acc * v)

export const enumerate: (n: number) => number[] = (n: number): number[] => Array.from(Array(n).keys())

export const gcd: (a: number, b: number) => number = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)

export const lcm: (a: number, b: number) => number = (a: number, b: number): number => a / gcd(a, b) * b

export const lcmAll: (a: number[]) => number = (a: number[]): number => a.reduce(lcm, 1)

export const replaceAt: (s: string, i: number, c: string) =>
string = (s: string, i: number, c: string) => {
  return s.substring(0, i) + c + s.substring(i + 1)
}

export const must = <T>(t: T | undefined): T => {
  if (t === undefined) throw new Error('assertion failed: value undefined')
  return t
}

// Required because in JS "%" is a remainder instead of modulus
export const mod: (n: number, d: number) => number = (n: number, d: number): number => ((n % d) + d) % d
