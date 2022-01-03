export default {
  props: {
    defaultValue: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      FormMixTempSubmitData: { ...this.value }
    }
  },
  computed: {
    FormMixSubmitData: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value);
      }
    },
  },
  created() {
    const initFormMixSubmitData = () => {
      if(Object.keys(this.defaultValue)[0]) {
        Object.keys(this.FormMixSubmitData)
          .forEach(key => {
            this.FormMixSubmitData[key] = this.defaultValue[key];
          });
      } else {
        Object.keys(this.FormMixSubmitData)
          .forEach(key => {
            this.FormMixSubmitData[key] = this.value[key];
          });
      }
    };

    initFormMixSubmitData();
  },
  mounted() {

  },
  methods: {
    $FormMixinOnSubmitSuccess({ params } = {}) {
      this.$emit('submitCallback', {
        submitData: this.FormMixSubmitData,
        ...params
      });
    },
    $FormMixinOnResetSubmitData() {
      Object.keys(this.FormMixSubmitData)
        .forEach(key => {
          this.FormMixSubmitData[key] = this.FormMixTempSubmitData[key];
        });
    },
    $FormMixinInitTempSubmitData() {
      Object.keys(this.FormMixSubmitData)
        .forEach(key => {
          this.FormMixTempSubmitData[key] = this.FormMixSubmitData[key];
        });
    },
    $FormMixinResetObserver() {
      this.$refs.observer.reset();
    }
  }
}
