import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day20 } from '../src/day20'

const example1 = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`.trimStart()

const example2 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`.trimStart()

describe('Day20', () => {
  const d1 = new Day20(example1)
  const d2 = new Day20(example2)
  it('part1 example1', () => { equal(d1.part1(), 32000000) })
  it('part1 example2', () => { equal(d2.part1(), 11687500) })
  it('part1 example2 press1', () => { equal(d2.part1(1), 4 * 4) })
  it('part1 example2 press1', () => { equal(d2.part1(4), 17 * 11) })
})
