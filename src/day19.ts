import Solution from './solution'
import { sum, must } from './util'

enum Cat {
  x,
  m,
  a,
  s
}

const toCat: Record<string, Cat> = {
  x: Cat.x,
  m: Cat.m,
  a: Cat.a,
  s: Cat.s
}

enum Op {
  lt,
  gt,
  accept,
  reject,
  goto
}

// True if part's <cat> is <op> <val>; if so sent to workflow <target>
interface Rule {
  cat?: Cat
  op: Op
  val?: number
  target?: string
}

const parseRule = (s: string): Rule => {
  if (s === 'A') return { op: Op.accept }
  if (s === 'R') return { op: Op.reject }
  if (!s.includes(':')) return { op: Op.goto, target: s }
  const ltPos = s.indexOf('<')
  const gtPos = s.indexOf('>')
  const opPos = ltPos > -1 ? ltPos : gtPos
  const colonPos = s.indexOf(':')
  const cat = toCat[s.substring(0, opPos)]
  const op = ltPos > -1 ? Op.lt : Op.gt
  const val = parseInt(s.substring(opPos + 1, colonPos))
  const target = s.substring(colonPos + 1)
  return { cat, op, val, target }
}

class Workflow {
  name: string
  rules: Rule[]

  constructor (input: string) {
    this.name = input.substring(0, input.indexOf('{'))
    this.rules = input.substring(input.indexOf('{') + 1, input.indexOf('}')).split(',').map(parseRule)
  }
}

class System {
  workflows: Map<string, Workflow>

  constructor (workflows: Workflow[]) {
    this.workflows = new Map()
    workflows.forEach(workflow => this.workflows.set(workflow.name, workflow))
  }

  accept (part: Part): boolean {
    let workflowName = 'in'
    while (true) {
      const workflow = must(this.workflows.get(workflowName))
      const rule = workflow.rules.find(rule => {
        switch (rule.op) {
          case Op.lt: return part[must(rule.cat)] < must(rule.val)
          case Op.gt: return part[must(rule.cat)] > must(rule.val)
        }
        return true
      })
      switch (rule?.op) {
        case Op.accept:
          return true
        case Op.reject:
          return false
        case Op.lt:
        case Op.gt:
        case Op.goto:
          workflowName = must(must(rule).target)
          if (workflowName === 'A') return true
          if (workflowName === 'R') return false
          break
        default:
          throw new Error('unreachable')
      }
    }
  }
}

type Part = number[] // indexed by Cat

const parsePart = (s: string): Part => {
  const part = [0, 0, 0, 0]
  const ratings = s.substring(1, s.indexOf('}'))
  ratings.split(',').forEach(rating => {
    const [cat, val] = rating.split('=')
    part[toCat[cat]] = +val
  })
  return part
}

export class Day19 extends Solution {
  part1 (): number {
    const system = this.getSystem()
    return sum(this.getParts().filter(part => system.accept(part)).map(part => sum(part)))
  }

  part2 (): number {
    return 0
  }

  getSystem = (): System => new System(this.inputParagraphs()[0].split('\n').map(line => new Workflow(line)))

  getParts = (): Part[] => this.inputParagraphs()[1].split('\n').map(line => parsePart(line))
}
