import request from '@utils/request'

export const state = {
};

export const mutations = {
  
};

export const actions = {
  getTree({ commit }) {
    return request.get(`/admin/product/category/tree`).then((response) => response)
  },
};
