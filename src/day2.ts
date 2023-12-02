import { readFileSync } from 'node:fs'

const input = readFileSync('input/day2.txt', 'utf8').trimEnd().split(/\n/)

interface Hand {
  red: number
  green: number
  blue: number
}

interface Game {
  id: number
  hands: Hand[]
}

function parseInput (): Game[] {
  return input.map(function (line) {
    const m = line.match(/^Game (\d+): (.*)$/)
    if (m === null) throw new Error(`Parse error: ${line}`)
    const id = parseInt(m.at(1) ?? '0')
    const hands = (m.at(2)?.split('; ') ?? []).map(function (handStr) {
      const hand = { red: 0, green: 0, blue: 0 }
      handStr.split(', ').forEach(function (cube) {
        const [count, colour] = cube.split(' ')
        switch (colour) {
          case 'red': hand.red = +count; break
          case 'green': hand.green = +count; break
          case 'blue': hand.blue = +count; break
          default: throw new Error(`Unknown colour: ${colour}`)
        };
      })
      return hand
    })
    return { id, hands }
  })
}

const games = parseInput()

const part1 = games.filter(function (game) {
  return game.hands.every(hand => hand.red <= 12 && hand.green <= 13 && hand.blue <= 14)
}).map(game => game.id).reduce((acc, v) => acc + v)

console.log('Day 02, Part 1', part1)
