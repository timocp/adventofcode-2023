import Solution from './solution'
import { mod, must, sum } from './util'

interface P {
  x: number
  y: number
}

const manhattan = (a: P, b: P): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

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

enum Fill {
  centre,
  ne,
  se,
  sw,
  nw
}

const oppositeCorner: Record<Fill, Fill> = {
  [Fill.ne]: Fill.sw,
  [Fill.se]: Fill.nw,
  [Fill.sw]: Fill.nw,
  [Fill.nw]: Fill.se,
  [Fill.centre]: Fill.centre // Not used
}

class Garden {
  grid: Tile[][]
  width: number
  height: number
  start: P

  // cache of a BFS search from each corner and centre (index: Fill, y, x)
  fillCache: Array<Array<Array<number | undefined>>>

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
    this.width = this.grid[0].length
    this.height = this.grid.length
    this.start = start
    this.fillCache = []

    // verify assumptions
    if (start.x !== start.y || start.x !== (this.height - 1) / 2) throw new Error('start position is not central')
    if (this.width !== this.height) throw new Error('grid is not square')
    if (!this.grid[0].every(t => t === Tile.plot)) throw new Error('top row is not clear')
    if (!this.grid[this.height - 1].every(t => t === Tile.plot)) throw new Error('bottom row is not clear')
    if (!this.grid.every(row => row[0] === Tile.plot && row[this.width - 1] === Tile.plot)) throw new Error('side rows are not clear')
  }

  at = (p: P): Tile => this.grid[mod(p.y, this.height)][mod(p.x, this.width)]

  // Returns the true position (NW corner) of G(x,y)
  // other corners just require adding width/height offsets
  gridCorner (gx: number, gy: number, corner: Fill): P {
    const x = gx * this.width
    const y = gy * this.height
    switch (corner) {
      case Fill.nw: return { x, y }
      case Fill.ne: return { x: x + this.width - 1, y }
      case Fill.se: return { x: x + this.width - 1, y: y + this.height - 1 }
      case Fill.sw: return { x, y: y + this.height - 1 }
      default: throw new Error(`${corner} is not a corner`)
    }
  }

  // Returns the number of steps from S to <corner> of G(0,0)
  stepsFromStartToCorner (corner: Fill): number {
    switch (corner) {
      case Fill.ne: return must(this.fillCache[Fill.centre][0][this.width - 1])
      case Fill.se: return must(this.fillCache[Fill.centre][this.height - 1][this.width - 1])
      case Fill.sw: return must(this.fillCache[Fill.centre][this.height - 1][0])
      case Fill.nw: return must(this.fillCache[Fill.centre][0][0])
      default: throw new Error(`${corner} is not a corner`)
    }
  }

  // part 1 just needs a single BFS from the centre
  countEndPoints (stepGoal: number): number {
    const visited: Array<Array<number | undefined>> = this.grid.map(row => row.map(_ => undefined))
    this.bfs(this.start, visited, stepGoal)
    return this.countSeen(visited, stepGoal)
  }

  countSeen (visited: Array<Array<number | undefined>>, stepGoal: number): number {
    let count = 0
    visited.forEach(row => {
      row.forEach(seen => {
        if (seen !== undefined && seen <= stepGoal && seen % 2 === stepGoal % 2) count++
      })
    })
    return count
  }

  // fill a grid with bfs; visited is a 2d array storing min steps to reach
  bfs (start: P, visited: Array<Array<number | undefined>>, maxDepth: number): void {
    const queue = [start]
    let depth = 1
    while (queue.length > 0) {
      for (let size = queue.length; size > 0; size--) {
        const p = queue.shift()
        if (p === undefined) throw new Error('unreachable')
        for (let dir: Dir = 0; dir < 4; dir++) {
          const [dx, dy] = delta[dir]
          const n = { x: p.x + dx, y: p.y + dy }
          if (n.x >= 0 && n.x < this.width && n.y >= 0 && n.y < this.height && this.grid[n.y][n.x] === Tile.plot) {
            if (visited[n.y][n.x] === undefined) {
              visited[n.y][n.x] = depth
              if (depth < maxDepth) queue.push(n)
            }
          }
        }
      }
      depth++
    }
    // check assumption that there are no nooks or crannies that would take more
    // steps than just walking arpound the edge.  if this was true, we would need
    // to track it and it would affect which grids could be counted as fully filled,
    // but it is false for my input.
    if (depth > (this.width * this.height + 1)) throw new Error('Max depth was higher than expected')
  }

  // performs a BFS search from each corner and the centre and store
  // them for later use
  setupFills (): void {
    // TODO: should the corners be marked with 0 instead of the 2 that this works out for them?
    this.fillCache = [
      this.grid.map(row => row.map(_ => undefined)),
      this.grid.map(row => row.map(_ => undefined)),
      this.grid.map(row => row.map(_ => undefined)),
      this.grid.map(row => row.map(_ => undefined)),
      this.grid.map(row => row.map(_ => undefined))
    ]
    this.bfs(this.start, this.fillCache[Fill.centre], Infinity)
    this.bfs({ x: this.width - 1, y: 0 }, this.fillCache[Fill.ne], Infinity)
    this.bfs({ x: this.width - 1, y: this.height - 1 }, this.fillCache[Fill.se], Infinity)
    this.bfs({ x: 0, y: this.height - 1 }, this.fillCache[Fill.sw], Infinity)
    this.bfs({ x: 0, y: 0 }, this.fillCache[Fill.nw], Infinity)
  }

  // number of final steps we can reach, assuming starting at a specific fill
  // TODO: add a cache here, there's way less cobmination of parameters
  // than there are boundary grids
  // This is valid for all G(x,y) where x != 0 || y != 0 || (x == 0 && y ==0)
  countFill (fill: Fill, stepGoal: number): number {
    // TODO: Make these an error? We should be able to prevent calling for any grid which has
    // no chance of being reached.
    if (stepGoal < 0) return 0 // shouldn't happen?
    if (stepGoal === 0) return 1 // reached corner with no remaining steps

    return sum(
      this.fillCache[fill].map(row => row.filter(seen => {
        return seen !== undefined && seen <= stepGoal && seen % 2 === stepGoal % 2
      }).length)
    )
  }

  endPointsInGrid (gx: number, gy: number, stepGoal: number): number {
    let quadrant: Fill
    if (gx === 0 && gy === 0) {
      // G(0,0) is the same as for part 1
      const r = this.countFill(Fill.centre, stepGoal)
      // console.log(`G(${gx},${gy}): starting at`, this.start, `with ${stepGoal} steps remaining, can reach`, r, 'positions')
      return r
    } else if (gx < 0 && gy < 0) {
      quadrant = Fill.nw
    } else if (gx > 0 && gy < 0) {
      quadrant = Fill.ne
    } else if (gx < 0 && gy > 0) {
      quadrant = Fill.sw
    } else if (gx > 0 && gy > 0) {
      quadrant = Fill.se
    } else {
      // TODO: How to generalise the axes?
      // At least for the example input, the search start
      // Immediate neighbours have specific shortest entry points.
      // This will almost certainly not hold true for the real input.
      if (1 + 1 === 1 && gx === -1 && gy === 0) {
        const visited: Array<Array<number | undefined>> = this.grid.map(row => row.map(_ => undefined))
        console.log({ stepGoal })
        // NOTE: not true in general, low values require multiple entry points
        this.bfs({ x: 10, y: 4 }, visited, stepGoal - 7)
        this.debugFill(visited)
        return this.countSeen(visited, stepGoal - 7)
      }
      console.log(`G(${gx},${gy}): Can't count yet`)
      return 0
    }
    const nearestCorner = oppositeCorner[quadrant]
    const initialSteps = this.stepsFromStartToCorner(quadrant)
    const walkFrom = this.gridCorner(0, 0, quadrant)
    const walkTo = this.gridCorner(gx, gy, nearestCorner)
    const walkSteps = manhattan(walkFrom, walkTo)
    const remainingSteps = stepGoal - (initialSteps + walkSteps)
    const r = this.countFill(nearestCorner, remainingSteps)
    // console.log(`G(${gx},${gy}): initialSteps=${initialSteps} then walk from`, walkFrom, 'to', walkTo, `taking ${walkSteps} steps, arriving with ${remainingSteps} steps remaining, can reach`, r, 'positions')
    return r
  }

  debugFill (fill: Array<Array<undefined | number>>): void {
    fill.forEach((row, y) => {
      row.forEach((seen, x) => {
        if (this.grid[y][x] === Tile.rock) {
          process.stdout.write('#')
        } else if (seen !== undefined) {
          process.stdout.write(seen.toString(36))
        } else {
          process.stdout.write('.')
        }
      })
      process.stdout.write('\n')
    })
  }
}

export class Day21 extends Solution {
  part1 = (stepGoal: number = 64): number => new Garden(this.inputLines()).countEndPoints(stepGoal)

  part2 (stepGoal: number = 26501365): number | string {
    if (stepGoal > 6) return '<not working yet>'
    const garden = new Garden(this.inputLines())
    garden.setupFills()

    // work out the furthest that is possible to reach along the axes (if we could move in a direct line from S)
    // TODO: walk the boundary grids, add the internal grids assuming they fill completely
    const maxG = Math.ceil((stepGoal - garden.start.x) / garden.width)
    let count = 0
    for (let gy = -maxG; gy <= maxG; gy++) {
      for (let gx = -maxG; gx <= maxG; gx++) {
        count += garden.endPointsInGrid(gx, gy, stepGoal)
      }
    }
    return count
  }
}
