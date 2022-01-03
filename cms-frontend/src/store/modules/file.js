import request from '@utils/request'

export const actions = {
  uploadFile({ commit }, data) {
    return request
      .post(`/admin/file/upload`, data, { headers: { "Content-Type": "multipart/form-data" } })
      .then((response) => response.items)
  },
  deleteUpload({ commit }, data) {
    return request
      .post(`/admin/file/deleteUpload`, data)
      .then((response) => response.items)
  },
  removeFromSystem({ commit }, data) {
    return request
      .post(`/admin/file/remove`, data)
      .then((response) => response.items)
  },
};
