import { readFileSync } from 'node:fs'

const input = readFileSync('input/day1.txt', 'utf8').split(/\n/)

function calibrationValue (str: string): number {
  const digits = str.split('').filter(c => c >= '0' && c <= '9').map(c => +c)
  return (digits.at(0) ?? 0) * 10 + (digits.at(-1) ?? 0)
}

const part1 = input.map(line => calibrationValue(line)).reduce((acc, v) => acc + v)

console.log('Day 01, Part 1', part1)

const words: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
}

function calibrationValue2 (str: string): number {
  const digits: number[] = []
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' && str[i] <= '9') {
      digits.push(+str[i])
    } else {
      Object.keys(words).forEach(function (word) {
        if (str.substring(i, i + word.length) === word) {
          digits.push(words[word])
        }
      })
    }
  }
  return (digits.at(0) ?? 0) * 10 + (digits.at(-1) ?? 0)
}

const part2 = input.map(line => calibrationValue2(line)).reduce((acc, v) => acc + v)

console.log('Day 01, Part 2', part2)
