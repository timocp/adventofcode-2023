import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day11 } from '../src/day11'

const testInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trimStart()

describe('Day11', () => {
  const d = new Day11(testInput)
  it('part1 example1', () => { equal(d.part1(), 374) })
  it('part2 example1', () => { equal(d.part2(10 - 1), 1030) })
  it('part2 example1', () => { equal(d.part2(100 - 1), 8410) })
})