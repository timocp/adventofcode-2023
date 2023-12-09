import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day3 } from '../src/day3'

const testInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trimStart()

describe('Day3', () => {
  const day = new Day3(testInput)
  it('part1', () => { equal(4361, day.part1()) })
  it('part2', () => { equal(467835, day.part2()) })
})
