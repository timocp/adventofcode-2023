import Solution from './solution'

class Almanac {
  seeds: number[]
  // Part one doesn't need the named sections
  maps: Map[][]

  constructor () {
    this.seeds = []
    this.maps = []
  }
}

interface Map {
  dest: number
  src: number
  len: number
}

export class Day5 extends Solution {
  part1 (): number {
    const almanac = this.parseInput()
    const locations = almanac.seeds.map((seed) => {
      let value = seed
      almanac.maps.forEach((maps) => {
        value = this.mapValue(value, maps)
      })
      return value
    })
    return Math.min(...locations)
  }

  part2 (): string | number {
    return ''
  }

  mapValue (v: number, maps: Map[]): number {
    for (const map of maps) {
      if (map.src <= v && v < (map.src + map.len)) {
        return map.dest + (v - map.src)
      }
    }
    return v
  }

  parseInput (): Almanac {
    const a = new Almanac()

    this.inputParagraphs().forEach((p) => {
      if (p.startsWith('seeds: ')) {
        a.seeds = p.trimEnd().split(': ')[1].split(' ').map(seed => +seed)
      } else {
        const lines = p.split(/\n/).slice(1)
        const maps: Map[] = lines.map((line) => {
          const nums = line.split(' ').map(num => +num)
          return { dest: nums[0], src: nums[1], len: nums[2] }
        })
        a.maps.push(maps)
      }
    })

    return a
  }
}

(new Day5()).solve()
