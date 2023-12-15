import Solution from './solution'
import { sum } from './util'

export const hash = (s: string): number => {
  return s.split('').map(c => c.charCodeAt(0)).reduce((acc, v) => ((acc + v) * 17) % 256, 0)
}

interface Step {
  label: string
  op: string
  focal?: number
}

interface Lens {
  label: string
  focal: number
}

export class Day15 extends Solution {
  part1 = (): number => sum(this.inputLines()[0].split(',').map(instr => hash(instr)))

  part2 (): number {
    const boxes: Lens[][] = Array(256)
    for (let i = 0; i < boxes.length; i++) {
      boxes[i] = []
    }
    this.steps().forEach(step => {
      const box = hash(step.label)
      switch (step.op) {
        case '-':
          boxes[box] = boxes[box].filter(lens => lens.label !== step.label)
          break
        case '=':
          {
            const index = boxes[box].findIndex(lens => lens.label === step.label)
            if (index > -1) {
              boxes[box][index].focal = step.focal ?? 0
            } else {
              boxes[box].push({ label: step.label, focal: step.focal ?? 0 })
            }
          }
          break
      }
    })
    let power = 0
    for (let box = 0; box < boxes.length; box++) {
      for (let slot = 0; slot < boxes[box].length; slot++) {
        power += (box + 1) * (slot + 1) * boxes[box][slot].focal
      }
    }

    return power
  }

  steps = (): Step[] => this.inputLines()[0].split(',').map(s => {
    if (s.includes('=')) {
      const [label, focal] = s.split('=')
      return { label, op: '=', focal: +focal }
    } else {
      const [label] = s.split('-')
      return { label, op: '-' }
    }
  })
}
