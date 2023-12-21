import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day21 } from '../src/day21'

const example1 = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`.trimStart()

describe('Day21', () => {
  const d1 = new Day21(example1)
  it('part1 example1 steps=1', () => { equal(d1.part1(1), 2) })
  it('part1 example1 steps=2', () => { equal(d1.part1(2), 4) })
  it('part1 example1 steps=3', () => { equal(d1.part1(3), 6) })
  it('part1 example1 steps=6', () => { equal(d1.part1(6), 16) })
})
