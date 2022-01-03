import Cookies from "js-cookie";

export function getCookie(key) {
  return JSON.parse(Cookies.get(key) || null)
}

export function saveCookie(key, state) {
  return Cookies.set(key, JSON.stringify(state), {
    expires: 7,
    sameSite: 'strict',
    domain: window.location.hostname
  })
}

