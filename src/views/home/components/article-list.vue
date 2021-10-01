<template>
  <div class="article-list">
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <ArticleItme
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        />
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/user.js";
import ArticleItme from "@/components/article-item/index.vue";
export default {
  name: "ArticleList",
  components: {
    ArticleItme
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 是否加载失败
      refreshSuccessText: "刷新成功",
      isLoading: false // 控制下拉刷新的 loading 状态
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad() {
      // 1. 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        });
        // console.log(data);
        // 2. 把请求结果数据追加放到 list 数组中  【一定要记住是追加，因为只有追加才会让列表高度不断增加】
        const { results } = data.data;
        //  console.log(results);
        this.list.push(...results);
        // console.log(this.list);
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false;
        // loading 关闭以后才能触发下一次的加载更多
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          this.timestamp = data.data.pre_timestamp;
          // console.log(this.timestamp);
        } else {
          // 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
          this.finished = true;
        }
      } catch (err) {
        console.log("加载错误" + err);
        this.loading = false;
        this.error = true;
      }
    },
    async onRefresh() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        });
        this.list.unshift(...data.data.results);
        //关闭下拉刷新的状态
        this.isLoading = false;
        this.refreshSuccessText = `刷新成功更新${data.data.results.length}条数据`;
      } catch (err) {
        console.log(err);
        this.refreshSuccessText = "更新失败";
        this.isLoading = false;
      }
    }
  }
};
</script>
<style lang="less" scope>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
