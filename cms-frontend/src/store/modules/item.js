import request from '@utils/request'

const NONE_ITEM_PATH_API = [
  'brand',
  'category',
  'extrafield',
  'extrafield/group',
  'form',
  'product',
  'product/category',
  'site',
  'tag',
  'company',
  'setting',
  'newsletter',
  'newsletter/subscription',
  'user',
  'user/group',
  'asset/group',
  'customer/message',
  'file',
  'file/category',

  // event
  'event',
  'event/date',
  'personnel',
  'personnel/category',
  'sponsor',
  'coupon/group',
  'coupon/used',
  'order',
  'notification',
  'notification/coupon',
  'notification/record',
  'notification/event',
  'notification/sms',
  'file/download',
];

export const state = {
  orderDetail:{}
};

export const mutations = {
  SET_ORDER_DETAIL(state, value) {
    state.orderDetail = value;

  },
};

export const actions = {
  search({ commit }, { api, query = {} }) {
    return request
      .post(`/admin/${apiPath(api)}/search`, query)
      .then((response) => {
        const {items, pagination, usage = undefined} = response;
        return {
          items,
          pagination,
          usage
        }
      })
  },
  fetchItem({ commit }, { api, id }) {
    return request
      .get(`/admin/${apiPath(api)}/${id}`)
      .then(
        (response) => {
          if (api === 'order') commit('SET_ORDER_DETAIL', response.items)
          return response.items
        }
      )
  },
  store({ commit }, { api, submitData }) {
    return request
      .post(`/admin/${apiPath(api)}/store`, submitData)
      .then((response) => response.items)
  },
  fetchOptions({ commit }, types) {
    return request
      .post(`/admin/option/list`, {types})
      .then((response) => response.items)
  },
  // 回存
  checkout({ commit }, { api, ids }) {
    return request
      .post(`/admin/${apiPath(api)}/restore`, {ids})
  },
  // 刪除
  remove({ commit }, { api, ids }) {
    return request
      .post(`/admin/${apiPath(api)}/remove`, {ids})
      .then((response) => response.items)
  },
  // 發佈/未發佈/回收 1/0/-2
  updateState({ commit }, { api, ids, state }) {
    return request
      .post(`/admin/${apiPath(api)}/state`, {ids, state})
  },
  fetchPublishLink({ commit }, id) {
    return request
      .get(`/admin/newsletter/${id}/publish`)
      .then((response) => response.items.url)
  },
  ordering({ commit }, { api, submitData }) {
    return request
      .post(`/admin/${apiPath(api)}/ordering`, submitData)
  },
  export({ commit }, { api, submitData }) {
    return request
      .post(`/admin/${apiPath(api)}/export`, submitData, {responseType: 'blob'})
      .then((response) => response)
  },

  // 訂單
  orderReview({ commit }, submitData ) {
    return request
      .post(`admin/order/review`, submitData)
      .then((response) => response)
  },
  orderItemCheckin({ commit }, submitData ) {
    return request
      .post(`admin/order/item/checkin`, submitData)
      .then((response) => response)
  },
  orderSend({ commit }, submitData ) {
    return request
      .post(`admin/notification/order/send`, submitData)
      .then((response) => response)
  },

  // 控制台
  fetchConsole({ commit }) {
    return request
      .get(`/admin/dashboard/status`)
      .then((response) => response.items)
  },
};

function apiPath(api) {
  if (api === undefined) throw new Error("list.vue 或 edit.vue 沒定義 api")
  return NONE_ITEM_PATH_API.includes(api) ? `${api}` : `item/${api}`
}
