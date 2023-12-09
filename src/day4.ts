import Solution from './solution'
import { sum } from './util'

interface Card {
  num: number
  hits: number
}

export class Day4 extends Solution {
  part1 (): number {
    return sum(this.parseInput().map(card => {
      return card.hits === 0 ? 0 : 2 ** (card.hits - 1)
    }))
  }

  part2 (): number {
    const cards = this.parseInput()
    const cardCount = cards.map(_ => 1)
    cards.forEach((card, i) => {
      for (let c = 1; c <= card.hits; c++) {
        cardCount[i + c] += cardCount[i]
      }
    })
    return sum(cardCount)
  }

  parseInput (): Card[] {
    return this.inputLines().map(line => {
      const m = line.match(/^Card\s+(\d+):\s+(.*)\s+\|\s+(.*)$/)
      if (m === null) throw new Error(`parse error: ${line}`)

      const num = parseInt(m[1])
      const winningNumbers = m[2].split(/\s+/).map(s => parseInt(s))
      const heldNumbers = m[3].split(/\s+/).map(s => parseInt(s))
      const hits = winningNumbers.filter(n => heldNumbers.includes(n)).length

      return { num, hits }
    })
  }
}
