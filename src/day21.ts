import Solution from './solution'

interface P {
  x: number
  y: number
}

interface State extends P {
  stepsTaken: number
}

const stateKey = (state: State): string => `${state.x},${state.y},${state.stepsTaken}`

enum Tile {
  plot,
  rock
}

const toTile: Record<string, Tile> = { '.': Tile.plot, '#': Tile.rock }

enum Dir {
  north,
  east,
  south,
  west
}

const delta: Array<[number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
]

class Garden {
  grid: Tile[][]
  width: number
  height: number
  start: P

  constructor (lines: string[]) {
    let start: P | undefined
    this.grid = lines.map((line, y) => line.split('').map((c, x) => {
      if (c === 'S') {
        start = { x, y }
        return Tile.plot
      }
      return toTile[c]
    }))
    if (start === undefined) throw new Error('missing start position')
    this.start = start
    this.width = this.grid[0].length
    this.height = this.grid.length
  }

  countEndPoints (stepGoal: number): number {
    const visited = new Set<string>()
    this.dfs({ x: this.start.x, y: this.start.y, stepsTaken: 0 }, stepGoal, visited)
    return Array.from(visited.keys()).filter(k => k.split(',')[2] === stepGoal.toString()).length
  }

  dfs (state: State, stepGoal: number, visited: Set<string>): void {
    const key = stateKey(state)
    if (visited.has(key)) return
    visited.add(key)
    if (state.stepsTaken === stepGoal) return
    for (let dir: Dir = 0; dir < 4; dir++) {
      const [dx, dy] = delta[dir]
      const n = { x: state.x + dx, y: state.y + dy, stepsTaken: state.stepsTaken + 1 }
      if (n.x >= 0 && n.x < this.width && n.y >= 0 && n.y < this.height && this.grid[n.y][n.x] === Tile.plot) {
        this.dfs(n, stepGoal, visited)
      }
    }
  }
}

export class Day21 extends Solution {
  part1 = (stepGoal: number = 64): number => new Garden(this.inputLines()).countEndPoints(stepGoal)

  part2 = (): number => 0
}
