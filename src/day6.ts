import Solution from './solution'
import { product, enumerate } from './util'

interface Race {
  time: number
  distance: number
}

export class Day6 extends Solution {
  part1 (): number {
    return product(this.parseInput().map(race => this.winningMoves(race).length))
  }

  part2 (): number {
    const races = this.parseInput()
    const realRace = {
      time: +races.map(r => r.time.toString()).join(''),
      distance: +races.map(r => r.distance.toString()).join('')
    }
    return this.winningMoves(realRace).length
  }

  winningMoves (race: Race): number[] {
    return enumerate(race.time).slice(1).filter(speed => {
      return speed * (race.time - speed) > race.distance
    })
  }

  parseInput (): Race[] {
    const times = this.inputLines()[0].split(/\s+/).slice(1).map(n => +n)
    const distances = this.inputLines()[1].split(/\s+/).slice(1).map(n => +n)

    return times.map((time, i) => {
      return { time, distance: distances[i] }
    })
  }
}

(new Day6()).solve()
