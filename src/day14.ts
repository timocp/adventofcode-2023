import Solution from './solution'
import { v5 as uuidv5 } from 'uuid'

enum Rock {
  none,
  round,
  cube
}

enum Dir {
  north,
  west,
  south,
  east
}

const move: Record<Dir, [number, number]> = {
  [Dir.north]: [0, -1],
  [Dir.west]: [-1, 0],
  [Dir.south]: [0, 1],
  [Dir.east]: [1, 0]
}

class Platform {
  rocks: Rock[][]
  height: number
  width: number

  constructor (rocks: Rock[][]) {
    this.rocks = rocks
    this.height = rocks.length
    this.width = rocks[0].length
  }

  roll (row: number, col: number, dir: Dir): void {
    if (this.rocks[row][col] !== Rock.round) return

    const [dx, dy] = move[dir]
    let nrow = row
    let ncol = col
    while (true) {
      if (nrow + dy < 0 || nrow + dy >= this.height) break
      if (ncol + dx < 0 || ncol + dx >= this.width) break
      if (this.rocks[nrow + dy][ncol + dx] !== Rock.none) break
      nrow += dy
      ncol += dx
    }
    if (nrow !== row || ncol !== col) {
      this.rocks[nrow][ncol] = Rock.round
      this.rocks[row][col] = Rock.none
    }
  }

  tilt (dir: Dir): void {
    switch (dir) {
      case Dir.north:
        for (let row = 1; row < this.height; row++) {
          for (let col = 0; col < this.width; col++) {
            this.roll(row, col, dir)
          }
        }
        break
      case Dir.west:
        for (let col = 1; col < this.width; col++) {
          for (let row = 0; row < this.height; row++) {
            this.roll(row, col, dir)
          }
        }
        break
      case Dir.south:
        for (let row = this.height - 2; row >= 0; row--) {
          for (let col = 0; col < this.width; col++) {
            this.roll(row, col, dir)
          }
        }
        break
      case Dir.east:
        for (let col = this.width - 2; col >= 0; col--) {
          for (let row = 0; row < this.height; row++) {
            this.roll(row, col, dir)
          }
        }
    }
  }

  cycle = (): void => {
    this.tilt(Dir.north)
    this.tilt(Dir.west)
    this.tilt(Dir.south)
    this.tilt(Dir.east)
  }

  totalLoad = (): number => {
    let load = 0
    for (let row = 0; row < this.height; row++) {
      this.rocks[row].forEach(rock => { if (rock === Rock.round) load += this.height - row })
    }
    return load
  }

  toString = (): string => {
    const tr: Record<Rock, string> = {
      [Rock.none]: '.',
      [Rock.round]: 'O',
      [Rock.cube]: '#'
    }
    return this.rocks.map(row => {
      return row.map(rock => tr[rock]).join('')
    }).join('\n')
  }

  toKey = (): string => {
    return uuidv5(this.toString(), '053e0bd4-f3dc-469c-8e8a-bad10435bee2')
  }
}

export class Day14 extends Solution {
  part1 (): number {
    const platform = this.parseInput()
    platform.tilt(Dir.north)
    return platform.totalLoad()
  }

  part2 (): number {
    const platform = this.parseInput()
    const seen: Record<string, number> = {}
    for (let i = 1; i < 1000000000; i++) {
      platform.cycle()
      const key = platform.toKey()
      if (seen[key] !== undefined) {
        const loop = i - seen[key]
        i += Math.floor((1000000000 - i) / loop) * loop
        for (; i < 1000000000; i++) {
          platform.cycle()
        }
        break
      }
      seen[key] = i
    }
    return platform.totalLoad()
  }

  parseInput (): Platform {
    const tr: Record<string, Rock> = {
      '.': Rock.none,
      O: Rock.round,
      '#': Rock.cube
    }
    return new Platform(this.inputLines().map(line => line.split('').map(c => tr[c])))
  }
}
