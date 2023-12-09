import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day8 } from '../src/day8'

const testInput1 = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`.trimStart()

const testInput2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`.trimStart()

describe('Day8', () => {
  it('part1 example1', () => { equal(2, (new Day8(testInput1)).part1()) })
  it('part1 example2', () => { equal(6, (new Day8(testInput2)).part1()) })
})
