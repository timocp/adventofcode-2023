import { Day1 } from './day1'
import { Day2 } from './day2'
import { Day3 } from './day3'
import { Day4 } from './day4'
import { Day5 } from './day5'
import { Day6 } from './day6'
import { Day7 } from './day7'
import { Day8 } from './day8'
import { Day9 } from './day9'
import { Day10 } from './day10'
import { Day11 } from './day11'
import { Day12 } from './day12'
import { Day13 } from './day13'
import { Day14 } from './day14'
import { Day15 } from './day15'
import { Day16 } from './day16'
import { Day17 } from './day17'
import { Day18 } from './day18'
import { Day19 } from './day19'
import { Day20 } from './day20'

const classes = [
  Day1, Day2, Day3, Day4, Day5, Day6, Day7, Day8, Day9, Day10,
  Day11, Day12, Day13, Day14, Day15, Day16, Day17, Day18, Day19,
  Day20
]

if (process.argv[2] !== undefined) {
  const dayNumber = parseInt(process.argv[2])
  const Klass = classes[dayNumber - 1]
  if (Klass === undefined) {
    console.error(`Day ${dayNumber} is unimplemented`)
    process.exit(1)
  }
  (new Klass()).solve()
} else {
  classes.forEach(Klass => { (new Klass()).solve() })
}
