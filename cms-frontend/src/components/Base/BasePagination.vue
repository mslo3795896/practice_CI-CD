<script>
  import _debounce from 'lodash/debounce'
  import setWindowHistory from "@utils/window-history";

  export default {
    props: {
      pagination: {
        type: Object,
        default: () => {
          return {
            "current_page": 1,
            "first_page_url": "http://admin.ds.test/api/merchant/prepaids?page=1",
            "from": 1,
            "last_page": 1,
            "last_page_url": "http://admin.ds.test/api/merchant/prepaids?page=1",
            "next_page_url": null,
            "path": "http://admin.ds.test/api/merchant/prepaids",
            "per_page": 6,
            "prev_page_url": null,
            "to": 3,
            "total": 50
          }
        }
      },
    },
    methods: {
      changePagination: _debounce(function (value) {
        setWindowHistory({
          query: {
            // ...this.$route.query,
            page: value
          }
        });

        this.$emit('change', value);
      }, 300),
    }
  }
</script>
<template>
  <div>
    <el-pagination
      v-if="!!pagination && pagination.current_page <= pagination.last_page"
      :current-page="pagination.current_page"
      :hide-on-single-page="true"
      :page-size="pagination.per_page"
      :pager-count="5"
      :total="pagination.total"
      layout="prev, pager, next"
      class="isStyleBase"
      :class="$style.basePagination"
      @current-change="changePagination"
    >
    </el-pagination>
  </div>
</template>
<style lang="scss" module>
  .basePagination {
    text-align: center;
    margin-top: 2rem;
    :global {
      .basePagination {
        @include unstyled;
      }
    }
  }
</style>
