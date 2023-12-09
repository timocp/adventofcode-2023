import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day6 } from '../src/day6'

const testInput = `
Time:      7  15   30
Distance:  9  40  200
`.trimStart()

describe('Day6', () => {
  const day = new Day6(testInput)
  it('part1', () => { equal(288, day.part1()) })
  it('part2', () => { equal(71503, day.part2()) })
})
