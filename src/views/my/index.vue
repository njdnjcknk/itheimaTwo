<template>
  <div class="my-container">
    <!-- 未登录 -->
    <div class="header not-login" v-if="!user">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" />
        <span class="text">登录&nbsp;/&nbsp;注册</span>
      </div>
    </div>
    <!-- 已登录 -->
    <div class="header user-info" v-else>
      <!-- 用户信息 -->
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="personalInformation.photo"
          />
          <span class="name">{{ personalInformation.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <!-- 用户数据 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ personalInformation.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ personalInformation.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ personalInformation.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ personalInformation.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 宫格导航 -->
    <van-grid class="grid-nav mb-9" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="iconfont icon-shoucang"></i>
        </template>
        <template #text>
          <span class="text">收藏</span>
        </template>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="iconfont icon-lishi"></i>
        </template>
        <template #text>
          <span class="text">历史</span>
        </template>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->
    <!-- 单元格导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" title="小智同学" is-link />
    <van-cell
      class="logout-cell"
      clickable
      title="退出登录"
      v-if="user"
      @click="quit"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserName } from "@/api/user";
export default {
  name: "my",
  components: {},
  props: {},
  data() {
    return {
      personalInformation: {}
    };
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.getPersonalInfo();
  },
  mounted() {},
  methods: {
    quit() {
      this.$dialog
        .confirm({
          title: "确认退出吗？"
        })
        .then(() => {
          //清除容器token和本地存储
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          console.log("取消执行这里");
        });
    },
    async getPersonalInfo() {
      try {
        const { data } = await getUserName();
        // console.log({ data });
        this.personalInformation = data.data;
      } catch (err) {
        console.log(err);
        this.$toast("获取数据失败，请稍后重试");
      }
    }
  }
};
</script>
<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.iconfont {
        font-size: 45px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
