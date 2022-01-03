import request from '@utils/request'
import configRequest from '@src/config/request'
import axios from 'axios'

import { getCookie, saveCookie } from '@utils/cookie'
import { getLocalStorage, saveLocalStorage } from '@utils/localStorage'

export const state = {
  currentUser: getCookie('checkin.auth.currentUser'),
  remember: {
    flag: getLocalStorage('admin.auth.remember.flag') ? true : false,
    info: getLocalStorage('admin.auth.remember.info') || {
      email: '',
    },
  },
  // 登入成功後，使用者可走訪的路由與可看到的按鈕
  userRoutes: getLocalStorage('admin.auth.userRoutes') || [],
  userAccess: getLocalStorage('admin.auth.userAccess') || {},
}

export const mutations = {
  SET_CURRENT_USER(state, value) {
    state.currentUser = value
    saveCookie('checkin.auth.currentUser', value)
    saveCookie('admin.auth.currentUser', value)

    saveLocalStorage('checkin.auth.currentUser', value)
    setDefaultAuthHeaders(state)
  },

  SET_USER_ACCESS(state, value) {
    state.userAccess = value
    saveLocalStorage('admin.auth.userAccess', value)
  },
  SET_USER_ROUTES(state, routes) {
    state.userRoutes = routes
    saveLocalStorage('admin.auth.userRoutes', routes)
  },
  SET_REMEMBER(state, value) {
    state.remember = value
    saveLocalStorage('admin.auth.remember.flag', value.flag)
    saveLocalStorage('admin.auth.remember.info', value.info)
  },
}

export const getters = {
  loggedIn(state) {
    return !!state.currentUser
  },
}

export const actions = {
  init({ state }) {
    setDefaultAuthHeaders(state)
  },

  setCurrentUser({ commit, dispatch, getters }, user) {
    commit('SET_CURRENT_USER', user)
  },

  setRemember({ commit }, { flag, info }) {
    if (flag === true) {
      commit('SET_REMEMBER', { flag, info })
    } else {
      commit('SET_REMEMBER', {
        flag: false,
        info: {
          email: '',
          token: '',
        },
      })
    }
  },

  logIn({ commit, dispatch, getters }, { email, password } = {}) {
    return request
      .post(
        '/user/login',
        {
          email,
          password,
        },
        {
          ...configRequest,
          name: 'logIn',
          customErrorHandle: () => {},
        }
      )
      .then((response) => {
        // if (!response.items.hasOwnProperty('user_name')) return { status: 'USER_NEED_RESET_PASSWORD', token:

        const member = response.items
        commit('SET_CURRENT_USER', member)

        return member
      })
  },

  logOut({ commit }) {
    return request
      .get('/user/logout', {
        ...configRequest,
        name: 'logOut',
      })
      .then((response) => {
        commit('SET_CURRENT_USER', null)
        commit('SET_USER_ROUTES', [])
        commit('SET_USER_ACCESS', null)

        return response
      })
  },

  fetchUserPage({ commit }) {
    return request
      .get('/admin/user/page', {
        ...configRequest,
        name: 'fetchUserPage',
        customErrorHandle: () => {},
      })
      .then((response) => response)
  },
  storeUserRoutes({ commit }, routes) {
    commit('SET_USER_ROUTES', routes)
  },
  storeUserAccess({ commit }, access) {
    commit('SET_USER_ACCESS', access)
  },

  storeUser({ commit, dispatch, getters }, submitData) {
    return request
      .post(`/user/store`, submitData, {
        ...configRequest,
        name: 'storeUser',
      })
      .then((response) => {
        const member = response.items

        return response.items
      })
  },

  fetchUser({ commit, dispatch, getters }) {
    return request
      .get(`/user/profile`, {
        ...configRequest,
        name: 'fetchUser',
        customErrorHandle: () => {},
      })
      .then((response) => {
        const member = response.items

        commit('SET_CURRENT_USER', {
          ...state.currentUser,
          ...member,
          // groupId: 6
        })

        return response.items
      })
  },
}

// ===
// Private helpers
// ===

function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common.Authorization = state.currentUser ? `Bearer ${state.currentUser.token}` : ''
}
