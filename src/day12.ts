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

const countArrangements = (row: Row): number => {
  const key = rowToString(row)
  const debug = false

  if (row.s.length === 0) {
    if (row.c.length === 0) {
      if (debug) console.log(key, '-> 1 (row and counts are both empty)')
      return 1
    } else {
      if (debug) console.log(key, '-> 0 (row is empty but counts remain)')
      return 0
    }
  } else if (row.c.length === 0) {
    if (row.s.includes('#')) {
      if (debug) console.log(key, '-> 0 (counts empty but at least one broken remains)')
      return 0
    } else {
      if (debug) console.log(key, '-> 1 (counts empty and no broken remains)')
      return 1
    }
  }
  const s0 = row.s[0]
  const c0 = row.c[0]
  switch (s0) {
    case '.':
    {
      const r = countArrangements({ s: row.s.substring(1), c: row.c })
      if (debug) console.log(key, `-> ${r}`)
      return r
    }
    case '?':
    {
      const a = countArrangements({ s: `.${row.s.substring(1)}`, c: row.c })
      const b = countArrangements({ s: `#${row.s.substring(1)}`, c: row.c })
      const r = a + b
      if (debug) console.log(key, `-> ${a} + ${b} -> ${r}`)
      return r
    }
    case '#':
    {
      if (row.s.length < c0) {
        if (debug) console.log(key, '-> 0 (remaining blocks not big enough)')
        return 0
      }
      if (row.s.substring(0, c0).includes('.')) {
        if (debug) console.log(key, `-> 0 (leading block can't be of size ${c0})`)
        return 0
      }
      if (row.s[c0] === '#') {
        if (debug) console.log(key, '-> 0 (leading block is too big)')
        return 0
      }
      const r = countArrangements({ s: row.s.substring(c0 + 1), c: row.c.filter((_, i) => i > 0) })
      if (debug) console.log(key, `-> ${r}`)
      return r
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

  part2 = (): number => 0
}
