import request from '@utils/request'

export const actions = {
  createFolder({ commit }, {dir, name}) {
    return request
      .post(`/admin/media/folder/create`, {dir, name})
      .then((response) => response.items)
  },
  listFolder({ commit }) {
    return request
      .get(`/admin/media/folder/all`)
      .then((response) => response.items)
  },
  listFile({ commit }, dir) {
    return request
      .post(`/admin/media/folder/items`, dir)
      .then((response) => response.items)
  },
  uploadFile({ commit }, data) {
    return request
      .post(`/admin/media/upload`, data, { headers: { "Content-Type": "multipart/form-data" } })
      .then((response) => response.items)
  },
  rename({ commit }, {dir, name, rename, type}) {
    return request
      .post(`/admin/media/rename`, {dir, name, rename, type})
      .then((response) => response.items)
  },
  delete({ commit }, {paths}) {
    return request
      .post(`/admin/media/remove`, {paths})
      .then((response) => response.items)
  },
};
