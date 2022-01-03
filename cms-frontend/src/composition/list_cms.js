export default {
    methods: {
        $_listMixin_init() {
            // 能變更狀態的只有 list，list_user 不能變更狀態
            if (['trash', 'list'].includes(this.toolbar.type))
                this.$set(
                    this.toolbar,
                    "type",
                    this.$route.query.state === "-2" ? "trash" : "list"
                );

            /* 觸發過一次過濾搜尋時，searchbar.defaultValue 的完整資料才會出現在 $route.query，
               所以之後的 searchbar.defaultValue 應該要等於 $route.query */
            if (this.count > 0)
                Object.keys(this.searchbar.defaultValue).forEach(key=> {
                    this.searchbar.defaultValue[key] = this.$route.query[key]
                })
            
            
            this.count++
            this.$_listMixin_getList();
        }
    }
};
