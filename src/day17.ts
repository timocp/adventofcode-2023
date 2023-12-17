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

type NextStatesFn = (s: State, m: Maze) => State[]

// Djikstra search through a maze, from (0,0) to (end,end)
// Maybe A* using MH distance to end would perform better?
//
// Returns the heat loss (cost) incurred (total of the values passed through)
// Movement rules handled by nextStates callback
const search = (maze: Maze, nextStates: NextStatesFn): number => {
  // lowest cost to reach a certain state.  State has to include direction and steps
  // as well as position, because there may be cheaper ways to get to a specific position
  // that are not part of the best path due to how they arrived there.
  const dist: Record<string, number> = {}

  const queue = new PriorityQueue<State>()

  queue.push({ x: 0, y: 0, dir: Dir.east, steps: 0, cost: 0 }, 0)

  while (queue.size() > 0) {
    const state = queue.pop()

    if (state.x === maze.width - 1 && state.y === maze.height - 1) {
      return state.cost
    }

    const key = stateKey(state)
    if (state.cost > (dist[key] ?? Infinity)) continue

    nextStates(state, maze).forEach(next => {
      const nextKey = stateKey(next)
      if (next.cost < (dist[nextKey] ?? Infinity)) {
        queue.push(next, next.cost)
        dist[nextKey] = next.cost
      }
    })
  }

  throw new Error('no path?')
}

// Valid next steps
const crucibleNextStates: NextStatesFn = (state: State, maze: Maze): State[] => {
  const moves: State[] = []
  for (let dir: Dir = 0; dir < 4; dir++) {
    if (dir === opposite[state.dir]) continue
    const [dx, dy] = delta[dir]
    const heat = maze.at(state.x + dx, state.y + dy)
    if (heat === undefined) continue
    const next: State = {
      x: state.x + dx,
      y: state.y + dy,
      dir,
      cost: state.cost + heat,
      steps: dir === state.dir ? state.steps + 1 : 1
    }
    if (next.steps > 3) continue
    moves.push(next)
  }
  return moves
}

const ultraCrucibleNextStates: NextStatesFn = (state: State, maze: Maze): State[] => {
  // if between 1-3 steps, the only valid move is to keep going in the same direction
  if (state.steps >= 1 && state.steps <= 3) {
    const [dx, dy] = delta[state.dir]
    const heat = maze.at(state.x + dx, state.y + dy)
    if (heat === undefined) {
      return []
    } else {
      return [{
        x: state.x + dx,
        y: state.y + dy,
        dir: state.dir,
        cost: state.cost + heat,
        steps: state.steps + 1
      }]
    }
  }
  // otherwise, normal rules but max is now 10
  const moves: State[] = []
  for (let dir: Dir = 0; dir < 4; dir++) {
    if (dir === opposite[state.dir]) continue
    const [dx, dy] = delta[dir]
    const heat = maze.at(state.x + dx, state.y + dy)
    if (heat === undefined) continue
    const next: State = {
      x: state.x + dx,
      y: state.y + dy,
      dir,
      cost: state.cost + heat,
      steps: dir === state.dir ? state.steps + 1 : 1
    }
    if (next.steps > 10) continue
    moves.push(next)
  }
  return moves
}

export class Day17 extends Solution {
  part1 = (): number => search(this.getMaze(), crucibleNextStates)

  part2 = (): number => search(this.getMaze(), ultraCrucibleNextStates)

  getMaze = (): Maze => new Maze(this.inputLines())
}
