import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day2 } from '../src/day2'

const testInput = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`.trimStart()

describe('Day2', () => {
  const day = new Day2(testInput)
  it('part1', () => { equal(8, day.part1()) })
  it('part2', () => { equal(2286, day.part2()) })
})
