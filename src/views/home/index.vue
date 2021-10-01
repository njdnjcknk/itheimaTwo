<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <!--
animated 滑动的动画
border 底边框线
swipeable 开启左右手势滑动
-->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated border>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <Article-list :channel="item"></Article-list>
      </van-tab>
      <!-- 右侧自定义内容 -->
      <template #nav-right>
        <!-- 占位元素 -->
        <div class="placeholder"></div>
        <!-- 右侧按钮 -->
        <div class="hamburger-btn" @click="show=true">
          <i class="iconfont icon-gengduo"></i>
        </div>
      </template>
    </van-tabs>
    <!-- /频道列表 -->
    <van-popup
      v-model="show"
      closeable
      round
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '95%' }"
    >
      <!-- 弹出层组件 -->
      <Channeledit
        :channels="channels"
        :active="active"
        @updata-active="onUpdataActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user.js";
import ArticleList from "./components/article-list.vue";
import Channeledit from "./components/article-edit.vue";
import { mapState } from "vuex";
import { getToken } from "@/utils/storage.js";
//引入列表组件
export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    Channeledit
  },
  props: {},
  data() {
    return {
      channels: [], //频道列表
      active: 1, //高亮显示
      show: false //弹出层显示
    };
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadChannels();
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        //  const { data } = await getUserChannels();
        //  this.channels = data.data.channels;
      if (this.user) {
        const { data } = await getUserChannels();
        this.channels = data.data.channels;
     
      } else {
        const localStorage = getToken("USER_TOKEN");
          console.log(this.channels,222);
        if (localStorage) {
          this.channels = localStorage;
        } else {
          const { data } = await getUserChannels();
          this.channels = data.data.channels;
        }
      }
       
      } catch (err) {
        console.log(err);
        console.log("请求失败" + err);
      }
    },
   
    //跳转改变active
    onUpdataActive(index, show) {
      this.active = index;
      this.show = show;
    }
  }
};
</script>

<style scoped lang="less">
.home-container {
  // 留出底部固定导航栏
  padding-bottom: 100px;
  // 其他样式
  padding-top: 92px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.iconfont {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
