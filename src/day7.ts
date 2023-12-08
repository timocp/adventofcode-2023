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

  constructor (cards: string, bid: number, jokerRule: boolean) {
    if (cards.length !== 5) throw new Error(`Expected 5 cards, got ${cards}`)
    this.cards = cards
    this.values = cards.split('').map(card => faceValue[card])
    this.bid = bid
    if (jokerRule) {
      this.type = calcJokerType(this.values)
      // transform jokers to a low value so they lose any face comparison
      this.values = this.values.map(v => v === faceValue.J ? 1 : v)
    } else {
      this.type = calcType(this.values)
    }
  }
}

const calcType = (values: number[]): Type => {
  const histogram = new Map<number, number>()
  values.forEach(v => {
    histogram.set(v, (histogram.get(v) ?? 0) + 1)
  })
  const entries = Array.from(histogram.entries())
  if (histogram.size === 1) {
    return Type.fiveOfAKind
  } else if (histogram.size === 2 && entries.some(e => e[1] === 4)) {
    return Type.fourOfAKind
  } else if (histogram.size === 2 && entries.some(e => e[1] === 3)) {
    return Type.fullHouse
  } else if (histogram.size === 3 && entries.some(e => e[1] === 3)) {
    return Type.threeOfAKind
  } else if (histogram.size === 3 && entries.some(e => e[1] === 2)) {
    return Type.twoPair
  } else if (histogram.size === 4 && entries.some(e => e[1] === 2)) {
    return Type.onePair
  } else if (histogram.size === 5) {
    return Type.highCard
  } else {
    throw new Error(`Unmapped cards: ${values.join(',')}`)
  }
}

const calcJokerType = (values: number[]): Type => {
  let type = calcType(values)
  if (values.some(v => v === faceValue.J)) {
    // Check if changing the joker value to any other value gives better hands
    for (const replacement of Object.values(faceValue)) {
      if (replacement !== faceValue.J) {
        const newValues = values.map(v => v === faceValue.J ? replacement : v)
        const newType = calcType(newValues)
        if (newType < type) type = newType
      }
    }
  }

  return type
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
  part1 = (): number => this.result(false)

  part2 = (): number => this.result(true)

  result (jokerRule: boolean): number {
    const hands = this.parseInput(jokerRule)
    hands.sort(cmpCards)
    return sum(hands.map((h, rank) => h.bid * (rank + 1)))
  }

  parseInput (jokerRule: boolean): Hand[] {
    return this.inputLines().map(line => {
      const [cards, bid] = line.split(' ')
      return new Hand(cards, +bid, jokerRule)
    })
  }
}

(new Day7()).solve()
