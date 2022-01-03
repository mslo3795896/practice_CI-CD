import request from '@utils/request'

export const state = {
};

export const mutations = {
  
};

export const actions = {
  sendReply({ commit }, submitData) {
    return request.post(`/admin/customer/message/reply`, submitData)
  },
};
