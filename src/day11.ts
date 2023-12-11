import Solution from './solution'

interface P { x: number, y: number }

class Image {
  grid: Array<Array<number | null>>
  width: number
  height: number
  galaxies: number
  galaxyPositions: P[]

  constructor (lines: string[]) {
    this.galaxies = 0
    this.grid = lines.flatMap(line => {
      const row = line.split('').map(c => c === '#' ? this.galaxies++ : null)
      if (/^\.+$/.test(line)) {
        // double empty rows
        return [row, row]
      } else {
        return [row]
      }
    })
    // double empty columns
    for (let x = 0; x < this.grid[0].length; x++) {
      if (this.grid.every(row => row[x] === null)) {
        this.grid.forEach(row => row.splice(x, 0, null))
        x += 1
      }
    }

    this.width = this.grid[0].length
    this.height = this.grid.length

    // work out the positions of each galaxy
    this.galaxyPositions = []
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] !== null) this.galaxyPositions.push({ x, y })
      }
    }
  }

  distance (a: number, b: number): number {
    return Math.abs(this.galaxyPositions[a].x - this.galaxyPositions[b].x) +
           Math.abs(this.galaxyPositions[a].y - this.galaxyPositions[b].y)
  }
}

export class Day11 extends Solution {
  part1 (): number {
    const image = this.parseInput()

    let sumDistances = 0
    for (let fromGalaxy = 0; fromGalaxy < image.galaxies; fromGalaxy++) {
      for (let toGalaxy = fromGalaxy + 1; toGalaxy < image.galaxies; toGalaxy++) {
        sumDistances += image.distance(fromGalaxy, toGalaxy)
      }
    }
    return sumDistances
  }

  part2 (): number {
    return 0
  }

  parseInput (): Image {
    const image = new Image(this.inputLines())
    return image
  }
}
