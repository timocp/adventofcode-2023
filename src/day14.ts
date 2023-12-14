import Solution from './solution'

enum Rock {
  none,
  round,
  cube
}

const tiltNorth = (platform: Rock[][]): void => {
  const stops: number[] = platform[0].map(r => r === Rock.none ? -1 : 0)

  for (let row = 1; row < platform.length; row++) {
    for (let col = 0; col < platform[0].length; col++) {
      if (platform[row][col] === Rock.round) {
        if (platform[stops[col] + 1][col] === Rock.none) {
          platform[stops[col] + 1][col] = Rock.round
          platform[row][col] = Rock.none
        }
        stops[col]++
      } else if (platform[row][col] === Rock.cube) {
        stops[col] = row
      }
    }
  }
}

const platformToString = (platform: Rock[][]): string => {
  const tr: Record<Rock, string> = {
    [Rock.none]: '.',
    [Rock.round]: 'O',
    [Rock.cube]: '#'
  }
  return platform.map(row => {
    return row.map(rock => tr[rock]).join('')
  }).join('\n')
}

const totalLoad = (platform: Rock[][]): number => {
  let load = 0
  for (let row = 0; row < platform.length; row++) {
    platform[row].forEach(rock => { if (rock === Rock.round) load += platform.length - row })
  }
  return load
}

export class Day14 extends Solution {
  part1 (): number {
    const platform = this.parseInput()
    tiltNorth(platform)
    return totalLoad(platform)
  }

  part2 (): number {
    return 0
  }

  parseInput (): Rock[][] {
    const tr: Record<string, Rock> = {
      '.': Rock.none,
      O: Rock.round,
      '#': Rock.cube
    }
    return this.inputLines().map(line => line.split('').map(c => tr[c]))
  }
}
