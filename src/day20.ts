import Solution from './solution'
import { product } from './util'

enum Pulse {
  low,
  high
}

enum State {
  off,
  on
}

interface Signal {
  pulse: Pulse
  from: number
  to: number
}

enum ModuleKind {
  broadcast,
  flipflop,
  conjunction,
  external
}

interface Module {
  kind: ModuleKind
  name: string
  outputs: number[]
  inputs: number[] // for conjunctions only
}

class Sim {
  modules: Module[]
  state: State[] // current on/off state (only relevant for flipflips)
  lastPulse: Pulse[][] // conjunction memory; what was last received from each of its input modules
  broadcaster: number // module number of the broadcast node
  counter: [number, number] // number of times [low,high] pulses have been sent
  pushes: number
  conjunctionActivated: Array<number | undefined> // set to the push number when a conjunction first sends a low pulse

  constructor (modules: Module[]) {
    this.modules = modules
    this.state = modules.map(_ => State.off)
    this.lastPulse = modules.map(mod => mod.inputs.map(_ => Pulse.low))
    // modules.forEach(mod => { if (mod.kind === ModuleKind.conjunction) console.log(`& ${mod.name} has ${mod.inputs.length} bits`) })
    this.broadcaster = modules.findIndex(mod => mod.kind === ModuleKind.broadcast)
    this.counter = [0, 0]
    this.pushes = 0
    this.conjunctionActivated = modules.map(_ => undefined)
  }

  pushButton (): void {
    this.pushes++
    const signals: Signal[] = [{ pulse: Pulse.low, from: -1, to: this.broadcaster }]

    while (signals.length > 0) {
      const signal = signals.shift()
      if (signal === undefined) throw new Error('unreachable')
      // this.debugSignal(signal)
      this.counter[signal.pulse]++
      const nextPulse = this.process(signal)
      if (nextPulse !== null) {
        this.modules[signal.to].outputs.forEach(output => {
          signals.push({ pulse: nextPulse, from: signal.to, to: output })
        })
      }
    }
    // this.debugConjunctions()
  }

  private process (signal: Signal): Pulse | null {
    switch (this.modules[signal.to].kind) {
      case ModuleKind.flipflop:
        if (signal.pulse === Pulse.high) return null
        if (this.state[signal.to] === State.off) {
          this.state[signal.to] = State.on
          return Pulse.high
        } else {
          this.state[signal.to] = State.off
          return Pulse.low
        }
      case ModuleKind.conjunction:
      {
        const lastIndex = this.modules[signal.to].inputs.findIndex(input => input === signal.from)
        if (lastIndex === -1) throw new Error('impossible signal received')
        this.lastPulse[signal.to][lastIndex] = signal.pulse
        if (this.lastPulse[signal.to].every(p => p === Pulse.high)) {
          if (this.conjunctionActivated[signal.to] === undefined) {
            this.conjunctionActivated[signal.to] = this.pushes
            // console.log(this.modules[signal.to].name, 'sent first low pulse after', this.pushes, 'pushes')
          }
          return Pulse.low
        }
        return Pulse.high
      }
      case ModuleKind.broadcast:
        return signal.pulse
      case ModuleKind.external:
        return null
    }
  }

  debugSignal (signal: Signal): void {
    const from = signal.from === -1 ? 'button' : this.modules[signal.from].name
    const strength = signal.pulse === Pulse.low ? 'low' : 'high'
    const to = this.modules[signal.to].name
    console.log(`${from} -${strength}-> ${to}`)
  }

  debugConjunctions (): void {
    const values: string[] = []
    this.modules.forEach((mod, m) => {
      if (mod.kind === ModuleKind.conjunction && mod.inputs.length > 1) {
        const value = this.lastPulse[m].reduce((acc, v, i) => acc + (v === Pulse.high ? 2 ** i : 0), 0)
          .toString(16)
          .padStart(((2 ** (this.lastPulse[m].length)) - 1).toString(16).length)
        values.push(`${mod.name}=${this.lastPulse[m].join('')} (${value})`)
      }
    })
    console.log('after', this.pushes.toString().padStart(5), 'pushes:', values.join(' '))
  }
}

export class Day20 extends Solution {
  part1 (pushes: number = 1000): number {
    const sim = new Sim(this.getModules())
    for (let i = 0; i < pushes; i++) sim.pushButton()
    return sim.counter[0] * sim.counter[1]
  }

  part2 (): number {
    // This is purely based on the observation that there are 4 conjunctions which take n pushes to
    // initially send a low pulse, where n is a prime number.  The product of n1..n4 is the answer.
    // Somehow when these all emit a low pulse during the same button press, this triggers the last
    // conjunction (bn) to receive all high pulses, which sends a low pulse to rx.
    //
    // I don't really understand the mechanism linking bn from the other conjunctions ¯\_(ツ)_/¯
    //
    // The rest of the conjunctions have single bit inputs that send low pulses on every push.
    const sim = new Sim(this.getModules())
    const conjunctions: number[] = sim.modules.map((mod, m) => mod.kind === ModuleKind.conjunction ? m : undefined).filter(m => m !== undefined).map(m => m as number)
    while (conjunctions.filter(m => sim.conjunctionActivated[m] === undefined).length > 1) sim.pushButton()
    return product(conjunctions.map(m => sim.conjunctionActivated[m] ?? 1))
  }

  getModules (): Module[] {
    const input = this.inputLines().map(line => line.split(' -> '))

    // first pass to setup types and name
    const modules = input.map(([lhs, _]) => {
      const [kind, name] = this.parseLhs(lhs)
      return { kind, name, outputs: [] as number[], inputs: [] as number[] }
    })

    // check for undefined target modules that only appear on rhs; this is the external module
    input.forEach(([_, rhs]) => {
      rhs.split(', ').forEach(otherName => {
        if (modules.findIndex(mod => mod.name === otherName) === -1) {
          modules.push({ kind: ModuleKind.external, name: otherName, outputs: [], inputs: [] })
        }
      })
    })

    const modMap = new Map<string, number>()
    modules.forEach((mod, i) => modMap.set(mod.name, i))

    // second pass to setup inputs/outputs
    input.forEach(([lhs, rhs]) => {
      const name = this.parseLhs(lhs)[1]
      const m = modMap.get(name)
      if (m === undefined) throw new Error(`Can't find module ${name}`)
      const mod = modules[m]
      rhs.split(', ').forEach(otherName => {
        const n = modMap.get(otherName)
        if (n === undefined) throw new Error(`Can't find module ${otherName}`)
        mod.outputs.push(n)
        const other = modules[n]
        if (other.kind === ModuleKind.conjunction) other.inputs.push(m)
      })
    })

    return modules
  }

  parseLhs (name: string): [ModuleKind, string] {
    if (name.startsWith('%')) {
      return [ModuleKind.flipflop, name.substring(1)]
    } else if (name.startsWith('&')) {
      return [ModuleKind.conjunction, name.substring(1)]
    } else {
      return [ModuleKind.broadcast, name]
    }
  }
}
