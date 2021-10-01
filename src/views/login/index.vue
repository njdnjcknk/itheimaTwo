<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
        <van-icon name="arrow-left" @click="$router.back()" />
      </template>
    </van-nav-bar>

    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="one">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="theValidationRule.mobile"
      >
        <!--【增加图标】-->
        <template #left-icon>
          <i class="iconfont icon-shouji"></i>
        </template>
      </van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="theValidationRule.code"
      >
        <!--【增加图标】-->
        <template #left-icon>
          <i class="iconfont icon-yanzhengma"></i>
        </template>
        <!--【增加发送按钮】-->
        <template #button>
          <!--这里注意，要加上native-type,否则也可以实现表单提交-->
          <van-count-down
            :time="1000 * 5"
            format="ss s"
            v-if="timeValue"
            @finish="timeValue = false"
          />
          <van-button
            class="send-sms-btn"
            round
            size="small"
            native-type="button"
            type="default"
            @click="verify"
            v-else
          >
            发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, loginVerify } from "@/api/user";
export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "",
        code: ""
      },
      theValidationRule: {
        mobile: [
          {
            required: true,
            message: "请填写手机号"
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误"
          }
        ],
        code: [
          {
            required: true,
            message: "请填写验证码"
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误"
          }
        ]
      },
      timeValue: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      const user = this.user;
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 3000
      });
      try {
        const res = await login(user);
        console.log(res);
        this.$toast.success("登录成功");
        //存储到仓库
        this.$store.commit('setUser',res.data.data)
//登录成功退回原来页面不够严谨后期优化
             this.$router.back()
        // 下一步优化token存取
   
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("手机号或验证码错误");
        } else {
          this.$toast.fail("登录失败，请稍后重试");
        }
      }
    },
    async verify() {
      // 点击登录验证手机号vant中validate方法返回一个Promise对象
      try {
        await this.$refs.one.validate("mobile");
      } catch (err) {
        return console.log("验证错误" + err);
      }
      this.timeValue = true;
      //发送验证码请求
      try {
        const res = await loginVerify(this.user.mobile);
        // console.log(res);
        this.$toast("获取验证码成功");
      } catch (err) {
        console.log(err);
        if (err.response.status === 429) {
          this.$toast("发送太频繁了，请稍后重试");
        } else {
          this.$toast("发送失败，请稍后重试");
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 160px;
    height: 46px;
    line-height: 100%;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 30px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
