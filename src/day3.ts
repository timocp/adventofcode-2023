import Solution from './solution'
import { product } from './util'

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

  isGear = (row: number, col: number): boolean => this.at(row, col) === '*'

  cellNumber = (row: number, col: number): number => row * this.width + col

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

  part2 (): number {
    // index of gears (by position) and array of adjacent numbers
    const gears: Record<number, number[]> = {}

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const num = this.numberAt(row, col)
        if (num === undefined) continue
        const numWidth = num.toString().length
        for (let r = row - 1; r < row + 2; r++) {
          for (let c = col - 1; c < col + 1 + numWidth; c++) {
            if (this.isGear(r, c)) {
              const gearNumber = this.cellNumber(r, c)
              if (gearNumber in gears) {
                gears[gearNumber].push(num)
              } else {
                gears[gearNumber] = [num]
              }
            }
          }
        }
      }
    }

    let sum = 0
    for (const gearNumber in gears) {
      if (gears[gearNumber].length > 1) {
        sum += product(gears[gearNumber])
      }
    }

    return sum
  }
}

export class Day3 extends Solution {
  part1 = (): number => (new Schematic(this.inputLines())).part1()

  part2 = (): number => (new Schematic(this.inputLines())).part2()
}
