import Solution from './solution'
import { sum } from './util'

interface Hand {
  red: number
  green: number
  blue: number
}

interface Game {
  id: number
  hands: Hand[]
}

export class Day2 extends Solution {
  part1 (): number {
    return sum(this.parseInput().filter(game => {
      return game.hands.every(hand => hand.red <= 12 && hand.green <= 13 && hand.blue <= 14)
    }).map(game => game.id))
  }

  part2 = (): number => sum(this.parseInput().map(game => this.power(game)))

  parseInput (): Game[] {
    return this.inputLines().map(line => {
      const m = line.match(/^Game (\d+): (.*)$/)
      if (m === null) throw new Error(`Parse error: ${line}`)
      const id = parseInt(m.at(1) ?? '0')
      const hands = (m.at(2)?.split('; ') ?? []).map(handStr => {
        const hand = { red: 0, green: 0, blue: 0 }
        handStr.split(', ').forEach(cube => {
          const [count, colour] = cube.split(' ')
          switch (colour) {
            case 'red': hand.red = +count; break
            case 'green': hand.green = +count; break
            case 'blue': hand.blue = +count; break
            default: throw new Error(`Unknown colour: ${colour}`)
          };
        })
        return hand
      })
      return { id, hands }
    })
  }

  power (game: Game): number {
    const min = { red: 0, green: 0, blue: 0 }
    game.hands.forEach(hand => {
      if (hand.red > min.red) min.red = hand.red
      if (hand.green > min.green) min.green = hand.green
      if (hand.blue > min.blue) min.blue = hand.blue
    })
    return min.red * min.green * min.blue
  }
}
