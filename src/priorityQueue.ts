// TODO: reverse the list, so we can pop to get the head
// TODO: Or, reimplement as a heap

type PriorityQueueItem<T> = [number, T]

export class PriorityQueue<T> {
  private readonly items: Array<PriorityQueueItem<T>>

  constructor () {
    this.items = []
  }

  push (item: T, priority: number): void {
    if (this.items.length === 0) {
      this.items.push([priority, item])
    } else {
      let added = false
      for (let i = 0; i < this.items.length; i++) {
        if (priority < this.items[i][0]) {
          this.items.splice(i, 0, [priority, item])
          added = true
          break
        }
      }
      if (!added) {
        this.items.push([priority, item])
      }
    }
  }

  pop (): T {
    const item = this.items.shift()
    if (item === undefined) throw new Error('Attempted to pop from empty queue')
    return item[1]
  }

  size = (): number => this.items.length

  // debugging only
  debug = (): Array<PriorityQueueItem<T>> => this.items
}
