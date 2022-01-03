export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    dialogMixinDialogVisible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value);
      }
    },
  },
  methods: {
    $DialogMixinOnClose() {
      this.dialogMixinDialogVisible = false
    }
  },
}
