import Solution from './solution'

interface P {
  x: number
  y: number
}

enum Dir {
  north,
  east,
  south,
  west
}

const parseDir: Record<string, Dir> = {
  U: Dir.north,
  R: Dir.east,
  D: Dir.south,
  L: Dir.west
}

const delta: Record<Dir, [number, number]> = {
  [Dir.north]: [0, -1],
  [Dir.east]: [1, 0],
  [Dir.south]: [0, 1],
  [Dir.west]: [-1, 0]
}

interface Instruction {
  dir: Dir
  distance: number
  colour: Colour
}

type Colour = string

class Trench {
  digger: P
  grid: Map<string, Colour> // keyed by string "x,y"
  min: P
  max: P

  constructor () {
    this.digger = { x: 0, y: 0 }
    this.grid = new Map()
    this.min = { x: 0, y: 0 }
    this.max = { x: 0, y: 0 }
  }

  dig (dir: Dir, distance: number, colour: Colour): void {
    const [dx, dy] = delta[dir]
    for (let i = 0; i < distance; i++) {
      this.digger.x += dx
      this.digger.y += dy
      this.paint(colour)
    }
  }

  // to find the size of the interior, we use a DFS to find the number of cells
  // outside the trench.
  interiorSize (): number {
    const exterior = new Set<string>() // TODO: 2d array would be faster but need offsets for negative
    this.dfs(exterior, { x: this.min.x - 1, y: this.min.y - 1 })
    return (this.max.x - this.min.x + 3) * (this.max.y - this.min.y + 3) - exterior.size
  }

  private paint (colour: Colour): void {
    if (this.digger.x < this.min.x) this.min.x = this.digger.x
    if (this.digger.x > this.max.x) this.max.x = this.digger.x
    if (this.digger.y < this.min.y) this.min.y = this.digger.y
    if (this.digger.y > this.max.y) this.max.y = this.digger.y
    this.grid.set(`${this.digger.x},${this.digger.y}`, colour)
  }

  private dfs (visited: Set<string>, start: P): void {
    const stack: P[] = [start]
    while (stack.length > 0) {
      const p = stack.pop()
      if (p === undefined) throw new Error('unreachable')
      visited.add(`${p.x},${p.y}`)
      for (let dir: Dir = 0; dir < 4; dir++) {
        const [dx, dy] = delta[dir]
        const nx = p.x + dx
        const ny = p.y + dy
        if (nx + 1 < this.min.x || nx - 1 > this.max.x || ny + 1 < this.min.y || ny - 1 > this.max.y) continue
        if (visited.has(`${nx},${ny}`)) continue
        if (this.grid.has(`${nx},${ny}`)) continue
        stack.push({ x: nx, y: ny })
      }
    }
  }
}

export class Day18 extends Solution {
  part1 (): number {
    const trench = new Trench()
    this.instructions().forEach(inst => {
      trench.dig(inst.dir, inst.distance, inst.colour)
    })
    return trench.interiorSize()
  }

  part2 = (): number => 0

  instructions (): Instruction[] {
    return this.inputLines().map(line => {
      const data = line.split(' ')
      return { dir: parseDir[data[0]], distance: +data[1], colour: data[2].substring(1, 7) }
    })
  }
}
