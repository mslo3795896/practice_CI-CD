<script>
import { defineAsyncComponent, ref, reactive, nextTick, onMounted, onBeforeMount, toRaw } from 'vue'
import useEdit from '@composition/edit'

export default {
  setup(props) {
    const submitData = reactive({
      text: '',
      title: '',
      date: '',
    })

    const EDIT = useEdit({
      api: 'brand',
      defaultValue: submitData,
    })

    return {
      submitData,
      ...EDIT,
    }
  },
  components: {
    Layout: defineAsyncComponent(() => import('@layout/main.vue')),
    // FormQuick: () => import("@components/Form/FormQuick.vue"),
  },
  data() {
    return {
      activeKey: '1',
    }
  },
  computed: {},
}
</script>
<template>
  <Layout
    >EDIT
    <a-button @click="validate">SUBMIT</a-button>

    <div v-for="i in 50">...</div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="Tab 1">
        <BaseForm :model="submitData">
          <a-form-item label="Activity name" name="text" required>
            <a-input v-model:value="submitData.text"></a-input>
          </a-form-item>
          <a-form-item label="Date" name="date" required>
        <a-date-picker v-model:value="submitData.date" :valueFormat="'YYYY-MM-DD'"/>
      </a-form-item>
        </BaseForm>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2" forceRender>
        <BaseForm :model="submitData">
          <a-form-item label="title" name="title" required>
            <a-input v-model:value="submitData.title"></a-input>
          </a-form-item>
        </BaseForm>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
    </a-tabs>
    <div v-for="i in 50">...</div>
  </Layout>
</template>
