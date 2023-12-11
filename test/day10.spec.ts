import { equal } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Day10 } from '../src/day10'

const testInput1 = `
.....
.S-7.
.|.|.
.L-J.
.....
`.trimStart()

const testInput2 = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trimStart()

const testInput3 = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`.trimStart()

const testInput4 = `
..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........
`.trimStart()

const testInput5 = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`.trimStart()

const testInput6 = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`.trimStart()

describe('Day10', () => {
  const d1 = new Day10(testInput1)
  const d2 = new Day10(testInput2)
  it('part1 example1', () => { equal(4, d1.part1()) })
  it('part1 example2', () => { equal(8, d2.part1()) })

  const d3 = new Day10(testInput3)
  const d4 = new Day10(testInput4)
  const d5 = new Day10(testInput5)
  const d6 = new Day10(testInput6)
  it('part2 example3', () => { equal(4, d3.part2()) })
  it('part2 example4', () => { equal(4, d4.part2()) })
  it('part2 example5', () => { equal(8, d5.part2()) })
  it('part2 example6', () => { equal(10, d6.part2()) })
})
