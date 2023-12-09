import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day7 } from '../src/day7'

const testInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trimStart()

describe('Day7', () => {
  const day = new Day7(testInput)
  it('part1', () => { equal(6440, day.part1()) })
  it('part2', () => { equal(5905, day.part2()) })
})
