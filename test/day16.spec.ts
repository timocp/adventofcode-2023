import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day16, hash } from '../src/day16'

const testInput = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`.trimStart()

describe('Day16', () => {
  const d = new Day16(testInput)
  it('part1 example1', () => { equal(d.part1(), 46) })
})
