import Solution from './solution'

enum Dir {
  north,
  east,
  south,
  west
}

const delta: Record<Dir, [number, number]> = {
  [Dir.north]: [0, -1],
  [Dir.east]: [1, 0],
  [Dir.south]: [0, 1],
  [Dir.west]: [-1, 0]
}

// /
const mirrorA: Record<Dir, Dir> = {
  [Dir.north]: Dir.east,
  [Dir.east]: Dir.north,
  [Dir.south]: Dir.west,
  [Dir.west]: Dir.south
}

// \
const mirrorB: Record<Dir, Dir> = {
  [Dir.north]: Dir.west,
  [Dir.east]: Dir.south,
  [Dir.south]: Dir.east,
  [Dir.west]: Dir.north
}

interface Cell {
  thing: string
  energised: boolean
}

class Contraption {
  // beams are a 3d array of boolean indicating at least one beam is present (3rd dimension is direction 0-3)
  beams: boolean[][][]
  layout: Cell[][]

  constructor (input: string[]) {
    this.beams = []
    this.layout = input.map((line, y) => {
      this.beams.push([])
      return line.split('').map(c => {
        this.beams[y].push([false, false, false, false])
        return { thing: c, energised: false }
      })
    })
  }

  emptyBeams (): boolean[][][] {
    return this.beams.map(row => {
      return row.map(_ => [false, false, false, false])
    })
  }

  reset (): void {
    this.beams = this.emptyBeams()
    this.layout.forEach(row => { row.forEach(cell => { cell.energised = false }) })
  }

  countEnergised (): number {
    let c = 0
    this.layout.forEach(row => {
      row.forEach(cell => {
        if (cell.energised) c++
      })
    })
    return c
  }

  // returns the energised cell count from given starting position
  // TODO: can the state cache be shared?  I think it will need to be for part 2
  // as each sim takes about a second and we'll need 440 runs
  run (x: number, y: number, dir: Dir): number {
    this.reset()
    this.layout[y][x].energised = true
    console.log(x, y, dir, this.layout[y][x])
    // Direction of initial beam depends on mirror at 0,0
    switch (this.layout[y][x].thing) {
      case '.':
        this.beams[y][x][dir] = true
        break
      case '\\':
        this.beams[y][x][mirrorB[dir]] = true
        break
      case '/':
        this.beams[y][x][mirrorA[dir]] = true
        break
      case '|':
        if (dir === Dir.east || dir === Dir.west) {
          this.beams[y][x][Dir.north] = true
          this.beams[y][x][Dir.south] = true
        } else {
          this.beams[y][x][dir] = true
        }
        break
      case '-':
        if (dir === Dir.north || dir === Dir.south) {
          this.beams[y][x][Dir.east] = true
          this.beams[y][x][Dir.west] = true
        } else {
          this.beams[y][x][dir] = true
        }
        break
      default:
        throw new Error('Unhandled input')
    }
    const seen: Record<string, boolean> = {}
    while (true) {
      this.move()
      const st = this.state()
      if (seen[st] !== undefined) {
        const a = this.countEnergised()
        console.log(`Result for starting from ${x},${y} facing ${dir}`, a)
        return a
      }
      seen[st] = true
    }
  }

  // dump state to a unique string for loop detection
  state (): string {
    const st: string[] = []
    for (let y = 0; y < this.beams.length; y++) {
      for (let x = 0; x < this.beams[0].length; x++) {
        st.push(String.fromCharCode(this.beams[y][x].reduce((acc, v) => acc << 1 | (v ? 1 : 0), 0) + 65))
      }
    }
    return st.join('')
  }

  move (): void {
    const newBeams = this.emptyBeams()

    for (let y = 0; y < this.beams.length; y++) {
      for (let x = 0; x < this.beams[0].length; x++) {
        for (let dir: Dir = 0; dir < 4; dir++) {
          if (this.beams[y][x][dir]) {
            const [dx, dy] = delta[dir]
            const nx = x + dx
            const ny = y + dy
            if (nx >= 0 && nx < this.beams[0].length && ny >= 0 && ny < this.beams.length) {
              this.layout[ny][nx].energised = true
              switch (this.layout[ny][nx].thing) {
                case '.':
                  newBeams[ny][nx][dir] = true
                  break
                case '/':
                  newBeams[ny][nx][mirrorA[dir]] = true
                  break
                case '\\':
                  newBeams[ny][nx][mirrorB[dir]] = true
                  break
                case '|':
                  if (dir === Dir.east || dir === Dir.west) {
                    newBeams[ny][nx][Dir.north] = true
                    newBeams[ny][nx][Dir.south] = true
                  } else {
                    newBeams[ny][nx][dir] = true
                  }
                  break
                case '-':
                  if (dir === Dir.north || dir === Dir.south) {
                    newBeams[ny][nx][Dir.east] = true
                    newBeams[ny][nx][Dir.west] = true
                  } else {
                    newBeams[ny][nx][dir] = true
                  }
                  break
                default:
                  throw new Error('unhandled input')
              }
            }
          }
        }
      }
    }

    this.beams = newBeams
  }
}

export class Day16 extends Solution {
  part1 (): number {
    const contraption = this.parseInput()
    contraption.run(0, 0, Dir.east)
    return contraption.countEnergised()
  }

  part2 (): number {
    const contraption = this.parseInput()
    let max = 0
    for (let x = 0; x < contraption.layout[0].length; x++) {
      const r = Math.max(
        contraption.run(x, 0, Dir.south),
        contraption.run(x, contraption.layout.length - 1, Dir.north)
      )
      if (r > max) max = r
    }
    for (let y = 0; y < contraption.layout.length; y++) {
      const r = Math.max(
        contraption.run(0, y, Dir.east),
        contraption.run(contraption.layout[0].length - 1, y, Dir.west)
      )
      if (r > max) max = r
    }
    return max
  }

  parseInput = (): Contraption => new Contraption(this.inputLines())
}
