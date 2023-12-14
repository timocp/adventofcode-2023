import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day14 } from '../src/day14'

const testInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`.trimStart()

describe('Day11', () => {
  const d = new Day14(testInput)
  it('part1 example1', () => { equal(d.part1(), 136) })
  it('part2 example1', () => { equal(d.part2(), 64) })
})
