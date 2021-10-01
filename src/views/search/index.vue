<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!--
          Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
         -->
    <form class="search-form" action="/">
      <van-search
        v-model.trim="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus='isshow=false'
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <SearchResult v-if="isshow" :searchText="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <SearchSuggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <SearchHistory v-else
    :SearchHistory='SearchHistory'
    @search="onSearch"
     />
    <!-- /搜索历史记录 -->
  </div>
</template>
<script>
import SearchResult from "./components/search-result.vue";
import SearchHistory from "./components/search-history.vue";
import SearchSuggestion from "./components/search-suggestion.vue";
 import {setToken,getToken} from '@/utils/storage.js'
export default {
  name: "SearchPage",
  components: {
    SearchResult,
    SearchHistory,
    SearchSuggestion
  },
  props: {},
  data() {
    return {
      searchText: "", // 绑定输入框变量
      isshow: false, //控制搜索结果和历史记录的显示
     SearchHistory: getToken('SearchHistory') || []//本地有用本地的没有就用空的
    };
  },
  computed: {},
  watch: {
     SearchHistory(val){
       //存储到本地因为是会变化的所以要深度监听
       setToken('SearchHistory',val)
     }
  },
  created() {},
  methods: {
    onSearch(val) {
      this.searchText = val;
      //触发搜索函数时让搜索结果页面展示出来
      this.isshow = true;
      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.SearchHistory.indexOf(val);
      if (index !== -1) {
        this.SearchHistory.splice(index, 1);
      }
      this.SearchHistory.unshift(val);
    
    },
    onCancel() {
      this.$router.back();
    }
  }
};
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
