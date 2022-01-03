export default function isCondition(item) {
  return ((!item.condition || typeof item.condition !== 'function') || (typeof item.condition === 'function' && item.condition() === true))
}

export function conditionList(list) {
  return list.filter(item => {
    return isCondition(item)
  })
}
