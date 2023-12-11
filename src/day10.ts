import Solution from './solution'
import { replaceAt } from './util'

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
  width: number
  height: number

  at = (p: P): string => this.grid[p.y][p.x]

  connects (p: P, dir: Dir): boolean {
    if (p.x < 0 || p.x >= this.width || p.y < 0 || p.y >= this.height) return false
    const c = this.at(p)
    switch (dir) {
      case Dir.north: return ['|', 'L', 'J'].includes(c)
      case Dir.east: return ['-', 'L', 'F'].includes(c)
      case Dir.south: return ['|', '7', 'F'].includes(c)
      case Dir.west: return ['-', 'J', '7'].includes(c)
    }
  }

  constructor (lines: string[]) {
    this.grid = lines
    this.width = lines[0].length
    this.height = lines.length
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

  // Returns the length of the loop
  // If `mark` is true, replace the loop's pipe's with an 'X'
  loopLength (mark?: boolean): number {
    let count = 0
    let prev = this.start
    let p = this.start
    do {
      const n = neighbours(p).find(([dir, n]) => {
        return !(n.x === prev.x && n.y === prev.y) && this.connects(p, dir)
      })
      if (n === undefined) throw new Error(`Stuck at ${p.x},${p.y}`)
      prev = p
      if (mark !== undefined && mark) this.grid[prev.y] = replaceAt(this.grid[prev.y], prev.x, 'X')
      p = n[1]
      count++
    } while (!(p.x === this.start.x && p.y === this.start.y))
    if (mark !== undefined && mark) this.grid[prev.y] = replaceAt(this.grid[prev.y], prev.x, 'X')
    return count
  }

  // triple the size of the maze in both axes
  embiggen (): void {
    this.grid = this.grid.flatMap(row => {
      const row0: string[] = []
      const row1: string[] = []
      const row2: string[] = []
      row.split('').forEach(c => {
        switch (c) {
          case '|':
            row0.push('.|.')
            row1.push('.|.')
            row2.push('.|.')
            break
          case '-':
            row0.push('...')
            row1.push('---')
            row2.push('...')
            break
          case 'L':
            row0.push('.|.')
            row1.push('.L-')
            row2.push('...')
            break
          case 'J':
            row0.push('.|.')
            row1.push('-J.')
            row2.push('...')
            break
          case '7':
            row0.push('...')
            row1.push('-7.')
            row2.push('.|.')
            break
          case 'F':
            row0.push('...')
            row1.push('.F-')
            row2.push('.|.')
            break
          case '.':
            row0.push('...')
            row1.push('...')
            row2.push('...')
            break
          default:
            throw new Error(`Unexpected cell: ${c}`)
        }
      })
      return [row0.join(''), row1.join(''), row2.join('')]
    })
    this.start = { x: this.start.x * 3 + 1, y: this.start.y * 3 + 1 }
    this.width *= 3
    this.height *= 3
  }

  // iterative version since the recursive version exceeds stack size
  dfs_iter (visited: boolean[][], start: P): void {
    const stack: P[] = [start]
    while (stack.length > 0) {
      const p = stack.pop()
      if (p === undefined) throw new Error('unreachable')
      visited[p.y][p.x] = true
      neighbours(p)
        .map(([_, n]) => n)
        .filter(n => n.x >= 0 && n.x < this.width && n.y >= 0 && n.y < this.height)
        .filter(n => !visited[n.y][n.x])
        .filter(n => this.at(n) !== 'X')
        .forEach(n => { stack.push(n) })
    }
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
      return row.replace(/[|\-LJ7F]/g, m => tr[m] ?? m) + '\n'
    }).join('')
  }
}

export class Day10 extends Solution {
  part1 = (): number => new Maze(this.inputLines()).loopLength() / 2

  // For part 2, grow the maze by 3 times in both axes;
  // This allows us to DFS from (0,0), which must be outside the loop, and note
  // each cell that was able to be visited.
  // Afterwards, any cell not reached by the search which is not part of the
  // loop and corresponds to an original pre-embiggened maze cell, counts
  // as inside the loop
  part2 (): number {
    const maze = new Maze(this.inputLines())
    maze.embiggen()
    maze.loopLength(true)
    const visited = maze.grid.map(row => row.split('').map(_ => false))
    maze.dfs_iter(visited, { x: 0, y: 0 })

    // every 3rd row/col starting at offset 1 corresponds to the original maze
    let count = 0
    for (let y = 1; y < maze.height; y += 3) {
      for (let x = 1; x < maze.width; x += 3) {
        if (maze.at({ x, y }) !== 'X' && !visited[y][x]) count++
      }
    }

    return count
  }
}
