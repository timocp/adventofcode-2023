import Solution from './solution'

interface Map {
  directions: string
  network: Record<string, [string, string]>
}

export class Day8 extends Solution {
  part1 (): number {
    const map = this.parseInput()
    let steps = 0
    let node = 'AAA'
    while (node !== 'ZZZ') {
      const dir = map.directions[steps % map.directions.length]
      if (dir === 'L') {
        node = map.network[node][0]
      } else if (dir === 'R') {
        node = map.network[node][1]
      }
      steps += 1
    }
    return steps
  }

  part2 (): number {
    return 0
  }

  parseInput (): Map {
    const [directions, lines] = this.inputParagraphs()
    const network: Record<string, [string, string]> = {}
    lines.split(/\n/).forEach(line => {
      const m = line.match(/^(\w+) = \((\w+), (\w+)\)$/)
      if (m === null) throw new Error(`Invalid input: ${line}`)
      network[m[1]] = [m[2], m[3]]
    })
    return {
      directions,
      network
    }
  }
}

(new Day8()).solve()
