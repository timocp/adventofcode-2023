// from: https://gist.github.com/axelpale/3118596?permalink_comment_id=3107083#gistcomment-3107083

export const kCombinations = <T>(set: T[], k: number): T[][] => {
  if (k > set.length || k <= 0) {
    return []
  }

  if (k === set.length) {
    return [set]
  }

  if (k === 1) {
    return set.reduce<T[][]>((acc, cur) => [...acc, [cur]], [])
  }

  const combs = [] as T[][]
  let tailCombs = []

  for (let i = 0; i <= set.length - k + 1; i++) {
    tailCombs = kCombinations(set.slice(i + 1), k - 1)
    for (let j = 0; j < tailCombs.length; j++) {
      combs.push([set[i], ...tailCombs[j]])
    }
  }

  return combs
}

export const combinations = <T>(set: T[]): T[][] => {
  return set.reduce<T[][]>((acc, _cur, idx) => [...acc, ...kCombinations(set, idx + 1)], [])
}
