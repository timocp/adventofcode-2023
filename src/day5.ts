import Solution from './solution'

class Almanac {
  seeds: number[]
  maps: Map[][]

  constructor () {
    this.seeds = []
    this.maps = []
  }
}

class Map {
  start: number
  end: number
  offset: number

  constructor (destinationStart: number, sourceStart: number, len: number) {
    this.start = sourceStart
    this.end = sourceStart + len - 1
    this.offset = destinationStart - sourceStart
  }
}

class Range {
  start: number
  end: number

  constructor (start: number, len: number) {
    if (len <= 0) throw new Error('length must be at least 1')

    this.start = start
    this.end = start + len - 1
  }
}

interface SplitRange {
  left?: Range
  hit?: Range
  right?: Range
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
    const almanac = this.parseInput()

    let ranges = [...(Array(almanac.seeds.length / 2))].map((_, i) => {
      return new Range(almanac.seeds[i * 2], almanac.seeds[i * 2 + 1])
    })

    for (const maps of almanac.maps) {
      ranges = this.mapRanges(ranges, maps)
    }
    return Math.min(...ranges.map(r => r.start))
  }

  mapValue (v: number, maps: Map[]): number {
    for (const map of maps) {
      if (map.start <= v && v <= map.end) {
        return v + map.offset
      }
    }
    return v
  }

  splitRange (range: Range, map: Map): SplitRange {
    // range is outside and to the left of the map
    if (range.end < map.start) {
      return { left: range }
    }

    // range is outside and to the right of the map
    if (range.start > map.end) {
      return { right: range }
    }

    // range is entirely covered by the map
    if (range.start >= map.start && range.end <= map.end) {
      return { hit: new Range(range.start + map.offset, range.end - range.start + 1) }
    }

    // range covers the map and extends past it in both directions
    if (range.start < map.start && range.end > map.end) {
      return {
        left: new Range(range.start, map.start - range.start),
        hit: new Range(map.start + map.offset, map.end - map.start + 1),
        right: new Range(map.end + 1, range.end - map.end)
      }
    }

    // range overlaps the map and extends to the left
    if (range.start < map.start && range.end <= map.end) {
      return {
        left: new Range(range.start, map.start - range.start),
        hit: new Range(map.start + map.offset, range.end - map.start + 1)
      }
    }

    // range overlaps the map and extends to the right
    if (range.start >= map.start && range.end > map.end) {
      return {
        hit: new Range(range.start + map.offset, map.end - range.start + 1),
        right: new Range(map.end + 1, range.end - map.end)
      }
    }

    throw new Error('Unhandled case in splitRange')
  }

  mapRanges (ranges: Range[], maps: Map[]): Range[] {
    // iterate over all maps collecting mapped parts of thr ranges into `mapped`
    // ranges (or parts thereof) are checked against the maps in order until they
    // are mapped or we run out of maps
    let unmapped: Range[] = ranges
    const mapped: Range[] = []

    maps.forEach((map) => {
      const miss: Range[] = []
      unmapped.forEach((range) => {
        const split = this.splitRange(range, map)
        if (split.left !== undefined) miss.push(split.left)
        if (split.hit !== undefined) mapped.push(split.hit)
        if (split.right !== undefined) miss.push(split.right)
      })
      unmapped = miss
    })

    // anything unmapped stays at its current valie
    mapped.push(...unmapped)

    return mapped
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
          return new Map(nums[0], nums[1], nums[2])
        })
        a.maps.push(maps)
      }
    })

    return a
  }
}
