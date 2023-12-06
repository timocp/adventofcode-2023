import { readFileSync } from 'node:fs'

abstract class Solution {
  private readonly dayNumber: number
  private readonly rawInput: string

  constructor (rawInput?: string) {
    this.dayNumber = parseInt(this.constructor.name.match(/^Day(\d+)$/)?.[1] ?? '0')
    if (rawInput === undefined) {
      this.rawInput = readFileSync(`input/day${this.dayNumber}.txt`, 'utf8')
    } else {
      this.rawInput = rawInput
    }
  }

  input = (): string => this.rawInput

  inputLines = (): string[] => this.rawInput.trimEnd().split(/\n/)

  inputParagraphs = (): string[] => this.rawInput.trimEnd().split(/\n\n/)

  public abstract part1 (): string | number

  public abstract part2 (): string | number

  public solve (): void {
    console.log(`Day ${this.dayNumber}, Part 1`, this.part1())
    console.log(`Day ${this.dayNumber}, Part 2`, this.part2())
  }
}

export default Solution
