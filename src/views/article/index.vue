<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="articleList.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articleList.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round1
            fit="cover"
            :src="articleList.aut_photo"
          />
          <div slot="title" class="user-name">{{ articleList.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ articleList.pubdate | relativeTime }}
          </div>
          <van-button
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            v-if="!articleList.is_followed"
            @click="concernClick"
            :loading="loadingbtn"
            >关注</van-button
          >
          <van-button
            class="follow-btn"
            round
            size="small"
            v-else
            @click="concernClick"
            :loading="loadingbtn"
            >已关注</van-button
          >
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="articleList.content"
          ref="articlecontent"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" info="123" color="#777" />
          <van-icon color="#777" name="star-o" />
          <van-icon color="#777" name="good-job-o" />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from "@/api/user.js";
import { addFollow, deleteFollow } from "@/api/user.js";
  import { ImagePreview } from "vant"; // 导入预览插件
export default {
  name: "ArticleIndex",
  components: {},
  props: {
    // 使用props获取动态路由的数据
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      articleList: [], //存储请求的文章内容数据
      loading: false, //控制loading状态
      errStatus: 0, // 失败的状态码
      loadingbtn: false
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    //请求文章数据
    async loadArticle() {
      //刚开始加载时让loading状态改为true当网速请求慢时会显示出来
      this.loading = true;
      try {
        const { data } = await getArticleById(this.articleId);
        console.log(data);
        this.articleList = data.data;
        //图片预览异步进行
        setTimeout(() => {
          // console.log(this.$refs['articlecontent'])
          this.previewImage();
        }, 0);
      } catch (err) {
        console.log(err);
        if (err.response && ree.response.ststus === 404) {
          this.errStatus = 404;
        }
        this.$toast("获取失败");
      }
      //刚加载完成时让loading状态改为false请求完成隐藏掉
      this.loading = false;
    },
    //关注的功能显示与隐藏
    async concernClick() {
      if (!this.$store.state.user) return this.$toast("请登录");
      try {
        if (this.articleList.is_followed) {
          await deleteFollow(this.articleList.aut_id);
        } else {
          await addFollow(this.articleList.aut_id);
        }
        this.articleList.is_followed = !this.articleList.is_followed;
      } catch (err) {
        if (err && err.response.status === 400) {
          this.$toast("你不能关注自己");
        } else {
          this.$toast.fail("操作失败");
        }
      }
      this.loadingbtn = false;
    },
    previewImage() {
     const articleNode = this.$refs["articlecontent"];
     const imgs = articleNode.querySelectorAll('img');
     const images = [];
     imgs.forEach((img, index) => {
       images.push(img.src)
       img.onclick = () => {
         ImagePreview({
           images,
           startPosition: index
         });
       };
     });
    //       // 得到所有的 img 节点
    // const articleContent = this.$refs['articlecontent']  // 获取到了容器节点
    // const imgs = articleContent.querySelectorAll('img')

    // // 获取所有 img 地址
    // const images = []
    // imgs.forEach((img, index) => {
    //     images.push(img.src)

    //     // 给每个 img 注册点击事件，在处理函数中调用预览
    //     img.onclick = () => {
    //         ImagePreview({
    //             // 预览的图片地址数组
    //             images,
    //             // 起始位置，从 0 开始
    //             startPosition: index
    //         })
    //     }
    // })
    }
  }
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
