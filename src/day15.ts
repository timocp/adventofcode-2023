import Solution from './solution'
import { sum } from './util'

export const hash = (s: string): number => {
  return s.split('').map(c => c.charCodeAt(0)).reduce((acc, v) => ((acc + v) * 17) % 256, 0)
}

export class Day15 extends Solution {
  part1 = (): number => sum(this.inputLines()[0].split(',').map(instr => hash(instr)))

  part2 (): number {
    return 0
  }
}
