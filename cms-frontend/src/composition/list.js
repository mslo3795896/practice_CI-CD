import { ref, reactive, toRefs, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import mitt from 'mitt'

export default function list({ api = '', filterData = {}, customGetList }) {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const emitter = mitt()

  emitter.on('onClickToolbar', )

  onMounted(() => {
    if (api === '') console.error('尚未定義 api')
  })

  onUnmounted(() => {
    emitter.off('onClickToolbar')
  })

  const DATA = reactive({
    searchbarOriginValue: {},
    count: 0,
    list: [],
    listLoading: {
      flag: false,
    },
    paginations: {
      current_page: 1,
      total: 0,
      page_size: 10,
      page_sizes: [10, 15, 20, 25, 50, 100],
      layout: 'total, sizes, prev, pager, next, jumper',
    },
    pageSizeChanging: false,
  })

  const METHODS = {
    goAddRoute: () => {
      const { status: isInsidePage, pageGroupId = undefined, pageId = undefined } = store.state.global.insidePage

      if (isInsidePage) {
        store.dispatch('global/setInsidePage', {
          status: 'add',
          pageGroupId,
          pageId,
        })
      } else {
        router.push(`${route.path}/edit`)
      }
    },
    goEditRoute: (query) => {
      router.push({
        path: `${route.path}/edit`,
        query: {
          ...query,
          from: route.query,
        },
      })
    },
    onSearchReset: () => {
      const isInsidePage = store.state.global.insidePage.status
      router.push({
        path: route.path,
        query: {
          ...DATA.searchbarOriginValue,
          id: isInsidePage ? route.query.id : undefined,
          page: 1,
        },
      })
    },
    onSearch: (data, isPagination = false) => {
      if (!isPagination) data.page = 1
      const query = route.query
      let searchData = {
        ...query,
      }

      for (let s in data) {
        searchData[s] = data[s]
        if (!searchData[s]) {
          delete searchData[s]
        }
      }
      router.push({
        path: route.path,
        query: searchData,
      })
    },
    updateCurrentPage: (page) => {
      if (!DATA.pageSizeChanging) METHODS.onSearch({ ...filterData, page }, true)
    },
    updatePageSize: (page_size) => {
      DATA.pageSizeChanging = true
      METHODS.onSearch({ ...filterData, page_size })
      setTimeout(() => {
        DATA.pageSizeChanging = false
      })
    },
    getList: ({ page, pageSize, where, fn } = {}) => {
      DATA.listLoading.flag = true

      const query = route.query

      DATA.paginations.current_page = page || Number(query.page) || 1
      DATA.paginations.page_size = pageSize || Number(query.page_size) || DATA.paginations.page_size

      let page_data = Object.assign(METHODS.getRouteQuery(), {
        page: DATA.paginations.current_page,
        limit: DATA.paginations.page_size,
      })
      if (where) {
        page_data = Object.assign(page_data, where || {})
      }
      if (filterData) {
        const checkEmpty = () => {
          Object.keys(filterData).forEach((key) => {
            filterData[key] === '' && (filterData[key] = undefined)
          })
        }
        checkEmpty()
        page_data = Object.assign(page_data, filterData || {})
      }
      const getList = () => {
        const isInsidePage = store.state.global.insidePage.status

        store
          .dispatch('item/search', {
            api: api,
            query: {
              brand_id: isInsidePage ? route.query.id : undefined,
              ...page_data,
            },
          })
          .then((response) => {
            const { items, pagination } = response
            DATA.list = [...items]
            DATA.paginations.total = pagination.total
          })
          .finally(() => {
            DATA.listLoading.flag = false
          })

        fn && fn()
      }

      customGetList ? customGetList(page_data, fn) : getList()
    },
    checkout: async ({ api, ids }) => {
      await store.dispatch('item/checkout', { api, ids })
      METHODS.showMessage('回存')
    },
    batchUpdateStateAndGetList: async ({ ids, state }) => {
      await store.dispatch('item/updateState', { api: api, ids, state })
      METHODS.getList()

      message.success(`狀態更新成功`)
    },
    batchDeleteAndGetList: async ({ ids }) => {
      await store.dispatch('item/remove', { api: api, ids })
      METHODS.getList()

      message.success(`刪除成功`)
    },
    batchCheckoutAndGetList: async ({ ids }) => {
      await store.dispatch('item/checkout', { api: api, ids })
      METHODS.getList()

      message.success(`回存成功`)
    },
    updateState: async ({ api, ids, state }) => {
      await store.dispatch('item/updateState', { api, ids, state })

      METHODS.showMessage('狀態更新成功')
    },
    onOrderChange: async (submitData) => {
      await store.dispatch('item/ordering', { api: api, submitData })

      METHODS.showMessage('排序更新成功')
    },
    init: () => {
      /* // 能變更狀態的只有 list，list_user 不能變更狀態
      if (['trash', 'list'].includes(this.toolbar.type)) this.$set(this.toolbar, 'type', this.$route.query.state === '-2' ? 'trash' : 'list') */

      /* 觸發過一次過濾搜尋時，searchbar.defaultValue 的完整資料才會出現在 $route.query，
     所以之後的 searchbar.defaultValue 應該要等於 $route.query */
      if (DATA.count > 0)
        Object.keys(filterData).forEach((key) => {
          filterData[key] = route.query[key]
        })

      DATA.count++
      METHODS.getList() //為了在 cms mixin 可以加參數
    },
    setRouteQuery: (field, value) => {
      let query = Object.assign({}, route.query)

      if (typeof field === 'object') {
        query = field
      } else {
        query[field] = value
      }

      return query
    },
    getRouteQuery: () => {
      const query = { ...route.query }
      const numberArray = ['id', 'pid', 'category_id', 'access']
      const dateArray = ['start_date', 'end_date']
      const isInsidePage = store.state.global.insidePage.status
      let data = {}

      !!isInsidePage && delete query.id

      Object.keys(query).forEach((field) => {
        filterData[field] = numberArray.includes(field) ? Number(query[field]) : dateArray.includes(field) ? this.$options.filters.storeDateFormat(query[field]) : query[field]
        data[field] = query[field]
      })
      return data
    },
    showMessage: (message = '更新') => {
      METHODS.getList()
      message.success(`${message}成功`)
    },
  }

  METHODS.init()

  return {
    ...toRefs(DATA),
    ...METHODS,
  }
}

export const mixins = {
  data() {
    return {
      searchbarOriginValue: {},
      count: 0,
      list: [],
      listLoading: {
        flag: false,
      },
      paginations: {
        current_page: 1,
        total: 0,
        page_size: 10,
        page_sizes: [10, 15, 20, 25, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper',
      },
      pageSizeChanging: false,
    }
  },
  watch: {
    $route: {
      handler: '$_listMixin_init',
      immediate: true,
    },
  },
  mounted() {
    if (!this.api) {
      alert('缺少api')
    }
  },
  created() {
    if (this.searchbar) this.searchbarOriginValue = { ...this.searchbar.defaultValue }
  },
  methods: {
    $_listMixin_goAddRoute() {
      const { status: isInsidePage, pageGroupId = undefined, pageId = undefined } = this.$store.state.global.insidePage

      if (isInsidePage) {
        this.$store.dispatch('global/setInsidePage', {
          status: 'add',
          pageGroupId,
          pageId,
        })
      } else {
        this.$router.push(`${this.$route.path}/edit`)
      }
    },
    /**
     * 組裝編輯路徑
     * @param {Object} query 編輯項目參數
     * @param.attr query.id 項目 id
     * @param.attr query.pid 項目 parent_id
     */
    $_listMixin_goEditRoute(query) {
      this.$router.push({
        path: `${this.$route.path}/edit`,
        query: {
          ...query,
          from: this.$route.query,
        },
      })
    },
    $_listMixin_onSearchReset() {
      const isInsidePage = this.$store.state.global.insidePage.status
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.searchbarOriginValue,
          id: isInsidePage ? this.$route.query.id : undefined,
          page: 1,
        },
      })
    },
    $_listMixin_onSearch(data, isPagination = false) {
      if (!isPagination) data.page = 1
      const query = this.$route.query
      let searchData = {
        ...query,
      }

      for (let s in data) {
        searchData[s] = data[s]
        if (!searchData[s]) {
          delete searchData[s]
        }
      }
      this.$router.push({
        path: this.$route.path,
        query: searchData,
      })
    },

    $_listMixin_updateCurrentPage(page) {
      /* this.$_listMixin_getList({
        page,
        fn: () => {
          this.$router.push({
            path: this.$route.path,
            query: this.$_listMixin_setRouteQuery("page", page)
          });
        }
      }); */

      if (!this.pageSizeChanging) this.$_listMixin_onSearch({ ...this.searchbar.defaultValue, page }, true)
      /* this.$router.push({
          path: this.$route.path,
          query: this.$_listMixin_setRouteQuery("page", page)
        }); */
    },
    $_listMixin_updatePageSize(page_size) {
      /* this.$_listMixin_getList({
        pageSize,
        fn: () => {
          this.$router.push({
            path: this.$route.path,
            query: this.$_listMixin_setRouteQuery("page_size", pageSize)
          });
        }
      }); */

      this.pageSizeChanging = true
      this.$_listMixin_onSearch({ ...this.searchbar.defaultValue, page_size })
      setTimeout(() => {
        this.pageSizeChanging = false
      })
    },
    $_listMixin_getList({ page, pageSize, where, fn } = {}) {
      this.listLoading.flag = true

      const query = this.$route.query

      this.paginations.current_page = page || Number(query.page) || 1
      this.paginations.page_size = pageSize || Number(query.page_size) || this.paginations.page_size

      let page_data = Object.assign(this.$_listMixin_getRouteQuery(), {
        page: this.paginations.current_page,
        limit: this.paginations.page_size,
      })
      if (where) {
        page_data = Object.assign(page_data, where || {})
      }
      if (this.searchbar.defaultValue) {
        const checkEmpty = () => {
          Object.keys(this.searchbar.defaultValue).forEach((key) => {
            this.searchbar.defaultValue[key] === '' && (this.searchbar.defaultValue[key] = undefined)
          })
        }
        checkEmpty()
        page_data = Object.assign(page_data, this.searchbar.defaultValue || {})
      }
      const getList = () => {
        const isInsidePage = this.$store.state.global.insidePage.status

        this.$store
          .dispatch('item/search', {
            api: this.api,
            query: {
              brand_id: isInsidePage ? this.$route.query.id : undefined,
              ...page_data,
            },
          })
          .then((response) => {
            const { items, pagination } = response
            this.list = [...items]
            this.paginations.total = pagination.total
          })
          .finally(() => {
            this.listLoading.flag = false
          })

        fn && fn()
      }

      this.getListOverride ? this.getListOverride(page_data, fn) : getList()
    },
    async $_listMixin_checkout({ api, ids }) {
      await this.$store.dispatch('item/checkout', { api, ids })
      this.$_listMixin_showMessage('回存')
    },

    async $_listMixin_batchUpdateStateAndGetList({ ids, state }) {
      await this.$store.dispatch('item/updateState', { api: this.api, ids, state })
      this.$_listMixin_getList()

      this.$message.success(`狀態更新成功`)
    },
    async $_listMixin_batchDeleteAndGetList({ ids }) {
      await this.$store.dispatch('item/remove', { api: this.api, ids })
      this.$_listMixin_getList()

      this.$message.success(`刪除成功`)
    },

    async $_listMixin_batchCheckoutAndGetList({ ids }) {
      await this.$store.dispatch('item/checkout', { api: this.api, ids })
      this.$_listMixin_getList()

      this.$message.success(`回存成功`)
    },

    async $_listMixin_updateState({ api, ids, state }) {
      await this.$store.dispatch('item/updateState', { api, ids, state })

      this.$_listMixin_showMessage('狀態更新成功')
    },
    async $_listMixin_onOrderChange(submitData) {
      await this.$store.dispatch('item/ordering', { api: this.api, submitData })

      this.$_listMixin_showMessage('排序更新成功')
    },
    $_listMixin_init(v) {
      /*TODO 會有this.searchbar.defaultValue有值 而$route.query沒有值的情況*/
      /*TODO 如果在同一個$route.name做移動 $route.query不會跟this.searchbar.defaultValue同步*/
      /*TODO 目前只有項目有加這段 待寫成全站套用版*/
      if (Object.keys(v.query).length === 0) {
        Object.keys(this.searchbar.defaultValue).forEach((key) => {
          this.searchbar.defaultValue[key] = undefined
        })
      }

      this.$_listMixin_getList() //為了在 cms mixin 可以加參數
    },
    $_listMixin_setRouteQuery(field, value) {
      let query = Object.assign({}, this.$route.query)

      if (typeof field === 'object') {
        query = field
      } else {
        query[field] = value
      }

      return query
    },
    $_listMixin_getRouteQuery() {
      const query = { ...this.$route.query }
      const numberArray = ['id', 'pid', 'category_id', 'access']
      const dateArray = ['start_date', 'end_date']
      const isInsidePage = this.$store.state.global.insidePage.status
      let data = {}

      !!isInsidePage && delete query.id

      Object.keys(query).forEach((field) => {
        this.searchbar.defaultValue[field] = numberArray.includes(field) ? Number(query[field]) : dateArray.includes(field) ? this.$options.filters.storeDateFormat(query[field]) : query[field]
        data[field] = query[field]
      })
      return data
    },
    $_listMixin_showMessage(message = '更新') {
      this.$_listMixin_getList()
      this.$message.success(`${message}成功`)
    },
  },
}
