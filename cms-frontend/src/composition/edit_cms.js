export default {
  created() {
    this.$nextTick(() => {
      this.$$eventBus.$on("onClickCMSFormDataToolbar", btnOpts => {
        const { type } = btnOpts
        const {status: isInsidePage, query: {id: insidePageID} = {}} = this.$store.state.global.insidePage
        const id = isInsidePage ? insidePageID : this.$route.query.id

        switch (type) {
          case "cancel":
            this.$_editMixin_onCancel(id);
            break;
          case "save":
          case "savenclose":
          case "savenadd":
            /* this.handleSubmit({
              btn_type: type,
              submit_data: this.defaultValue
            }); */
            // this.beforeStoreData && this.beforeStoreData()
            this.$_editMixin_validate({
              btn_type: type,
              submit_data: this.defaultValue
            });
            break;
          case "trash":
            // this.handleTrash();
            this.$_editMixin_trash(id);
            break;
          case "delete":
            // this.handleTrash();
            this.$_editMixin_delete(id);
            break;
          case "restore":       // 恢復
            // this.handleTrash();
            this.$_editMixin_restore(id);
            break;
        }
      });
    })

  },
  mounted() {
    this.initToolbar(this.toolbar);
  },
  beforeDestroy() {
    this.initToolbar();
    this.$$eventBus.$off("onClickCMSFormDataToolbar");
  },
  methods: {
    initToolbar(data = {}) {
      this.$$eventBus.$emit("onInitToolbar", {
        name: "CMSFormData",
        data
      });
    }
  }
};
