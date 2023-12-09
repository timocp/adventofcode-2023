import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day1 } from '../src/day1'

const testInput1 = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`.trimStart()

const testInput2 = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`.trimStart()

describe('Day1', () => {
  it('part1', () => { equal(142, (new Day1(testInput1)).part1()) })
  it('part2', () => { equal(281, (new Day1(testInput2)).part2()) })
})
