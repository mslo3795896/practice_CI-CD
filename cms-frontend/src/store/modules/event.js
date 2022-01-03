import request from '@utils/request'

export const state = {
  currentEvent: {},
  currentPersonnel: [],
  currentPersonnelCategory: [],
};

export const mutations = {
  CACHE_EVENT(state, value) {
    state.currentEvent = value;
  },
  CACHE_PERSONNEL(state, value) {
    state.currentPersonnel = value;
  },
  CACHE_PERSONNEL_CATEGORY(state, value) {
    state.currentPersonnelCategory = value;
  },
  
};

export const actions = {
  // 活動課程
  cacheEvent({ commit }, event) {
    commit('CACHE_EVENT', event)
  },
  storeEventDate({ commit }, submitData) {
    return request
      .post(`admin/event/date/storeDetail`, submitData)
      .then((response) => response.items)
  },
  fetchItemEventDate({ commit }, id) {
    return request
      .get(`/admin/event/date/${id}`)
      .then((response) => response.items)
  },
  fetchEventDates({ commit }, {id, ...query}) {
    return request
      .post(`/admin/event/${id}/dates`, query)
      .then(({items, pagination: {total}}) => {
        return {
          items,
          total
        }
      })
  },
  removeSession({ commit }, submitData) {
    return request
      .post(`admin/event/session/remove`, submitData)
  },
  fetchEventSessions({ commit }, {id, ...query}) {
    return request
      .post(`/admin/event/${id}/sessions`, query)
      .then(({items, pagination: {total}}) => {
        return {
          items,
          total
        }
      })
  },
  fetchEventSession({ commit }, id) {
    return request
      .get(`/admin/event/session/${id}`)
      .then((response) => response.items)
  },
  fetchEventSessionsOrders({ commit }, {id, ...query}) {
    return request
      .post(`/admin/event/session/${id}/orders`, query)
      .then(({items, pagination: {total}}) => {
        return {
          items,
          total
        }
      })
  },
  checkin({ commit }, submitData) {
    return request
      .post(`/admin/order/item/checkin`, submitData)
  },
  review({ commit }, submitData) {
    return request
      .post(`/admin/order/review`, submitData)
  },
  fetchEventSessionsDates({ commit }, query) {
    return request
      .post(`/admin/event/session/searchDate`, query)
      .then(({items, pagination: {total}}) => {
        return {
          items,
          total
        }
      })
  },
  fetchPopularEvent({ commit }, query) {
    return request
      .post(`/admin/event/popular`, query)
      .then(({items, pagination: {total}}) => {
        return {
          items,
          total
        }
      })
  },
  
  

  // 講師
  fetchPersonnel({ commit }, query) {
    return request
      .post(`admin/personnel/search`, query)
      .then((response) => {
        commit('CACHE_PERSONNEL', response.items)
      })
  },
  fetchPersonnelCategory({ commit }, query) {
    return request
      .post(`admin/personnel/category/search`, query)
      .then((response) => {
        commit('CACHE_PERSONNEL_CATEGORY', response.items)
      })
  },
  
  // 上課券
  searchCouponApplyGroup({ commit }, submitData) {
    return request
      .post(`admin/coupon/group/apply/search`, submitData)
      .then((response) => response)
  },
  exportNonUsers({ commit }, id) {
    return request
      .post(`/admin/coupon/group/apply/export`, {id}, {responseType: 'blob'})
      .then((response) => response)
  },
  importNonUsers({ commit }, formData) {
    return request
      .post(`admin/coupon/group/apply/import`, formData)
  },

  // 通知
  searchRegister({ commit }, query) {
    return request
      .post(`admin/event/searchRegister`, query)
      .then((response) => response.items)
  },

  // 報名管理
  exportOrderExample({ commit }, id) {
    return request
      .get(`/admin/event/${id}/exportRegistrationFrom`, {responseType: 'blob'})
      .then((response) => response)
  },
  importOrder({ commit }, {id, formData}) {
    return request
      .post(`admin/event/${id}/importRegistration`, formData)
  },
  exportSessionOrders({ commit }, id) {
    return request
      .get(`/admin/event/session/${id}/orders/export`, {responseType: 'blob'})
      .then((response) => response)
  },
  
};
