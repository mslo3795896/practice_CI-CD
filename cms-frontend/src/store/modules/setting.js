import request from '@utils/request'
import { getLocalStorage, saveLocalStorage } from "@utils/localStorage";

export const state = {
  currentSetting: getLocalStorage('admin.setting') || {},
  
};

export const mutations = {
  SET_CURRENT_SETTING(state, value) {
    state.currentSetting = value;
    saveLocalStorage('admin.setting', value);
  },
};

export const actions = {
  fetchSetting({ commit }) {
    return request.get(`/admin/siteInfo`).then((response) => {
      commit('SET_CURRENT_SETTING', response.items);
      return response.items
    })
  },
  removeCurrentSetting({ commit }) {
    commit('SET_CURRENT_SETTING', {});
  },
  fetchPageTree({ commit }) {
    return request.get(`/admin/asset/group/page`).then((response) => response.items)
  },
  fetchGlobalSetting({ commit }) {
    return request.get(`/admin/setting`).then((response) => response.items) 
  }
};
