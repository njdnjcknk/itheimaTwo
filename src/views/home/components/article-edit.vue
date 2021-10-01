<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="delButton = !delButton"
        >{{ delButton ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in channels"
        :key="index"
        @click="delChannel(item, index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="delButton && !theInitialButton.includes(item.id)"
        ></van-icon>
        <span class="text" slot="text" :class="{ active: active === index }">{{
          item.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        icon="plus"
        :text="obj.name"
        v-for="(obj, index) in recommentChannels"
        :key="index"
        @click="addChannel(obj)"
      >
      </van-grid-item>
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from "@/api/user.js";
import { mapState } from "vuex";
import { setToken } from "@/utils/storage.js";
export default {
  name: "ChannelEdit",
  components: {},
  props: {
    //单向数据流父亲的频道列表
    channels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      AllChannel: [], //所有频道列表
      delButton: false, //控制×按钮显示隐藏
      theInitialButton: [0] //初始状态的按钮
    };
  },
  computed: {
    // 处理展示推荐频道=所有频道-我的频道
    recommentChannels() {
      //简化写法
      // 数据的filter方法：遍历数组，把符合条件的元素存储到新数组中并返回
      // return this.AllChannels.filter(item=>{
      // 数组的find方法遍历数组把把符合条件的第一个元素返回
      //   return !this.mychane.find(obj=>{
      //     return obj.id===item.id
      //   })
      // })
      //复杂写法
      let arr = []; //定义存储推荐频道的数组
      this.AllChannel.forEach(item => {
        //遍历所有频道数据forEach
        //遍历传过来的我的频道数据find查找所有频道id和我的频道id是否有相同的条件表达式是true则返回当前元素
        const res = this.channels.find(obj => {
          return obj.id === item.id; //return一个结果
        });
        if (!res) {
          //取返回结果的相反值false则是没有的频道
          arr.push(item); //push进定义的数组
        }
      });
      return arr; //return给计算属性
    },
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadAllChannel();
  },
  mounted() {},
  methods: {
    async loadAllChannel() {
      try {
        const { data } = await getAllChannels();
        //将获取到的所有频道赋值给定义的数组
        this.AllChannel = data.data.channels;
      } catch (err) {
        console.log(err);
        this.$toast("获取失败");
      }
    },
    async addChannel(obj) {
      //往我的频道添加数据因为是计算属性所以当我的频道发生变化计算属性也会跟着改变所以推荐频道就不需要删除事件
      this.channels.push(obj);
      //处理添加持久化
      if (this.user) {
        try {
          await addUserChannel({
            id: obj.id,
            seq: this.channels.length
          });
        } catch (err) {
          console.log(err);
          this.$toast("请求失败");
        }
      } else {
        setToken("USER_TOKEN", this.channels);
      }
    },
    async delChannel(item, index) {
      //判断是否是编辑的状态才能开始进行修改
      if (this.delButton) {
        if (this.theInitialButton.includes(item.id)) {
          return;
        }
        //编辑状态进行删除操作
        this.channels.splice(index, 1);
        //处理删除持久化
        try {
          if (this.user) {
            await deleteUserChannel(item.id);
          } else {
            setToken("USER_TOKEN", this.channels);
          }
        } catch (err) {
          this.$toast("删除失败");
        }

        if (index <= this.active) {
          this.$emit("updata-active", index, true);
        }
      } else {
        //非编辑状态进行跳转改变active的值子传父
        this.$emit("updata-active", index, false);
      }
    }
  }
};
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
