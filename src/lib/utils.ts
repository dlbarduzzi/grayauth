export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function lowercase(str: string) {
  return str.toLowerCase()
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
