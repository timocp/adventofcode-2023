import Solution from './solution'
import { sum } from './util'

const verticalFold = (grid: string[], smudge: boolean): number | undefined => {
  return horizontalFold(grid[0].split('').map((_, i) => grid.map(row => row[i]).join('')), smudge)
}

const horizontalFold = (grid: string[], smudge: boolean): number | undefined => {
  for (let row = 0; row < grid.length - 1; row++) {
    let found = true
    let smudgeCount = 0
    for (let dy = 0; row - dy >= 0 && row + 1 + dy < grid.length; dy++) {
      const a = grid[row - dy]
      const b = grid[row + 1 + dy]
      if (smudge) {
        const diff = a.split('').filter((c, i) => c !== b[i]).length
        if (diff === 1 && smudgeCount === 0) {
          smudgeCount++
        } else if (diff > 1) {
          found = false
          break
        }
      } else {
        if (a !== b) {
          found = false
          break
        }
      }
    }
    if (smudge && smudgeCount !== 1) found = false
    if (found) return row + 1
  }
}

const score = (grid: string[], smudge: boolean): number => {
  const h = horizontalFold(grid, smudge)
  if (h !== undefined) return h * 100
  const v = verticalFold(grid, smudge)
  if (v !== undefined) return v
  throw new Error('grid was not foldable')
}

export class Day13 extends Solution {
  part1 = (): number => sum(this.inputParagraphs().map(p => score(p.split('\n'), false)))

  part2 = (): number => sum(this.inputParagraphs().map(p => score(p.split('\n'), true)))
}
