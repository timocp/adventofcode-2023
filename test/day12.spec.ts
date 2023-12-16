import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day12, arrangements, unfold } from '../src/day12'

const testInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trimStart()

describe('unfold', () => {
  it('unfold 1', () => { equal(unfold('.# 1'), '.#?.#?.#?.#?.# 1,1,1,1,1') })
  it('unfold 2', () => { equal(unfold('???.### 1,1,3'), '???.###????.###????.###????.###????.### 1,1,3,1,1,3,1,1,3,1,1,3,1,1,3') })
})

describe('arrangements', () => {
  it('arrangements 1', () => { equal(arrangements('???.### 1,1,3'), 1) })
  it('arrangements 2', () => { equal(arrangements('.??..??...?##. 1,1,3'), 4) })
  it('arrangements 3', () => { equal(arrangements('?#?#?#?#?#?#?#? 1,3,1,6'), 1) })
  it('arrangements 4', () => { equal(arrangements('????.#...#... 4,1,1'), 1) })
  it('arrangements 5', () => { equal(arrangements('????.######..#####. 1,6,5'), 4) })
  it('arrangements 6', () => { equal(arrangements('?###???????? 3,2,1'), 10) })
  it('arrangements 7', () => { equal(arrangements('?##??.?#?? 2,1'), 1) })
  it('arrangements 8', () => { equal(arrangements('##?#?#?? 2,6'), 0) })
  it('arrangements folded 1', () => { equal(arrangements(unfold('???.### 1,1,3')), 1) })
  it('arrangements folded 2', () => { equal(arrangements(unfold('.??..??...?##. 1,1,3')), 16384) })
  it('arrangements folded 3', () => { equal(arrangements(unfold('?#?#?#?#?#?#?#? 1,3,1,6')), 1) })
  it('arrangements folded 4', () => { equal(arrangements(unfold('????.#...#... 4,1,1')), 16) })
  it('arrangements folded 5', () => { equal(arrangements(unfold('????.######..#####. 1,6,5')), 2500) })
  it('arrangements folded 6', () => { equal(arrangements(unfold('?###???????? 3,2,1')), 506250) })
})

describe('Day12', () => {
  const d = new Day12(testInput)
  it('part1', () => { equal(d.part1(), 21) })
})
