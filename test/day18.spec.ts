import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day18 } from '../src/day18'

const testInput = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`.trimStart()

describe('Day18', () => {
  const d = new Day18(testInput)
  it('part1 example1', () => { equal(d.part1(), 62) })
  it('part2 example1', () => { equal(d.part2(), 952408144115) })
})
