/**
 *
 * @param {Array} objArray
 * @param {Array} valueArray
 * @param {String} key
 * @returns {Boolean,Array}
 */
export default function filterArrayByValue(objArray, valueArray, key) {
  if (!(objArray instanceof Array) || !(valueArray instanceof Array)) return []
  const valuesOfObjArray = objArray.map((obj) => obj[key])
  const indexOfValueArray = valueArray
    .map((value) => valuesOfObjArray.indexOf(value))
    .filter((index) => index >= 0)

  const filteredObjArray = indexOfValueArray.map((index) => objArray[index])

  return filteredObjArray
}
