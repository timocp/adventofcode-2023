import Solution from './solution'
import { sum, product, enumerate } from './util'

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

interface CompareRule {
  kind: 'compare'
  cat: Cat
  op: Op
  val: number
  target: string
}

interface GotoRule {
  kind: 'goto'
  target: string
}

interface AcceptRule {
  kind: 'accept'
  accept: boolean
}

type Rule = CompareRule | GotoRule | AcceptRule

const parseRule = (s: string): Rule => {
  if (s === 'A') return { kind: 'accept', accept: true }
  if (s === 'R') return { kind: 'accept', accept: false }
  if (!s.includes(':')) return { kind: 'goto', target: s }
  const ltPos = s.indexOf('<')
  const gtPos = s.indexOf('>')
  const opPos = ltPos > -1 ? ltPos : gtPos
  const colonPos = s.indexOf(':')
  const cat = toCat[s.substring(0, opPos)]
  const op = ltPos > -1 ? Op.lt : Op.gt
  const val = parseInt(s.substring(opPos + 1, colonPos))
  const target = s.substring(colonPos + 1)
  return { kind: 'compare', cat, op, val, target }
}

interface BranchNode {
  kind: 'branch'
  cat: Cat
  op: Op
  val: number
  true: Node
  false: Node
}

interface AcceptNode {
  kind: 'accept'
  accept: boolean
}

type Node = BranchNode | AcceptNode

interface Clamp {
  min: number
  max: number
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
  tree: Node

  constructor (workflows: Workflow[]) {
    this.workflows = new Map()
    workflows.forEach(workflow => this.workflows.set(workflow.name, workflow))
    this.tree = this.buildTree('in', 0)
    // console.log(this.tree)
  }

  buildTree = (workflowName: string, ruleNumber: number): Node => {
    const workflow = this.getWorkflow(workflowName)
    const rule = workflow.rules[ruleNumber]
    switch (rule.kind) {
      case 'compare':
        return {
          kind: 'branch',
          cat: rule.cat,
          op: rule.op,
          val: rule.val,
          true: this.targetToNode(rule.target),
          false: this.buildTree(workflowName, ruleNumber + 1)
        }
      case 'goto':
        return this.targetToNode(rule.target)
      case 'accept':
        return rule // AcceptRule and AcceptNode have same structure
    }
  }

  targetToNode = (target: string): Node => {
    if (target === 'A') return { kind: 'accept', accept: true }
    if (target === 'R') return { kind: 'accept', accept: false }
    return this.buildTree(target, 0)
  }

  getWorkflow (name: string): Workflow {
    const workflow = this.workflows.get(name)
    if (workflow === undefined) throw new Error(`Invalid workflow: ${name}`)
    return workflow
  }

  countDistinctCombinations (): number {
    let count = 0
    const startClamps: Clamp[] = enumerate(4).map(_ => {
      return { min: 1, max: 4000 }
    })
    this.walkTree(this.tree, startClamps, (clamps: Clamp[]) => {
      const sizes = clamps.map(c => c.max - c.min + 1)
      if (sizes.every(size => size >= 1)) count += product(sizes)
    })
    return count
  }

  // walk tree and call callback for each leaf with when accept:true
  // the value passed the the callmacks is the min/max for each cat that would have filtered to that node
  walkTree (node: Node, clamps: Clamp[], callback: (clamps: Clamp[]) => void): void {
    switch (node.kind) {
      case 'branch':
        switch (node.op) {
          case Op.lt:
            this.walkTree(node.true, clamps.map((c, i) => {
              return i === node.cat ? { min: c.min, max: Math.min(c.max, node.val - 1) } : c
            }), callback)
            this.walkTree(node.false, clamps.map((c, i) => {
              return i === node.cat ? { min: Math.max(c.min, node.val), max: c.max } : c
            }), callback)
            break
          case Op.gt:
            this.walkTree(node.true, clamps.map((c, i) => {
              return i === node.cat ? { min: Math.max(c.min, node.val + 1), max: c.max } : c
            }), callback)
            this.walkTree(node.false, clamps.map((c, i) => {
              return i === node.cat ? { min: c.min, max: Math.min(c.max, node.val) } : c
            }), callback)
        }
        break
      case 'accept':
        if (node.accept) callback(clamps)
    }
  }

  // TODO: probably can rewrite using tree
  accept (part: Part): boolean {
    let workflowName = 'in'
    while (true) {
      const workflow = this.getWorkflow(workflowName)
      const rule = workflow.rules.find(rule => {
        if (rule.kind === 'compare') {
          if (rule.op === Op.lt) return part[rule.cat] < rule.val
          if (rule.op === Op.gt) return part[rule.cat] > rule.val
        }
        return true
      })
      if (rule === undefined) throw new Error('unreachable')
      if (rule.kind === 'accept') return rule.accept
      workflowName = rule.target
      if (workflowName === 'A') return true
      if (workflowName === 'R') return false
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

  part2 = (): number => this.getSystem().countDistinctCombinations()

  getSystem = (): System => new System(this.inputParagraphs()[0].split('\n').map(line => new Workflow(line)))

  getParts = (): Part[] => this.inputParagraphs()[1].split('\n').map(line => parsePart(line))
}
