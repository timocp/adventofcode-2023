import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day10 } from '../src/day10'

const testInput1 = `
.....
.S-7.
.|.|.
.L-J.
.....
`.trimStart()

const testInput2 = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trimStart()

describe('Day10', () => {
  const d1 = new Day10(testInput1)
  const d2 = new Day10(testInput2)
  it('part1 example1', () => { equal(4, d1.part1()) })
  it('part1 example2', () => { equal(8, d2.part1()) })
})
