import { readFileSync } from 'node:fs'

const input = readFileSync('input/day4.txt', 'utf8').trimEnd().split(/\n/)

interface Card {
  num: number
  winningNumbers: number[]
  heldNumbers: number[]
}

const cards: Card[] = input.map(function (line) {
  const m = line.match(/^Card\s+(\d+):\s+(.*)\s+\|\s+(.*)$/)
  if (m === null) throw new Error(`parse error: ${line}`)

  const num = parseInt(m[1])
  const winningNumbers = m[2].split(/\s+/).map(s => parseInt(s))
  const heldNumbers = m[3].split(/\s+/).map(s => parseInt(s))

  return { num, winningNumbers, heldNumbers }
})

const part1 = cards.map(function (card) {
  const hits = card.winningNumbers.filter(n => card.heldNumbers.includes(n)).length
  return hits === 0 ? 0 : 2 ** (hits - 1)
}).reduce((acc, v) => acc + v)

console.log('Day 04, Part 1', part1)
