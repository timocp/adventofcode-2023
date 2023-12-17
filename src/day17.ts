import Solution from './solution'
import { PriorityQueue } from './priorityQueue'

enum Dir {
  east,
  south,
  west,
  north
}

const delta: Array<[number, number]> = [
  [1, 0], // E
  [0, 1], // S
  [-1, 0], // W
  [0, -1] // N
]

const opposite: Dir[] = [
  Dir.west,
  Dir.north,
  Dir.east,
  Dir.south
]

interface State {
  x: number
  y: number
  dir: Dir
  steps: number
  cost: number
}

const stateKey = (s: State): string => `${s.x},${s.y},${s.dir},${s.steps}`

class Maze {
  grid: number[][]
  width: number
  height: number

  constructor (input: string[]) {
    this.grid = input.map(line => line.split('').map(c => +c))
    this.width = this.grid[0].length
    this.height = this.grid[0].length
  }

  at = (x: number, y: number): number | undefined => {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.grid[y][x]
    } else {
      return undefined
    }
  }
}

// Djikstra search through a maze, from (0,0) to (end,end)
// Maybe A* using MH distance to end would perform better?
//
// Returns the heat loss (cost) incurred (total of the values passed through)
// Rules:
// May only move Left,Right,Forward
// May only move forward 3 times in a row
const search = (maze: Maze): number => {
  // lowest cost to reach a certain state.  State has to include direction and steps
  // as well as position, because there may be cheaper ways to get to a specific position
  // that are not part of the best path due to how they arrived there.
  const dist: Record<string, number> = {}

  const queue = new PriorityQueue<State>()

  // debugging only - where are we coming from?
  // const from: Record<string, string> = {}

  queue.push({ x: 0, y: 0, dir: Dir.east, steps: 0, cost: 0 }, 0)

  while (queue.size() > 0) {
    const state = queue.pop()

    if (state.x === maze.width - 1 && state.y === maze.height - 1) {
      // console.log(state)
      // console.log('Path:')
      // let n = 0
      // for (let k = stateKey(state); k !== undefined; k = from[k]) {
      //   n++
      //   console.log(`  ${k}`)
      // }
      // console.log(` ${n} steps`)
      return state.cost
    }

    const key = stateKey(state)
    if (state.cost > (dist[key] ?? Infinity)) continue

    for (let dir: Dir = 0; dir < 4; dir++) {
      if (dir === opposite[state.dir]) continue
      const [dx, dy] = delta[dir]
      const next: State = {
        x: state.x + dx,
        y: state.y + dy,
        dir,
        cost: 0,
        steps: dir === state.dir ? state.steps + 1 : 1
      }
      if (next.x === 0 && next.y === 0) continue
      if (next.steps > 3) continue
      const stepCost = maze.at(next.x, next.y)
      if (stepCost === undefined) continue
      next.cost = state.cost + stepCost
      const nextKey = stateKey(next)
      if (next.cost < (dist[nextKey] ?? Infinity)) {
        queue.push(next, next.cost)
        dist[nextKey] = next.cost
        // from[nextKey] = key
      }
    }
  }

  throw new Error('no path?')
}

export class Day17 extends Solution {
  part1 = (): number => search(this.getMaze())

  part2 = (): number => 0

  getMaze = (): Maze => new Maze(this.inputLines())
}
