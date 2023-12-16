import Solution from './solution'

enum Dir {
  north,
  east,
  south,
  west
}

const delta: Record<Dir, [number, number]> = {
  [Dir.north]: [0, -1],
  [Dir.east]: [1, 0],
  [Dir.south]: [0, 1],
  [Dir.west]: [-1, 0]
}

// /
const mirrorA: Record<Dir, Dir> = {
  [Dir.north]: Dir.east,
  [Dir.east]: Dir.north,
  [Dir.south]: Dir.west,
  [Dir.west]: Dir.south
}

// \
const mirrorB: Record<Dir, Dir> = {
  [Dir.north]: Dir.west,
  [Dir.east]: Dir.south,
  [Dir.south]: Dir.east,
  [Dir.west]: Dir.north
}

interface Cell {
  thing: string
  energised: boolean
}

interface Beam {
  x: number
  y: number
  dir: Dir
}

class Contraption {
  layout: Cell[][]
  width: number
  height: number

  constructor (input: string[]) {
    this.layout = input.map(line => {
      return line.split('').map(c => {
        return { thing: c, energised: false }
      })
    })
    this.width = this.layout[0].length
    this.height = this.layout.length
  }

  reset (): void {
    this.layout.forEach(row => { row.forEach(cell => { cell.energised = false }) })
  }

  countEnergised (): number {
    let c = 0
    this.layout.forEach(row => {
      row.forEach(cell => {
        if (cell.energised) c++
      })
    })
    return c
  }

  run (startX: number, startY: number, startDir: Dir): number {
    const stack: Beam[] = [{ x: startX, y: startY, dir: startDir }]
    const seen: Record<string, boolean> = {}
    this.reset()

    while (stack.length > 0) {
      const beam = stack.pop()
      if (beam === undefined) throw new Error('unreachable')
      while (true) {
        const [dx, dy] = delta[beam.dir]
        const nx = beam.x + dx
        const ny = beam.y + dy
        if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) {
          break
        }
        const key = `${nx},${ny},${beam.dir}`
        if (seen[key] !== undefined) {
          break
        }
        seen[key] = true
        this.layout[ny][nx].energised = true
        beam.x = nx
        beam.y = ny
        switch (this.layout[ny][nx].thing) {
          case '.':
            break
          case '/':
            beam.dir = mirrorA[beam.dir]
            break
          case '\\':
            beam.dir = mirrorB[beam.dir]
            break
          case '|':
            if (beam.dir === Dir.east || beam.dir === Dir.west) {
              beam.dir = Dir.north
              stack.push({ x: beam.x, y: beam.y, dir: Dir.south })
            }
            break
          case '-':
            if (beam.dir === Dir.north || beam.dir === Dir.south) {
              beam.dir = Dir.east
              stack.push({ x: beam.x, y: beam.y, dir: Dir.west })
            }
            break
          default:
            throw new Error('unreachable')
        }
      }
    }
    return this.countEnergised()
  }
}

export class Day16 extends Solution {
  part1 (): number {
    const contraption = this.parseInput()
    return contraption.run(-1, 0, Dir.east)
  }

  part2 (): number {
    const contraption = this.parseInput()
    let max = 0
    for (let x = 0; x < contraption.layout[0].length; x++) {
      const r = Math.max(
        contraption.run(x, -1, Dir.south),
        contraption.run(x, contraption.layout.length, Dir.north)
      )
      if (r > max) max = r
    }
    for (let y = 0; y < contraption.layout.length; y++) {
      const r = Math.max(
        contraption.run(-1, y, Dir.east),
        contraption.run(contraption.layout[0].length, y, Dir.west)
      )
      if (r > max) max = r
    }
    return max
  }

  parseInput = (): Contraption => new Contraption(this.inputLines())
}
