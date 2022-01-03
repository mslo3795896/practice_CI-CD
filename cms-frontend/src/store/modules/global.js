import { getLocalStorage, saveLocalStorage } from '@utils/localStorage'

export const state = {
  menuCollapsed: getLocalStorage('admin.menuCollapsed') || false,
  authorName: 'Daydream Lab Intl.',
  authorLink: 'http://www.daydream-lab.com/',
  insidePage: {},
}

export const getters = {}

export const mutations = {
  SET_COLLAPSED(state, value) {
    state.menuCollapsed = value
    saveLocalStorage('admin.menuCollapsed', value)
  },
}

export const actions = {
  toggleMenu({ commit }, value) {
    commit('SET_COLLAPSED', value)
  },
  setInsidePage({ commit, dispatch, getters }, value) {
    commit('SET_INSIDEPAGE', value);
  },
}
