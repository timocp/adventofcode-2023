import Solution from './solution'
import { sum } from './util'

export class Day9 extends Solution {
  part1 (): number {
    return sum(this.parseInput().map(data => this.nextValue(data)))
  }

  part2 (): number {
    return sum(this.parseInput().map(data => this.prevValue(data)))
  }

  nextValue (data: number[]): number {
    const diffs = data.slice(1).map((v, i) => v - data[i])
    if (diffs.every(v => v === 0)) {
      return data[data.length - 1] + diffs[0]
    } else {
      return data[data.length - 1] + this.nextValue(diffs)
    }
  }

  prevValue (data: number[]): number {
    const diffs = data.slice(1).map((v, i) => v - data[i])
    if (diffs.every(v => v === 0)) {
      return data[0] - diffs[0]
    } else {
      return data[0] - this.prevValue(diffs)
    }
  }

  parseInput (): number[][] {
    return this.inputLines().map(line => line.split(' ').map(n => +n))
  }
}

(new Day9()).solve()
