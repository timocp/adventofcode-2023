import { Day5 } from './day5'
import { Day6 } from './day6'
import { Day7 } from './day7'
import { Day8 } from './day8'
import { Day9 } from './day9'

const days = [new Day5(), new Day6(), new Day7(), new Day8(), new Day9()]

days.forEach(day => { day.solve() })
