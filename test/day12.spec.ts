import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day12, arrangements } from '../src/day12'

const testInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trimStart()

describe('Day12', () => {
  const d = new Day12(testInput)
  it('arrangements example 1', () => { equal(arrangements('???.### 1,1,3'), 1) })
  it('arrangements example 2', () => { equal(arrangements('.??..??...?##. 1,1,3'), 4) })
  it('arrangements example 3', () => { equal(arrangements('?#?#?#?#?#?#?#? 1,3,1,6'), 1) })
  it('arrangements example 4', () => { equal(arrangements('????.#...#... 4,1,1'), 1) })
  it('arrangements example 5', () => { equal(arrangements('????.######..#####. 1,6,5'), 4) })
  it('arrangements example 6', () => { equal(arrangements('?###???????? 3,2,1'), 10) })
  it('arrangements example 7', () => { equal(arrangements('?##??.?#?? 2,1'), 1) })
  it('part1 example1', () => { equal(d.part1(), 21) })
})
