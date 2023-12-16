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

  resetBeams (): void {
    this.beams = this.emptyBeams()
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
  run (): number {
    // Direction of initial beam depends on mirror at 0,0
    switch (this.layout[0][0].thing) {
      case '\\':
        this.beams[0][0][Dir.south] = true
        break
      case '/':
        this.beams[0][0][Dir.north] = true
        break
      case '|':
        this.beams[0][0][Dir.north] = true
        this.beams[0][0][Dir.south] = true
        break
      default:
        this.beams[0][0][Dir.east] = true
    }
    this.layout[0][0].energised = true
    const seen: Record<string, number> = {}
    while (true) {
      this.move()
      const st = this.state()
      if (seen[st] !== undefined) return seen[st]
      seen[st] = this.countEnergised()
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
    contraption.run()
    return contraption.countEnergised()
  }

  part2 (): number {
    return 0
  }

  parseInput = (): Contraption => new Contraption(this.inputLines())
}
