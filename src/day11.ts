import Solution from './solution'

interface P { x: number, y: number }

class Image {
  width: number
  height: number
  galaxies: P[]

  constructor (lines: string[]) {
    this.galaxies = []
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[y].length; x++) {
        if (lines[y][x] === '#') this.galaxies.push({ x, y })
      }
    }
    this.height = lines.length
    this.width = lines[0].length
  }

  expandSpace (f: number): void {
    // expand empty rows
    for (let y = 0; y < this.height; y++) {
      if (this.galaxies.every(p => p.y !== y)) {
        this.galaxies.filter(p => p.y > y).forEach(p => { p.y += f })
        y += f
        this.height += f
      }
    }
    // expand empty columns
    for (let x = 0; x < this.width; x++) {
      if (this.galaxies.every(p => p.x !== x)) {
        this.galaxies.filter(p => p.x > x).forEach(p => { p.x += f })
        x += f
        this.width += f
      }
    }
  }

  distance (a: number, b: number): number {
    return Math.abs(this.galaxies[a].x - this.galaxies[b].x) +
           Math.abs(this.galaxies[a].y - this.galaxies[b].y)
  }

  totalDistances (): number {
    let sumDistances = 0
    for (let fromGalaxy = 0; fromGalaxy < this.galaxies.length; fromGalaxy++) {
      for (let toGalaxy = fromGalaxy + 1; toGalaxy < this.galaxies.length; toGalaxy++) {
        sumDistances += this.distance(fromGalaxy, toGalaxy)
      }
    }
    return sumDistances
  }
}
export class Day11 extends Solution {
  part1 (): number {
    const image = this.parseInput()
    image.expandSpace(1)
    return image.totalDistances()
  }

  part2 (expand?: number): number {
    const image = this.parseInput()
    image.expandSpace(expand ?? 999999)
    return image.totalDistances()
  }

  parseInput = (): Image => new Image(this.inputLines())
}
