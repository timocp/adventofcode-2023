import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day17 } from '../src/day17'

const testInput = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`.trimStart()

describe('Day17', () => {
  const d = new Day17(testInput)
  it('part1 example1', () => { equal(d.part1(), 102) })
})
