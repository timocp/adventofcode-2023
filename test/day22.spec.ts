import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day22 } from '../src/day22'

const example1 = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`.trimStart()

describe('Day22', () => {
  const d1 = new Day22(example1)
  it('part1 example1', () => { equal(d1.part1(), 5) })
})
