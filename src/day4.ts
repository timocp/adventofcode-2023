import { readFileSync } from 'node:fs'

const input = readFileSync('input/day4.txt', 'utf8').trimEnd().split(/\n/)

interface Card {
  num: number
  hits: number
}

const cards: Card[] = input.map(function (line) {
  const m = line.match(/^Card\s+(\d+):\s+(.*)\s+\|\s+(.*)$/)
  if (m === null) throw new Error(`parse error: ${line}`)

  const num = parseInt(m[1])
  const winningNumbers = m[2].split(/\s+/).map(s => parseInt(s))
  const heldNumbers = m[3].split(/\s+/).map(s => parseInt(s))
  const hits = winningNumbers.filter(n => heldNumbers.includes(n)).length

  return { num, hits }
})

const part1 = cards.map(function (card) {
  return card.hits === 0 ? 0 : 2 ** (card.hits - 1)
}).reduce((acc, v) => acc + v)

console.log('Day 04, Part 1', part1)

const cardCount = cards.map(_ => 1)

cards.forEach(function (card, i) {
  for (let c = 1; c <= card.hits; c++) {
    cardCount[i + c] += cardCount[i]
  }
})

const part2 = cardCount.reduce((acc, v) => acc + v)

console.log('Day 04, Part 2', part2)
