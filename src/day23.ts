import Solution from './solution'
import { must } from './util'

interface P {
  x: number
  y: number
}

const pKey = (p: P): string => `${p.x},${p.y}`

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

const toCell = (s: string, ignoreSlopes: boolean): Cell => {
  switch (s) {
    case '.': return { type: Type.path }
    case '#': return { type: Type.forest }
    case '^': return ignoreSlopes ? { type: Type.path } : { type: Type.slope, dir: Dir.n }
    case '>': return ignoreSlopes ? { type: Type.path } : { type: Type.slope, dir: Dir.e }
    case 'v': return ignoreSlopes ? { type: Type.path } : { type: Type.slope, dir: Dir.s }
    case '<': return ignoreSlopes ? { type: Type.path } : { type: Type.slope, dir: Dir.w }
    default: throw new Error(`Invalid input: ${s}`)
  }
}

interface DfsState {
  num: number
  path: number[]
}

interface Node {
  name: string
  num: number
  p: P
}

interface Edge {
  to: number
  steps: number
}

class Maze {
  grid: Cell[][]
  width: number
  height: number
  start: P
  finish: P

  // graph version
  nodes: Node[]
  edges: Record<number, Edge[]>

  constructor (lines: string[], ignoreSlopes: boolean = false) {
    this.grid = lines.map(line => line.split('').map(c => toCell(c, ignoreSlopes)))
    this.width = this.grid[0].length
    this.height = this.grid.length
    this.start = { x: lines[0].indexOf('.'), y: 0 }
    this.finish = { x: lines[this.height - 1].lastIndexOf('.'), y: this.height - 1 }

    this.nodes = []
    this.edges = {}
  }

  // valid moves from P (not taking into account seen locations)
  private moves (from: P): P[] {
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

  // Turn the maze into a graph; because the input is composed primarily of
  // long corridors, this is hopefully small enough to brute force all paths
  private buildGraph (): void {
    // Setup nodes (any slope or intersection is a node)
    this.nodes.push({ num: 0, name: 'START', p: this.start })
    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.type === Type.slope || (cell.type === Type.path && this.moves({ x, y }).length > 2)) {
          this.nodes.push({ num: this.nodes.length, name: this.nodes.length.toString(36), p: { x, y } })
        }
      })
    })
    this.nodes.push({ num: this.nodes.length, name: 'FINISH', p: this.finish })

    // Setup edges from each node
    this.nodes.forEach(node => { this.edges[node.num] = this.findEdges(node) })
  }

  private nodeAt (p: P): Node | undefined {
    return this.nodes.find(node => node.p.x === p.x && node.p.y === p.y)
  }

  // returns a list of edges coming from node
  private findEdges (node: Node): Edge[] {
    const edges: Edge[] = []
    const queue: P[] = [node.p]
    const visited = new Set<string>()
    visited.add(`${node.p.x},${node.p.y}`)
    let steps = 0
    while (queue.length > 0) {
      for (let size = queue.length; size > 0; size--) {
        const p = must(queue.shift())
        const found = steps > 0 ? this.nodeAt(p) : undefined
        if (found !== undefined) {
          edges.push({ to: found.num, steps })
        } else {
          this.moves(p).filter(move => !visited.has(pKey(move))).forEach(move => {
            visited.add(pKey(move))
            queue.push(move)
          })
        }
      }
      steps++
    }
    return edges
  }

  // DFS search of the graph.  Seen state is an array of nodes, also used to calculate path length
  // This is still a bit on the slow side for part 2 (~12s)
  // Possible optimisation: Could we prune paths that have no hope of reaching the current max?
  longestPath2 (): number {
    if (this.nodes.length === 0) this.buildGraph()

    let max = 0
    const stack: DfsState[] = [{ num: 0, path: [0] }]
    while (stack.length > 0) {
      const state = must(stack.pop())
      if (this.nodes[state.num].name === 'FINISH') {
        const steps = this.countSteps(state.path)
        if (steps > max) max = steps
      } else {
        this.edges[state.num].forEach(edge => {
          if (!state.path.includes(edge.to)) stack.push({ num: edge.to, path: [...state.path, edge.to] })
        })
      }
    }
    return max
  }

  private countSteps (path: number[]): number {
    let steps = 0
    for (let i = 0; i < path.length - 1; i++) {
      steps += must(this.edges[path[i]].find(edge => edge.to === path[i + 1])).steps
    }
    return steps
  }
}

export class Day23 extends Solution {
  part1 = (): number => new Maze(this.inputLines()).longestPath2()

  part2 = (): number => new Maze(this.inputLines(), true).longestPath2()
}
