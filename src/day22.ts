import Solution from './solution'
import { enumerate, must } from './util'

// coords are always non-negative
interface P {
  x: number
  y: number
  z: number
}

interface Brick {
  label: string // just to match examples
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

const fall = (bricks: Brick[]): number => {
  const maxx = Math.max(...bricks.flatMap(brick => [brick.from.x, brick.to.x]))
  const maxy = Math.max(...bricks.flatMap(brick => [brick.from.y, brick.to.y]))

  const space: string[][][] = enumerate(maxy + 1).map(_ => enumerate(maxx + 1).map(_ => ['#']))

  bricks.forEach(brick => {
    // insert the brick into the 3d array
    segments(brick).forEach(p => {
      while (space[p.y][p.x].length <= p.z) space[p.y][p.x].push('.')
      space[p.y][p.x][p.z] = brick.label
    })

    // if the brick can fall, move it down
    if (brick.from.x !== brick.to.x || brick.from.y !== brick.to.y) {
      const gap = Math.min(...segments(brick).map(p => findGap(space[p.y][p.x], brick.label)))
      if (gap > 0) {
        segments(brick).forEach(p => {
          space[p.y][p.x].splice(brick.to.z - gap, gap)
        })
        brick.to.z -= gap
        brick.from.z -= gap
      }
    } else {
      const gap = findGap(space[brick.to.y][brick.to.x], brick.label)
      if (gap > 0) {
        space[brick.to.y][brick.to.x].splice(Math.min(brick.from.z, brick.to.z) - gap, gap)
        brick.to.z -= gap
        brick.from.z -= gap
      }
    }
  })

  // work out which bricks are resting on others
  const holdingUp = new Map<string, Set<string>>()
  const heldUpBy = new Map<string, Set<string>>()
  bricks.forEach(brick => {
    holdingUp.set(brick.label, new Set())
    heldUpBy.set(brick.label, new Set())
  })
  bricks.forEach(brick => {
    segments(brick).forEach(p => {
      const above = space[p.y][p.x][p.z + 1] ?? '.'
      if (above !== '.' && above !== brick.label) {
        holdingUp.get(brick.label)?.add(above)
        heldUpBy.get(above)?.add(brick.label)
      }
    })
  })
  // console.log({ heldUpBy, holdingUp })

  // finally, count the ones that could be removed without others falling
  let count = 0
  bricks.forEach(brick => {
    if (holdingUp.get(brick.label)?.size === 0) {
      // console.log(`Brick ${brick.label} can be disintegrated; it does not support other bricks`)
      count++
    } else {
      const above: string[] = Array.from(must(holdingUp.get(brick.label)).values())
      if (above.every(b => must(heldUpBy.get(b)).size > 1)) {
        // console.log(`Brick ${brick.label} can be disintegrated; the bricks above it are also supported by others`)
        count++
      } else {
        // console.log(`Brick ${brick.label} cannot be disintegrated; it is holding up bricks which no other support`)
      }
    }
  })

  return count
}

export class Day22 extends Solution {
  part1 (): number {
    return fall(this.getBricks())
  }

  part2 (): number {
    return 0
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
