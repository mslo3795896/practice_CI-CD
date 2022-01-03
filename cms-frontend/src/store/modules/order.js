import request from '@utils/request'
import configRequest from "@src/config/request";

export const state = {};

export const getters = {};

export const mutations = {};

export const actions = {
  /**
   * 取得QRCode訂單項目
   * @param commit
   * @param code
   * @param type
   * @param checkinStatus
   * @param limit
   * @param page
   * @returns {AxiosPromise<any>}
   */
  fetchOrderQrcodeItem({ commit }, {
    code,
    type,
    checkinStatus,
    limit = 9,
    page = 1
  } = {}) {
    return request
      .post(`/admin/order/qrcode`, {
        code,
        type,
        checkinStatus,
        limit,
        page
      }, {
        ...configRequest,
        name: 'fetchOrderQrcodeItem'
      })
  },

  /**
   * 場次餐食報到
   * @param commit
   * @param code
   * @param checkinItemId
   * @param type
   * @param pageGroupId
   * @param pageId
   * @returns {AxiosPromise<any>}
   */
  checkinOrderQrcodeItem({ commit }, {
    code,
    checkinItemId,
    type,
  } = {}) {
    return request
      .post(`/admin/order/qrcode/checkin`, {
        code,
        checkinItemId,
        type,
      }, {
        ...configRequest,
        name: 'checkinOrderQrcodeItem'
      })
  },

  /**
   * 取得事件列表
   * @param commit
   * @param code
   * @param checkinItemId
   * @param type
   * @param pageGroupId
   * @param pageId
   * @returns {AxiosPromise<any>}
   */
  fetchEventList({ commit }, {
    categoryAlias,
    state = 1,
    regState,
    search,
    limit = 99,
    page = 1
  } = {}) {
    return request
      .post(`/admin/event/search`, {
        categoryAlias,
        state,
        regState,
        search,
        limit,
        page
      }, {
        ...configRequest,
        name: 'fetchEventList'
      })
  },
  /**
   * 取得事件日期列表
   * @param commit
   * @param eventId
   * @param limit
   * @param page
   * @returns {AxiosPromise<any>}
   */
  fetchEventDateList({ commit }, {
    eventId,
    limit = 99,
    page = 1
  } = {}) {
    return request
      .post(`/admin/event/${ eventId }/dates`, {
        limit,
        page
      }, {
        ...configRequest,
        name: 'fetchEventDateList'
      })
  },

  /**
   * 取得事件日期場次列表
   * @param commit
   * @param eventDateId
   * @param event
   * @returns {AxiosPromise<any>}
   */
  fetchEventDateSessionList({ commit }, {
    eventDateId,
    event = '',
  } = {}) {
    const queryEvent = event
      ? `event=${ event }`
      : '';

    return request
      .get(`/admin/event/date/${ eventDateId }?${queryEvent}`, {
        ...configRequest,
        name: 'fetchEventDateSessionList'
      })
  },

  /**
   * 取得場次訂單列表
   * @param commit
   * @param sessionId
   * @param search
   * @param checkinStatus
   * @param limit
   * @param page
   * @returns {AxiosPromise<any>}
   */
  fetchSessionOrderList({ commit }, {
    sessionId,
    search,
    checkinStatus,
    limit = 99,
    page = 1
  } = {}) {
    return request
      .post(`/admin/event/session/${ sessionId }/orders`, {
        checkinStatus,
        search,
        limit,
        page
      }, {
        ...configRequest,
        name: 'fetchSessionOrderList'
      })
  },

  /**
   * 取得場次項目
   * @param commit
   * @param sessionId
   * @returns {AxiosPromise<any>}
   */
  fetchSessionItem({ commit }, {
    sessionId,
  } = {}) {
    return request
      .get(`/admin/event/session/${ sessionId }`, {
        ...configRequest,
        name: 'fetchSessionItem'
      })
  },

  /**
   * 取得場次項目
   * @param commit
   * @param orderId
   * @returns {AxiosPromise<any>}
   */
  checkinSessionItem({ commit }, {
    orderId,
  } = {}) {
    return request
      .post(`/admin/order/item/checkin`, {
        ids: [orderId]
      }, {
        ...configRequest,
        name: 'checkinSessionItem'
      })
  },
};


// admin/order/item/checkin
