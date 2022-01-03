export function nlToBr(string) {
  return string && string.replace(/(?:\r\n|\r|\n)/g, '<br>')
}
