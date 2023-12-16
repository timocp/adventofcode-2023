import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day13 } from '../src/day13'

const testInput = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trimStart()

describe('Day13', () => {
  const d = new Day13(testInput)
  it('part1', () => { equal(d.part1(), 405) })
  it('part2', () => { equal(d.part2(), 400) })
})
