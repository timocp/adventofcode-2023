import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day9 } from '../src/day9'

const testInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trimStart()

describe('Day9', () => {
  const day = new Day9(testInput)
  it('part1', () => { equal(114, day.part1()) })
  it('part2', () => { equal(2, day.part2()) })
})
