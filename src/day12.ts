import Solution from './solution'
import { kCombinations } from './combinations'
import { sum } from './util'

export const arrangements = (s: string): number => {
  const [springs, countsStr] = s.split(' ')
  const counts = countsStr.split(',').map(c => +c)
  const unknown = []
  const known = []
  for (let i = 0; i < springs.length; i++) {
    if (springs[i] === '?') unknown.push(i)
    if (springs[i] === '#') known.push(i)
  }
  const missing = sum(counts) - known.length
  if (missing === 0) return 1
  let a = 0
  kCombinations(unknown, missing).forEach(replace => {
    const newSprings = springs.split('').map((c, i) => {
      if (c === '?') {
        if (replace.includes(i)) {
          return '#'
        } else {
          return '.'
        }
      } else {
        return c
      }
    }).join('')
    if (valid(newSprings, counts)) a++
  })
  return a
}

const valid = (springs: string, counts: number[]): boolean => {
  const newCounts = springs.replace(/^\.+/, '').replace(/\.+$/, '').split(/\.+/).map(s => s.length)
  if (counts.length !== newCounts.length) {
    return false
  }
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] !== newCounts[i]) return false
  }
  return true
}

export class Day12 extends Solution {
  part1 = (): number => sum(this.inputLines().map(line => arrangements(line)))

  part2 (): number {
    return 0
  }
}
