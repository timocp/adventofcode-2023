import { readFileSync } from 'node:fs'

type Result = number | string | undefined

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

  public abstract part1 (): Result

  public abstract part2 (): Result

  public solve (): void {
    this.run(1, () => this.part1())
    this.run(2, () => this.part2())
  }

  run (part: number, f: () => Result): void {
    process.stdout.write(`Day ${this.dayNumber.toString().padStart(2)}, Part ${part} `)
    const t0 = new Date()
    const result = f()
    const dt = ((new Date()).getTime() - t0.getTime()) / 1000
    process.stdout.write(`[${dt.toFixed(1).padStart(4)}s] `)
    console.log(result)
  }
}

export default Solution
