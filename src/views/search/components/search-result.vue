<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { SearchResult } from "@/api/user.js";
export default {
  name: "SearchResult",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error:false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 发请求
        const { data } = await SearchResult({
          page: this.page, //页码
          per_page: this.per_page, //每页展示的数据
          q: this.searchText //搜索关键字
        });
        //拿到数据
        const { results } = data.data;
        this.list.push(...results);
        //关闭加载状态loadding
        this.loading = false;
        //如果还有数据将finished结束状态设为关闭
        if (results.length) {
          this.page++;
        } else {
          this.finished = true;
        }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true;
        // 加载失败了 loading 也要关闭
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped lang="less"></style>
