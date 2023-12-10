import Solution from './solution'

interface P { x: number, y: number }

enum Dir {
  north,
  east,
  south,
  west
}

const neighbours = (p: P): Array<[Dir, P]> => [
  [Dir.north, { x: p.x, y: p.y - 1 }],
  [Dir.east, { x: p.x + 1, y: p.y }],
  [Dir.south, { x: p.x, y: p.y + 1 }],
  [Dir.west, { x: p.x - 1, y: p.y }]
]

class Maze {
  grid: string[]
  start: P

  connects (p: P, dir: Dir): boolean {
    const c = this.grid[p.y][p.x]
    switch (dir) {
      case Dir.north: return ['|', 'L', 'J'].includes(c)
      case Dir.east: return ['-', 'L', 'F'].includes(c)
      case Dir.south: return ['|', '7', 'F'].includes(c)
      case Dir.west: return ['-', 'J', '7'].includes(c)
    }
  }

  constructor (lines: string[]) {
    this.grid = lines
    const y = lines.findIndex(line => line.includes('S'))
    const x = lines[y].indexOf('S')
    this.start = { x, y }

    // infer the pipe at start position
    const connectsNorth = this.connects({ x, y: y - 1 }, Dir.south)
    const connectsEast = this.connects({ x: x + 1, y }, Dir.west)
    const connectsSouth = this.connects({ x, y: y + 1 }, Dir.north)
    const connectsWest = this.connects({ x: x - 1, y }, Dir.east)

    if (connectsNorth && connectsSouth) {
      this.grid[y] = this.grid[y].replace('S', '|')
    } else if (connectsEast && connectsWest) {
      this.grid[y] = this.grid[y].replace('S', '-')
    } else if (connectsNorth && connectsEast) {
      this.grid[y] = this.grid[y].replace('S', 'L')
    } else if (connectsNorth && connectsWest) {
      this.grid[y] = this.grid[y].replace('S', 'J')
    } else if (connectsSouth && connectsWest) {
      this.grid[y] = this.grid[y].replace('S', '7')
    } else if (connectsSouth && connectsEast) {
      this.grid[y] = this.grid[y].replace('S', 'F')
    } else {
      throw new Error('Unable to infer starting pipe')
    }
  }

  loopLength (): number {
    let count = 0
    let prev = this.start
    let p = this.start
    // console.log(this.toString())
    // console.log(`Starting from ${p.x},${p.y}`)
    do {
      const n = neighbours(p).find(([dir, n]) => {
        return !(n.x === prev.x && n.y === prev.y) && this.connects(p, dir)
      })
      if (n === undefined) throw new Error(`Stuck at ${p.x},${p.y}`)
      prev = p
      // console.log(`Moving ${['N', 'E', 'S', 'W'][n[0]]} from ${prev.x},${prev.y} to ${n[1].x},${n[1].y}`)
      p = n[1]
      count++
    } while (!(p.x === this.start.x && p.y === this.start.y))
    return count
  }

  toString (): string {
    const tr: Record<string, string> = {
      '|': '│',
      '-': '─',
      L: '└',
      J: '┘',
      7: '┐',
      F: '┌'
    }
    return this.grid.map(row => {
      return row.replace(/[|\-LJ7F]/g, m => tr[m] ?? ' ') + '\n'
    }).join('')
  }
}

export class Day10 extends Solution {
  part1 = (): number => new Maze(this.inputLines()).loopLength() / 2

  part2 (): number {
    return 0
  }
}
