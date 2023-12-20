import Solution from './solution'

enum Pulse {
  low,
  high
}

enum State {
  on,
  off
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
  unknown
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
  lastPulse: Pulse[][] // what was last received from each input module
  broadcaster: number
  counter: [number, number] // number of times [low,high] pulses have been sent

  constructor (modules: Module[]) {
    this.modules = modules
    this.state = modules.map(_ => State.off)
    // this.lastPulse = modules.map(mod => {
    //   if (mod.kind === ModuleKind.conjunction) {
    //     return mod.inputs.map(_ => Pulse.low)
    //   } else {
    //     return []
    //   }
    // })
    this.lastPulse = modules.map(mod => mod.inputs.map(_ => Pulse.low))
    this.broadcaster = modules.findIndex(mod => mod.kind === ModuleKind.broadcast)
    this.counter = [0, 0]
  }

  pushButton (): void {
    // TODO: dequeue would be more efficient as we need to shift a lot
    const signals: Signal[] = [{ pulse: Pulse.low, from: -1, to: this.broadcaster }]

    while (signals.length > 0) {
      const signal = signals.shift()
      if (signal === undefined) throw new Error('unreachable')
      // this.debug(signal)
      this.counter[signal.pulse]++
      const nextPulse = this.process(signal)
      if (nextPulse !== null) {
        this.modules[signal.to].outputs.forEach(output => {
          signals.push({ pulse: nextPulse, from: signal.to, to: output })
        })
      }
    }
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
        if (this.lastPulse[signal.to].every(p => p === Pulse.high)) return Pulse.low
        return Pulse.high
      }
      case ModuleKind.broadcast:
        return signal.pulse
      case ModuleKind.unknown:
        return null
    }
  }

  private debug (signal: Signal): void {
    const from = signal.from === -1 ? 'button' : this.modules[signal.from].name
    const strength = signal.pulse === Pulse.low ? 'low' : 'high'
    const to = this.modules[signal.to].name
    console.log(`${from} -${strength}-> ${to}`)
  }
}

export class Day20 extends Solution {
  part1 (pushes: number = 1000): number {
    const sim = new Sim(this.getModules())
    for (let i = 0; i < pushes; i++) sim.pushButton()
    return sim.counter[0] * sim.counter[1]
  }

  part2 = (): number => 0

  getModules (): Module[] {
    const input = this.inputLines().map(line => line.split(' -> '))

    // first pass to setup types and name
    const modules = input.map(([lhs, _]) => {
      const [kind, name] = this.parseLhs(lhs)
      return { kind, name, outputs: [] as number[], inputs: [] as number[] }
    })

    // check for undefined target modules that only appear on rhs
    input.forEach(([_, rhs]) => {
      rhs.split(', ').forEach(otherName => {
        if (modules.findIndex(mod => mod.name === otherName) === -1) {
          modules.push({ kind: ModuleKind.unknown, name: otherName, outputs: [], inputs: [] })
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
