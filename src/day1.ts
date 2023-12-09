import Solution from './solution'
import { sum } from './util'

export class Day1 extends Solution {
  part1 = (): number => sum(this.inputLines().map(line => this.calibrationValue(line)))

  part2 = (): number => sum(this.inputLines().map(line => this.calibrationValue2(line)))

  calibrationValue (str: string): number {
    const digits = str.split('').filter(c => c >= '0' && c <= '9').map(c => +c)
    return (digits.at(0) ?? 0) * 10 + (digits.at(-1) ?? 0)
  }

  words: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
  }

  calibrationValue2 (str: string): number {
    const digits: number[] = []
    for (let i = 0; i < str.length; i++) {
      if (str[i] >= '0' && str[i] <= '9') {
        digits.push(+str[i])
      } else {
        Object.keys(this.words).forEach((word) => {
          if (str.substring(i, i + word.length) === word) {
            digits.push(this.words[word])
          }
        })
      }
    }
    return (digits.at(0) ?? 0) * 10 + (digits.at(-1) ?? 0)
  }
}
