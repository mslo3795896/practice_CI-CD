export function getLocalStorage(key) {
  if(window.localStorage.getItem(key) === 'undefined') {
    return undefined;
  }
  return JSON.parse(window.localStorage.getItem(key))
}

export function saveLocalStorage(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}
