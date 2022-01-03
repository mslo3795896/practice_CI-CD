export const state = {
  currentLoadingList: []
};

export const getters = {
  isLoading(state) {
    return function (loaderMessage) {
      return state.currentLoadingList.indexOf(loaderMessage) > -1;
    };
  },
  anyLoading(state) {
    return state.currentLoadingList[0];
  }
};

export const mutations = {
  SET_LOADING_START(state, loaderMessage) {
    state.currentLoadingList.push(loaderMessage);
    state.currentLoadingList = uniq(state.currentLoadingList);
  },
  SET_LOADING_END(state, loaderMessage) {
    state.currentLoadingList = uniq(
      state.currentLoadingList
    )
      .filter(function (p) {
        return p !== loaderMessage;
      });
  },
};

export const actions = {
  setLoadingStart({ commit }, loaderMessage) {
    return commit('SET_LOADING_START', loaderMessage);
  },
  setLoadingEnd({ commit }, loaderMessage) {
    return commit('SET_LOADING_END', loaderMessage);
  }
};

function uniq(array) {
  return array.filter(function (el, index, arr) {
    return index === arr.indexOf(el);
  });
}
