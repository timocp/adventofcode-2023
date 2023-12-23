import Solution from './solution'
import { must } from './util'

interface P {
  x: number
  y: number
}

enum Dir {
  n,
  e,
  s,
  w
}

const delta: Record<Dir, [number, number]> = {
  [Dir.n]: [0, -1],
  [Dir.e]: [1, 0],
  [Dir.s]: [0, 1],
  [Dir.w]: [-1, 0]
}

enum Type {
  path,
  forest,
  slope
}

interface Tile {
  type: Type.path | Type.forest
}

interface Slope {
  type: Type.slope
  dir: Dir
}

type Cell = Tile | Slope

const toCell = (s: string): Cell => {
  switch (s) {
    case '.': return { type: Type.path }
    case '#': return { type: Type.forest }
    case '^': return { type: Type.slope, dir: Dir.n }
    case '>': return { type: Type.slope, dir: Dir.e }
    case 'v': return { type: Type.slope, dir: Dir.s }
    case '<': return { type: Type.slope, dir: Dir.w }
    default: throw new Error(`Invalid input: ${s}`)
  }
}

interface DfsState {
  p: P
  seen: Set<string>
}

class Maze {
  grid: Cell[][]
  width: number
  height: number
  start: P
  end: P

  constructor (lines: string[]) {
    this.grid = lines.map(line => line.split('').map(c => toCell(c)))
    this.width = this.grid[0].length
    this.height = this.grid.length
    this.start = { x: lines[0].indexOf('.'), y: 0 }
    this.end = { x: lines[this.height - 1].lastIndexOf('.'), y: this.height - 1 }
  }

  // valid moves from P (not taking into account seen locations)
  moves (from: P): P[] {
    const m: P[] = []
    const here = this.grid[from.y][from.x]
    if (here.type === Type.slope) {
      // If on slope, must move in that direction
      const [dx, dy] = delta[here.dir]
      m.push({ x: from.x + dx, y: from.y + dy })
    } else {
      // Otherwise can move into any blank space, or into a slope (in the direction of the arrow only)
      // Note that example and real input do not have paths into the sides of slopes so no need to consider it
      for (let dir: Dir = 0; dir < 4; dir++) {
        const [dx, dy] = delta[dir]
        const to = { x: from.x + dx, y: from.y + dy }
        if (to.x < 0 || to.x > this.width - 1 || to.y < 0 || to.y > this.height - 1) continue
        const there = this.grid[to.y][to.x]
        switch (there.type) {
          case Type.path:
            m.push(to)
            break
          case Type.slope:
            if (there.dir as number === dir as number) m.push(to)
        }
      }
    }
    return m
  }

  // dfs search where the state is a Set of P (as strings, because objects can't be compared)
  // this is kind of slow, need some ways to prune search space or cache state
  longestPath (): number {
    let max = 0
    const stack: DfsState[] = [{ p: this.start, seen: new Set() }]
    while (stack.length > 0) {
      const state = must(stack.pop())
      // console.log('checking p', state.p, 'seen size', state.seen.size, 'stack size', stack.length)
      if (state.p.x === this.end.x && state.p.y === this.end.y) {
        // console.log('Found path of length', state.seen.size)
        if (max < state.seen.size) max = state.seen.size
        continue
      }
      const pKey = `${state.p.x},${state.p.y}`
      this.moves(state.p).forEach(move => {
        if (!state.seen.has(`${move.x},${move.y}`)) stack.push({ p: move, seen: (new Set(state.seen.values())).add(pKey) })
      })
    }

    return max
  }
}

export class Day23 extends Solution {
  part1 = (): number => new Maze(this.inputLines()).longestPath()

  part2 (): number {
    return 0
  }
}
