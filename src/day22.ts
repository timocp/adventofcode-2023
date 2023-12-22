import Solution from './solution'
import { enumerate, must, sum } from './util'

interface P {
  x: number
  y: number
  z: number
}

interface Brick {
  label: string
  from: P
  to: P
}

const segments = (brick: Brick): P[] => {
  const a: P[] = []
  if (brick.from.x !== brick.to.x) {
    for (let x = Math.min(brick.from.x, brick.to.x); x <= Math.max(brick.from.x, brick.to.x); x++) {
      a.push({ x, y: brick.to.y, z: brick.to.z })
    }
  } else if (brick.from.y !== brick.to.y) {
    for (let y = Math.min(brick.from.y, brick.to.y); y <= Math.max(brick.from.y, brick.to.y); y++) {
      a.push({ x: brick.to.x, y, z: brick.to.z })
    }
  } else {
    for (let z = Math.min(brick.from.z, brick.to.z); z <= Math.max(brick.from.z, brick.to.z); z++) {
      a.push({ x: brick.to.x, y: brick.to.y, z })
    }
  }
  return a
}

const findGap = (column: string[], label: string): number => {
  let top = 0 // assume ground is always at 0
  for (let i = 1; i < column.length; i++) {
    if (column[i] === label) {
      return i - top - 1
    } else if (column[i] !== '.') {
      top = i
    }
  }
  throw new Error(`couldn't find ${label} in ${column.join(',')}`)
}

class FallingBricks {
  bricks: Brick[]
  space: string[][][]
  _holdingUp: Map<string, Set<string>>
  _heldUpBy: Map<string, Set<string>>

  constructor (bricks: Brick[]) {
    this.bricks = bricks

    // 3d array to hold the brick positions
    const maxx = Math.max(...bricks.flatMap(brick => [brick.from.x, brick.to.x]))
    const maxy = Math.max(...bricks.flatMap(brick => [brick.from.y, brick.to.y]))
    this.space = enumerate(maxy + 1).map(_ => enumerate(maxx + 1).map(_ => ['#']))

    this._holdingUp = new Map<string, Set<string>>()
    this._heldUpBy = new Map<string, Set<string>>()
    bricks.forEach(brick => {
      this._holdingUp.set(brick.label, new Set())
      this._heldUpBy.set(brick.label, new Set())
    })
  }

  holdingUp = (label: string): string[] => Array.from(must(this._holdingUp.get(label)))
  heldUpBy = (label: string): string[] => Array.from(must(this._heldUpBy.get(label)))

  dropBricks (): void {
    this.bricks.forEach(brick => {
      // insert the brick into the 3d array
      segments(brick).forEach(p => {
        while (this.space[p.y][p.x].length <= p.z) this.space[p.y][p.x].push('.')
        this.space[p.y][p.x][p.z] = brick.label
      })

      // if the brick can fall, move it down
      if (brick.from.x !== brick.to.x || brick.from.y !== brick.to.y) {
        const gap = Math.min(...segments(brick).map(p => findGap(this.space[p.y][p.x], brick.label)))
        if (gap > 0) {
          segments(brick).forEach(p => {
            this.space[p.y][p.x].splice(brick.to.z - gap, gap)
          })
          brick.to.z -= gap
          brick.from.z -= gap
        }
      } else {
        const gap = findGap(this.space[brick.to.y][brick.to.x], brick.label)
        if (gap > 0) {
          this.space[brick.to.y][brick.to.x].splice(Math.min(brick.from.z, brick.to.z) - gap, gap)
          brick.to.z -= gap
          brick.from.z -= gap
        }
      }
    })
    this.setupMaps()
  }

  private setupMaps (): void {
    this.bricks.forEach(brick => {
      segments(brick).forEach(p => {
        const above = this.space[p.y][p.x][p.z + 1] ?? '.'
        if (above !== '.' && above !== brick.label) {
          must(this._holdingUp.get(brick.label)).add(above)
          must(this._heldUpBy.get(above)).add(brick.label)
        }
      })
    })
  }

  countDisintegratable (): number {
    // finally, count the ones that could be removed without others falling
    let count = 0
    this.bricks.forEach(brick => {
      if (this.holdingUp(brick.label).length === 0) {
        count++
      } else if (this.holdingUp(brick.label).every(b => this.heldUpBy(b).length > 1)) {
        count++
      }
    })
    return count
  }

  chainReaction (): number {
    return sum(this.bricks.map(brick => {
      const destroyed = new Set<string>()
      this.chainReactionFrom(brick.label, destroyed)
      return destroyed.size
    }))
  }

  private chainReactionFrom (label: string, destroyed: Set<string>): void {
    const destroying: string[] = []
    this.holdingUp(label).forEach(above => {
      if (this.heldUpBy(above).filter(other => !(other === label || destroyed.has(other))).length === 0) {
        destroying.push(above)
        destroyed.add(above)
      }
    })
    destroying.forEach(above => { this.chainReactionFrom(above, destroyed) })
  }
}

export class Day22 extends Solution {
  part1 (): number {
    const fb = new FallingBricks(this.getBricks())
    fb.dropBricks()
    return fb.countDisintegratable()
  }

  part2 (): number {
    const fb = new FallingBricks(this.getBricks())
    fb.dropBricks()
    return fb.chainReaction()
  }

  // returns bricks from snapshot, sorted by height (z)
  getBricks (): Brick[] {
    const bricks = this.inputLines().map((line, n) => {
      const coords = line.split('~').map(coord => coord.split(','))
      return {
        label: (n + 10).toString(36).toUpperCase(),
        from: { x: +coords[0][0], y: +coords[0][1], z: +coords[0][2] },
        to: { x: +coords[1][0], y: +coords[1][1], z: +coords[1][2] }
      }
    })
    bricks.sort((a: Brick, b: Brick) => {
      const az = Math.min(a.from.z, a.to.z)
      const bz = Math.min(b.from.z, b.to.z)
      if (az < bz) return -1
      if (az > bz) return 1
      if (a.from.x < b.from.x) return -1
      if (a.from.x > b.from.x) return 1
      if (a.from.y < b.from.y) return -1
      if (a.from.y > b.from.y) return 1
      return 0
    })
    return bricks
  }
}
