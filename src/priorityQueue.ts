type PriorityQueueItem<T> = [number, T]

export class PriorityQueue<T> {
  private readonly heap: Array<PriorityQueueItem<T>>

  constructor () {
    this.heap = []
  }

  push (item: T, priority: number): void {
    this.heap.push([priority, item])
    this.bubbleUp()
  }

  pop (): T {
    if (this.heap.length === 0) throw new Error('Attempted to pop from an empty priority queue')
    const min = this.heap[0]
    if (this.heap.length > 1) this.heap[0] = this.heap[this.heap.length - 1]
    this.heap.pop()
    this.bubbleDown()
    return min[1]
  }

  private bubbleUp (): void {
    let index = this.heap.length - 1
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.heap[parentIndex][0] < this.heap[index][0]) break
      this.swap(parentIndex, index)
      index = parentIndex
    }
  }

  private bubbleDown (): void {
    let index = 0
    while (true) {
      const leftIndex = 2 * index + 1
      const rightIndex = 2 * index + 2
      if (leftIndex >= this.heap.length) break
      let smallerChildIndex = leftIndex
      if (rightIndex < this.heap.length && this.heap[rightIndex][0] < this.heap[leftIndex][0]) {
        smallerChildIndex = rightIndex
      }
      if (this.heap[index][0] < this.heap[smallerChildIndex][0]) {
        break
      } else {
        this.swap(index, smallerChildIndex)
      }
      index = smallerChildIndex
    }
  }

  private swap (source: number, target: number): void {
    const tmp = this.heap[source]
    this.heap[source] = this.heap[target]
    this.heap[target] = tmp
  }

  size = (): number => this.heap.length
}
