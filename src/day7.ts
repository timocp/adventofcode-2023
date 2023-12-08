import Solution from './solution'
import { sum } from './util'

enum Type {
  fiveOfAKind,
  fourOfAKind,
  fullHouse,
  threeOfAKind,
  twoPair,
  onePair,
  highCard
}

const faceValue: Record<string, number> = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

class Hand {
  cards: string
  values: number[]
  bid: number

  type: Type

  constructor (cards: string, bid: number) {
    if (cards.length !== 5) throw new Error(`Expected 5 cards, got ${cards}`)
    this.cards = cards
    this.values = cards.split('').map(card => faceValue[card])
    this.bid = bid

    const histogram = new Map<number, number>()
    this.values.forEach(v => {
      histogram.set(v, (histogram.get(v) ?? 0) + 1)
    })
    const entries = Array.from(histogram.entries())
    if (histogram.size === 1) {
      this.type = Type.fiveOfAKind
    } else if (histogram.size === 2 && entries.some(e => e[1] === 4)) {
      this.type = Type.fourOfAKind
    } else if (histogram.size === 2 && entries.some(e => e[1] === 3)) {
      this.type = Type.fullHouse
    } else if (histogram.size === 3 && entries.some(e => e[1] === 3)) {
      this.type = Type.threeOfAKind
    } else if (histogram.size === 3 && entries.some(e => e[1] === 2)) {
      this.type = Type.twoPair
    } else if (histogram.size === 4 && entries.some(e => e[1] === 2)) {
      this.type = Type.onePair
    } else if (histogram.size === 5) {
      this.type = Type.highCard
    } else {
      throw new Error(`Unmapped cards: ${cards}`)
    }
  }
}

// return negative if a < b, positive if a > b, zero if a = b
const cmpCards = (a: Hand, b: Hand): number => {
  if (a.type !== b.type) {
    return b.type - a.type
  }
  for (let i = 0; i < 5; i++) {
    if (a.values[i] !== b.values[i]) return a.values[i] - b.values[i]
  }
  return 0 // unreachable in input data
}

export class Day7 extends Solution {
  part1 (): number {
    const hands = this.parseInput()
    hands.sort(cmpCards)
    // hands.forEach((h, rank) => { console.log(`${h.cards} (${h.type}) is rank ${rank + 1}`) })
    return sum(hands.map((h, rank) => h.bid * (rank + 1)))
  }

  part2 (): number {
    return 0
  }

  parseInput (): Hand[] {
    return this.inputLines().map(line => {
      const [cards, bid] = line.split(' ')
      return new Hand(cards, +bid)
    })
  }
}

(new Day7()).solve()
