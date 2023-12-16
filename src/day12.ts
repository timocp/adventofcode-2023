import Solution from './solution'
import { sum } from './util'

export const unfold = (line: string): string => {
  const [s, c] = line.split(' ')
  return `${s}?${s}?${s}?${s}?${s} ${c},${c},${c},${c},${c}`
}

interface Row {
  s: string
  c: number[]
}

const rowToString = (row: Row): string => `${row.s} ${row.c.join(',')}`

const cache: Record<string, number> = {}

const store = (k: string, v: number): number => {
  cache[k] = v
  return v
}

const countArrangements = (row: Row): number => {
  const key = rowToString(row)
  if (cache[key] !== undefined) return cache[key]

  if (row.s.length === 0) {
    if (row.c.length === 0) {
      return store(key, 1)
    } else {
      return store(key, 0)
    }
  } else if (row.c.length === 0) {
    if (row.s.includes('#')) {
      return store(key, 0)
    } else {
      return store(key, 1)
    }
  }
  const s0 = row.s[0]
  const c0 = row.c[0]
  switch (s0) {
    case '.':
      return store(key, countArrangements({ s: row.s.substring(1), c: row.c }))
    case '?':
      return store(
        key,
        countArrangements({ s: `.${row.s.substring(1)}`, c: row.c }) +
        countArrangements({ s: `#${row.s.substring(1)}`, c: row.c })
      )
    case '#':
    {
      if (row.s.length < c0) return store(key, 0)
      if (row.s.substring(0, c0).includes('.')) return store(key, 0)
      if (row.s[c0] === '#') return store(key, 0)
      return store(key, countArrangements({ s: row.s.substring(c0 + 1), c: row.c.filter((_, i) => i > 0) }))
    }
  }
  throw new Error(`Unhandled case: ${key}`)
}

export const arrangements = (s: string): number => {
  const [springs, counts] = s.split(' ')
  return countArrangements({ s: springs, c: counts.split(',').map(c => +c) })
}

export class Day12 extends Solution {
  part1 = (): number => sum(this.inputLines().map(line => arrangements(line)))

  part2 = (): number => sum(this.inputLines().map(line => arrangements(unfold(line))))
}
