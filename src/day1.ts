import { readFileSync } from 'node:fs'

const input = readFileSync('input/day1.txt', 'utf8').split(/\n/)

function calibrationValue (str: string): number {
  const digits = str.split('').filter(c => c >= '0' && c <= '9').map(c => +c)
  return (digits.at(0) ?? 0) * 10 + (digits.at(-1) ?? 0)
}

const part1 = input.map(line => calibrationValue(line)).reduce((acc, v) => acc + v)

console.log('Day 01, Part 1', part1)
