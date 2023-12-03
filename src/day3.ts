import { readFileSync } from 'node:fs'

const input = readFileSync('input/day3.txt', 'utf8').trimEnd().split(/\n/)

class Schematic {
  grid: string[]
  height: number
  width: number

  constructor (input: string[]) {
    this.grid = input
    this.height = this.grid.length
    this.width = this.grid[0].length
  }

  at (row: number, col: number): string {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
      return ''
    }
    return this.grid[row][col]
  }

  numberAt (row: number, col: number): number | undefined {
    if (!this.isNumeric(row, col - 1) && this.isNumeric(row, col)) {
      let num = +this.at(row, col)
      for (let dx = 1; col + dx < this.width; dx++) {
        if (!this.isNumeric(row, col + dx)) break
        num *= 10
        num += +this.at(row, col + dx)
      }
      return num
    } else {
      return undefined
    }
  }

  isNumeric (row: number, col: number): boolean {
    const c = this.at(row, col)
    return c >= '0' && c <= '9'
  }

  isSymbol (row: number, col: number): boolean {
    const c = this.at(row, col)
    return c !== '' && c !== '.' && !(c >= '0' && c <= '9')
  }

  containsSymbol (startRow: number, numRows: number, startCol: number, numCols: number): boolean {
    for (let row = startRow; row < startRow + numRows; row++) {
      for (let col = startCol; col < startCol + numCols; col++) {
        if (this.isSymbol(row, col)) return true
      }
    }
    return false
  }

  part1 (): number {
    let sum = 0
    // detect each number then check if it adjacent to a symbol
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const num = this.numberAt(row, col)
        if (num === undefined) continue
        const numWidth = num.toString().length
        if (this.containsSymbol(row - 1, 3, col - 1, numWidth + 2)) {
          sum += num
        }
      }
    }
    return sum
  }
}

const schematic = new Schematic(input)

console.log('Day 03, Part 1', schematic.part1())
