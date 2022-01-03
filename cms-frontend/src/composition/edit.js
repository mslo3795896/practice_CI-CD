import { ref, reactive, toRefs, watch, computed, provide, inject, nextTick, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

export default function edit({ api = '', defaultValue = {}, disabledCheckout = false, disableInitGetData = false, afterGetData, beforeStoreData }) {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const $scrollToElement = inject('$scrollToElement')

  const DATA = reactive({
    defaultValue: defaultValue,
    params: {
      id: '',
    },
    toolbar: {
      type: 'edit',
    },
    formList: {},
  })

  onMounted(() => {})

  watch(store.state.global.insidePage, () => {
    const isInsidePage = store.state.global.insidePage.status
    const insidePageId = store.state.global.insidePage.query ? store.state.global.insidePage.query.id : ''

    if (isInsidePage) {
      DATA.params.id = insidePageId
    }
  })

  const COMPUTED = reactive({
    forms: computed(() => {
      const formList = []
      /* const findNestedForm = (component) => {
        if (component.$options._componentTag === 'el-form') {
          formList.push(component)
          return
        }
        component.$children.forEach((item) => {
          findNestedForm(item)
        })
      }
      findNestedForm(_this) */
      return formList
    }),
  })
  const METHODS = {
    getData: async () => {
      const data = await store.dispatch('item/fetchItem', {
        api: api,
        id: DATA.params.id,
      })

      DATA.defaultValue = { ...DATA.defaultValue, ...data }

      METHODS.updateToolbar(data)

      afterGetData && afterGetData(data)
    },
    validate: async ({ submit_data, btn_type }) => {
      let failed = false
      for (const formId in DATA.formList) {
        const form = DATA.formList[formId]
        if (!failed) {
          try {
            await form.validate()
          } catch ({ errorFields, ...restData }) {
            failed = true

            const switchToInvalidTab = () => {
              const findTabs = ($component) => {
                if ($component.$parent.$.type.name === 'RouterView') return false

                if ($component.$parent.$.type.name === 'Tabs') {
                  return $component.$parent
                } else {
                  return findTabs($component.$parent)
                }
              }
              const findInvalidTabKey = ($component) => {
                if ($component.$parent.$.type.name === 'RouterView') return false

                if ($component.$parent.$.type.name === 'ATabPane') {
                  return $component.$parent.$.vnode.key
                } else {
                  return findInvalidTabKey($component.$parent)
                }
              }

              const Tabs = findTabs(form)
              if (Tabs) {
                const invalidTabKey = findInvalidTabKey(form)
                Tabs && Tabs.setActiveKey(invalidTabKey)
              }
            }
            /* const scrollToInvalidFieldAndFocusField = () => {
              nextTick(() => {
                const $error = form.$el.querySelector('.is-error')
                const scrollToInvalidField = () => {
                  $scrollToElement($error, 140)
                }
                const findFocusableElement = () => {
                  const formElement = 'input, select, textarea'
                  $error.querySelector(formElement) && $error.querySelector(formElement).focus()
                }

                scrollToInvalidField()
                findFocusableElement()
              })
            } */
            const focusInvalidField = () => {
              const $error = form.$el.querySelector('.ant-form-item-has-error')
              const $formElement = $error.querySelector('input, select, textarea')

              if ($formElement) {
                $formElement.focus()
                if ($formElement.className.includes('ant-calendar-picker-input'))
                  $formElement.click()
              }
            }

            switchToInvalidTab()
            // scrollToInvalidFieldAndFocusField()
            nextTick(() => {
              form.scrollToField(errorFields[0].name, { block: 'center', behavior: 'smooth' })
              setTimeout(() => {
                focusInvalidField()
              }, 300)
            })
          }
        }
      }

      if (!failed) {
        beforeStoreData && beforeStoreData()
        METHODS.submit({ submit_data: DATA.defaultValue, btn_type })
      }
    },
    submit: async ({ submit_data, btn_type }) => {
      let submitData = Object.assign({}, submit_data)
      const isInsidePage = store.state.global.insidePage.status

      if (DATA.params.id) {
        submitData.id = DATA.params.id
      }

      if (isInsidePage) {
        submitData.brands = [{ id: +route.query.id }]
      }

      const data = await store.dispatch('item/store', {
        api: api,
        submitData,
      })

      afterGetData && afterGetData(data)

      METHODS.updateToolbar(data)

      METHODS.onSubmitFinish({
        msg: '項目更新成功',
        btn_type,
        query: { id: data ? data.id : submit_data.id },
      })
    },
    onSubmitFinish: ({ msg, btn_type, query }) => {
      const { status: isInsidePage, pageGroupId = undefined, pageId = undefined } = store.state.global.insidePage

      message.success(msg)
      switch (btn_type) {
        case 'save':
          if (isInsidePage) {
            store.dispatch('global/setInsidePage', {
              status: 'edit',
              query,
              pageGroupId,
              pageId,
            })
          } else {
            router.push({
              path: route.path,
              query,
            })
          }

          break
        case 'savenadd':
          //Checkout
          /* if (this.checkRouteNeedCheckout(route.path) && query.id) {
            this.handleCheckout(query.id);
          } */

          if (query.id) {
            METHODS.checkout(query.id)
          }

          if (isInsidePage) {
            store.dispatch('global/setInsidePage', {
              status: 'add',
              pageGroupId,
              pageId,
            })
          } else {
            router.push({
              path: route.path,
            })
            router.go(0)
          }

          break
        case 'savenclose':
          //Checkout
          METHODS.onCancel(query.id)
          break
      }
    },
    onCancel: async (checkout_id = '') => {
      const { status: isInsidePage, pageGroupId = undefined, pageId = undefined } = store.state.global.insidePage

      /* if (this.checkRouteNeedCheckout(route.path) && checkout_id) {
          this.handleCheckout(checkout_id);
      } */

      if (checkout_id && !disabledCheckout) {
        await METHODS.checkout(checkout_id)
      }

      if (isInsidePage) {
        store.dispatch('global/setInsidePage', {
          status: 'list',
          pageGroupId,
          pageId,
        })
      } else {
        router.push({
          path: route.path.replace('/edit', ''),
          query: route.query.from,
        })
      }
    },
    checkout: async (id) => {
      await store.dispatch('item/checkout', {
        api: api,
        ids: [id],
      })
    },
    trash: async (id) => {
      await METHODS.updateState(id, -2)
      message.success('回收成功')
    },
    restore: async (id) => {
      await METHODS.updateState(id, 1)
      message.success('恢復成功')
    },
    updateState: async (id, state) => {
      await store.dispatch('item/updateState', {
        api: api,
        ids: [id],
        state,
      })
      METHODS.getData()
    },
    delete: async (id) => {
      await store.dispatch('item/remove', { api: api, ids: [id] })
      message.success('刪除成功')
      METHODS.onCancel()
    },
    updateToolbar: (data) => {
      if (!!data === false) return

      if (['trash-edit', 'edit'].includes(DATA.toolbar.type)) DATA.toolbar.type = data.state === -2 ? 'trash-edit' : 'edit'

      METHODS.initToolbar(DATA.toolbar)
    },
    updateParams: () => {
      const id = () => {
        const isInsidePage = store.state.global.insidePage.status

        if (isInsidePage) {
          const insidePageId = store.state.global.insidePage.query ? store.state.global.insidePage.query.id : ''

          return Number(insidePageId) || ''
        } else {
          return Number(route.query.id) || ''
        }
      }

      DATA.params.id = id()
      if (['edit', 'add'].includes(DATA.toolbar.type)) DATA.toolbar.type = DATA.params.id ? 'edit' : 'add'
    },
    initData: () => {
      METHODS.updateParams()

      if (DATA.params.id && !disableInitGetData) {
        METHODS.getData()
      }
    },
    addForm: (form, keyName) => {
      DATA.formList[keyName] = form
    },
    deleteForm: (keyName) => {
      delete DATA.formList[keyName]
    },
  }

  METHODS.initData()
  provide('addForm', METHODS.addForm)
  provide('deleteForm', METHODS.deleteForm)

  return {
    ...toRefs(DATA),
    // ...COMPUTED,
    ...METHODS,
  }
}

export const temp = {
  data() {
    return {
      params: {
        id: '',
        pid: '',
      },
      toolbar: {
        type: 'edit',
      },
      disabledCheckout: false,
      disableInitGetData: false,
    }
  },
  provide() {
    return {
      api: this.api,
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: 'initData',
    },
    '$store.state.global.insidePage': {
      handler(val) {
        const isInsidePage = this.$store.state.global.insidePage.status
        const insidePageId = this.$store.state.global.insidePage.query ? this.$store.state.global.insidePage.query.id : ''

        if (isInsidePage) {
          this.params.id = insidePageId
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    forms() {
      const formList = []
      const findNestedForm = (component) => {
        if (component.$options._componentTag === 'el-form') {
          formList.push(component)
          return
        }
        component.$children.forEach((item) => {
          findNestedForm(item)
        })
      }
      findNestedForm(this)
      return formList
    },
  },
  methods: {
    async $_editMixin_getData() {
      const data = await this.$store.dispatch('item/fetchItem', {
        api: this.api,
        id: this.params.id,
      })

      this.defaultValue = { ...this.defaultValue, ...data }

      this.$_editMixin_updateToolbar(data)

      this.afterGetData && this.afterGetData(data)
    },
    async $_editMixin_validate({ submit_data, btn_type }) {
      let failed = false
      for (const form of this.forms) {
        if (!failed) {
          try {
            await form.validate()
          } catch (e) {
            failed = true
            const switchToInvalidTab = () => {
              if (form.$parent.$options._componentTag === 'el-tab-pane') {
                const tabIndex = form.$parent.name || form.$parent.index
                form.$parent.$parent.currentName = tabIndex
              }
            }
            const scrollToInvalidFieldAndFocusField = () => {
              this.$nextTick(() => {
                const $error = form.$el.querySelector('.is-error')
                const scrollToInvalidField = () => {
                  this.$scrollToElement($error, 140)
                }
                const findFocusableElement = () => {
                  const formElement = 'input, select, textarea'
                  $error.querySelector(formElement) && $error.querySelector(formElement).focus()
                }

                scrollToInvalidField()
                findFocusableElement()
              })
            }

            switchToInvalidTab()
            scrollToInvalidFieldAndFocusField()
          }
        }
      }
      /* this.forms.forEach(async (form) => {
        try {
          await form.validate()
        } catch(e) {
          if (form.$parent.$options._componentTag === 'el-tab-pane') {
            const tabIndex = form.$parent.index
            form.$parent.$parent.currentName = tabIndex
          }
        }
      }) */
      if (!failed) {
        this.beforeStoreData && this.beforeStoreData()
        this.$_editMixin_submit({ submit_data: this.defaultValue, btn_type })
      }

      // this.$_editMixin_submit({ submit_data, btn_type })
    },
    async $_editMixin_submit({ submit_data, btn_type }) {
      let submitData = Object.assign({}, submit_data)
      const isInsidePage = this.$store.state.global.insidePage.status

      if (this.params.id) {
        submitData.id = this.params.id
      }

      if (isInsidePage) {
        submitData.brands = [{ id: +this.$route.query.id }]
      }

      const data = await this.$store.dispatch('item/store', {
        api: this.api,
        submitData,
      })

      this.afterGetData && this.afterGetData(data)

      this.$_editMixin_updateToolbar(data)

      this.$_editMixin_onSubmitFinish({
        msg: '項目更新成功',
        btn_type,
        query: { id: data ? data.id : submit_data.id },
      })
    },
    $_editMixin_onSubmitFinish({ msg, btn_type, query }) {
      const { status: isInsidePage, pageGroupId = undefined, pageId = undefined } = this.$store.state.global.insidePage

      this.$message.success(msg)
      switch (btn_type) {
        case 'save':
          if (isInsidePage) {
            this.$store.dispatch('global/setInsidePage', {
              status: 'edit',
              query,
              pageGroupId,
              pageId,
            })
          } else {
            this.$router.push({
              path: this.$route.path,
              query,
            })
          }

          break
        case 'savenadd':
          //Checkout
          /* if (this.checkRouteNeedCheckout(this.$route.path) && query.id) {
            this.handleCheckout(query.id);
          } */

          if (query.id) {
            this.$_editMixin_checkout(query.id)
          }

          if (isInsidePage) {
            this.$store.dispatch('global/setInsidePage', {
              status: 'add',
              pageGroupId,
              pageId,
            })
          } else {
            this.$router.push({
              path: this.$route.path,
            })
            this.$router.go(0)
          }

          break
        case 'savenclose':
          //Checkout
          this.$_editMixin_onCancel(query.id)
          break
      }
    },
    async $_editMixin_onCancel(checkout_id = '') {
      const { status: isInsidePage, pageGroupId = undefined, pageId = undefined } = this.$store.state.global.insidePage

      /* if (this.checkRouteNeedCheckout(this.$route.path) && checkout_id) {
          this.handleCheckout(checkout_id);
      } */

      if (checkout_id && !this.disabledCheckout) {
        await this.$_editMixin_checkout(checkout_id)
      }

      if (isInsidePage) {
        this.$store.dispatch('global/setInsidePage', {
          status: 'list',
          pageGroupId,
          pageId,
        })
      } else {
        this.$router.push({
          path: this.$route.path.replace('/edit', ''),
          query: this.$route.query.from,
        })
      }
    },
    async $_editMixin_checkout(id) {
      await this.$store.dispatch('item/checkout', {
        api: this.api,
        ids: [id],
      })
    },
    async $_editMixin_trash(id) {
      await this.$_editMixin_updateState(id, -2)
      this.$message.success('回收成功')
    },
    async $_editMixin_restore(id) {
      await this.$_editMixin_updateState(id, 1)
      this.$message.success('恢復成功')
    },
    async $_editMixin_updateState(id, state) {
      await this.$store.dispatch('item/updateState', {
        api: this.api,
        ids: [id],
        state,
      })
      this.$_editMixin_getData()
    },
    async $_editMixin_delete(id) {
      await this.$store.dispatch('item/remove', { api: this.api, ids: [id] })
      this.$message.success('刪除成功')
      this.$_editMixin_onCancel()
    },
    $_editMixin_updateToolbar(data) {
      if (!!data === false) return

      if (['trash-edit', 'edit'].includes(this.toolbar.type)) this.$set(this.toolbar, 'type', data.state === -2 ? 'trash-edit' : 'edit')

      this.initToolbar(this.toolbar)
    },
    /* checkRouteNeedCheckout(route) {
        const checkoutArray = ["item", "category", "menu", "site"];
        for (let path of checkoutArray) {
            if (route.includes(path)) {
                return true;
                break;
            }
        }
    }, */
    updateParams() {
      const id = () => {
        const isInsidePage = this.$store.state.global.insidePage.status

        if (isInsidePage) {
          const insidePageId = this.$store.state.global.insidePage.query ? this.$store.state.global.insidePage.query.id : ''

          return Number(insidePageId) || ''
        } else {
          return Number(this.$route.query.id) || ''
        }
      }

      this.params.id = id()
      this.params.pid = Number(this.$route.query.pid) || 1
      if (['edit', 'add'].includes(this.toolbar.type)) this.$set(this.toolbar, 'type', this.params.id ? 'edit' : 'add')
    },
    initData() {
      this.updateParams()

      if (this.params.id && !this.disableInitGetData) {
        this.$_editMixin_getData()
      }
    },
  },
}
