import Solution from './solution'
import { must } from './util'

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

const parseDir2: Record<string, Dir> = {
  0: Dir.east,
  1: Dir.south,
  2: Dir.west,
  3: Dir.north
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
}

class Lagoon {
  // Marks the line of the trench
  // each coordinate y,x in this grid is the top-left corner of a sqaure
  // that is from realY[y],realX[x] to realY[y+1],realX[x+1]
  trench: boolean[][]

  // Maps real grid indexes to real coordinates
  realX: number[]
  realY: number[]

  // Maps from the real coordinates to grid indexes
  gridX: Record<number, number>
  gridY: Record<number, number>

  constructor () {
    this.trench = []

    this.realX = []
    this.realY = []

    this.gridX = {}
    this.gridY = {}
  }

  dig (instructions: Instruction[]): void {
    const realDigger = { x: 0, y: 0 }
    this.realX.push(0)
    this.realY.push(0)
    // first trace the path and record the index offsets that matter
    instructions.forEach(instr => {
      const [dx, dy] = delta[instr.dir]
      realDigger.x += dx * instr.distance
      realDigger.y += dy * instr.distance
      this.insertSorted(this.realX, realDigger.x)
      this.insertSorted(this.realX, realDigger.x + 1)
      this.insertSorted(this.realY, realDigger.y)
      this.insertSorted(this.realY, realDigger.y + 1)
    })
    // insert fake boundaries just past the real limits of the trench; this is so the
    // later fill can definitely move around the trench line
    this.realX.unshift(this.realX[0] - 1)
    this.realY.unshift(this.realY[0] - 1)
    this.realX.push(this.realX[this.realX.length - 1] + 1)
    this.realY.push(this.realY[this.realY.length - 1] + 1)
    // console.log('realX', this.realX)
    // console.log('realY', this.realY)

    // setup array which marks the trench location
    this.trench = this.realY.map(_ => this.realX.map(_ => false))

    // setup reverse map from real coordinates to grid indexes
    this.realX.forEach((x, i) => { this.gridX[x] = i })
    this.realY.forEach((y, i) => { this.gridY[y] = i })
    // console.log('gridX', this.gridX)
    // console.log('gridY', this.gridY)

    // const tx: Record<number, number> = {}
    // this.realX.forEach((x, i) => { tx[x] = i })
    // console.log('tx', tx)
    // const ty: Record<number, number> = {}
    // this.realY.forEach((y, i) => { ty[y] = i })

    // walk the instructions again to mark out the trench on the grid
    const digger = this.toGrid({ x: 0, y: 0 })
    // console.log('digger starts at', digger, 'which is really', this.toReal(digger))
    instructions.forEach(instr => {
      // console.log('instruction', instr)
      const [dx, dy] = delta[instr.dir]
      const realTarget: P = { x: this.realX[digger.x] + dx * instr.distance, y: this.realY[digger.y] + dy * instr.distance }
      // console.log('realTarget', realTarget)
      const target: P = this.toGrid(realTarget)
      // console.log('target', target, 'which is really', this.toReal(target))
      while (digger.x !== target.x || digger.y !== target.y) {
        digger.x += dx
        digger.y += dy
        // console.log('digger moved to', digger, 'which really means', this.toReal(digger))
        this.trench[digger.y][digger.x] = true
        // if (digger.x < 0 || digger.y < 0 || digger.x >= this.realX.length || digger.y >= this.realY.length) throw new Error('bad movement')
        this.trench[digger.y][digger.x] = true
      }
      // console.log('ok digger made it to', digger, 'which is really', this.toReal(digger))
    })
  }

  // to find the size of the interior, we use a DFS to find grid positions
  // that are outside.  Anything not found is inside.
  interiorSize (): number {
    const exterior: boolean[][] = this.trench.map(row => row.map(_ => false))
    this.dfs(exterior, { x: 0, y: 0 })

    // console.log(exterior)
    let intArea = 0
    for (let y = 0; y < exterior.length - 1; y++) {
      for (let x = 0; x < exterior[0].length - 1; x++) {
        if (!exterior[y][x]) intArea += this.area({ x, y })
        // const area = this.area({ x, y })
        // if (exterior[y][x]) {
        //   console.log(`Grid ${x},${y} is outside, it correspondes to:`, this.toReal({ x, y }), 'to', this.toReal({ x: x + 1, y: y + 1 }), 'with area', area)
        // } else {
        //   console.log(`Grid ${x},${y} is inside, it correspondes to:`, this.toReal({ x, y }), 'to', this.toReal({ x: x + 1, y: y + 1 }), 'with area', area)
        //   intArea += area
        // }
      }
    }
    return intArea
  }

  private dfs (visited: boolean[][], start: P): void {
    const stack: P[] = [start]
    while (stack.length > 0) {
      const p = must(stack.pop())
      visited[p.y][p.x] = true
      for (let dir: Dir = 0; dir < 4; dir++) {
        const [dx, dy] = delta[dir]
        const nx = p.x + dx
        const ny = p.y + dy
        if (nx < 0 || nx >= visited[0].length || ny < 0 || ny >= visited.length) continue
        if (visited[ny][nx]) continue
        if (this.trench[ny][nx]) continue
        stack.push({ x: nx, y: ny })
      }
    }
  }

  private insertSorted (a: number[], n: number): void {
    for (let i = 0; i < a.length; i++) {
      if (n === a[i]) return
      if (n < a[i]) {
        a.splice(i, 0, n)
        return
      }
    }
    a.push(n)
  }

  private toReal (p: P): P {
    return { x: this.realX[p.x], y: this.realY[p.y] }
  }

  private toGrid (p: P): P {
    return { x: this.gridX[p.x], y: this.gridY[p.y] }
  }

  private area (p: P): number {
    const topLeft = this.toReal(p)
    const bottomRight = this.toReal({ x: p.x + 1, y: p.y + 1 })
    return (bottomRight.x - topLeft.x) * (bottomRight.y - topLeft.y)
  }
}

export class Day18 extends Solution {
  part1 (): number {
    const lagoon = new Lagoon()
    lagoon.dig(this.instructions())
    return lagoon.interiorSize()
  }

  part2 (): number {
    const lagoon = new Lagoon()
    lagoon.dig(this.correctedInstructions())
    return lagoon.interiorSize()
  }

  instructions (): Instruction[] {
    return this.inputLines().map(line => {
      const data = line.split(' ')
      return { dir: parseDir[data[0]], distance: +data[1] }
    })
  }

  correctedInstructions (): Instruction[] {
    return this.inputLines().map(line => {
      const data = line.split(' ')
      return {
        dir: parseDir2[data[2].substring(7, 8)],
        distance: parseInt(data[2].substring(2, 7), 16)
      }
    })
  }
}
