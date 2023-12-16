import Solution from './solution'
import { sum } from './util'

const verticalFold = (grid: string[]): number | undefined => {
  return horizontalFold(grid[0].split('').map((_, i) => grid.map(row => row[i]).join('')))
}

const horizontalFold = (grid: string[]): number | undefined => {
  for (let row = 0; row < grid.length - 1; row++) {
    let found = true
    for (let dy = 0; row - dy >= 0 && row + 1 + dy < grid.length; dy++) {
      if (grid[row - dy] !== grid[row + 1 + dy]) {
        found = false
        break
      }
    }
    if (found) return row + 1
  }
}

const score = (grid: string[]): number => {
  const h = horizontalFold(grid)
  if (h !== undefined) return h * 100
  const v = verticalFold(grid)
  if (v !== undefined) return v
  throw new Error('grid was not foldable')
}

export class Day13 extends Solution {
  part1 = (): number => sum(this.inputParagraphs().map(p => score(p.split('\n'))))

  part2 (): number {
    return 0
  }
}
