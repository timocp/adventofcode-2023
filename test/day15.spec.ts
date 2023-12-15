import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day15, hash } from '../src/day15'

const testInput = 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7\n'

describe('Day15', () => {
  const d = new Day15(testInput)
  it('hash', () => { equal(hash('HASH'), 52) })
  it('part1 example1', () => { equal(d.part1(), 1320) })
})
