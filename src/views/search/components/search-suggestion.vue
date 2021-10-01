<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(item, index) in SuggestionsList"
      :key="index"
      @click="$emit('search',item)"
    >
    <span slot="title" v-html="higtnline(item)"></span>
    </van-cell>
  </div>
</template>

<script>
import { SearchSuggestions } from "@/api/user.js";
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      SuggestionsList: []
    };
  },
  computed: {},
  watch: {
    //深度监听文本输入框的值变化就调用发起请求的函数
    searchText: {
      // debounce防抖函数减少发送请求次数
      handler:debounce(function(val) {
     this.loadSearchSuggestions(val)
      },1500) ,
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created() {},
  mounted() {},
  methods: {
    //请求数据
    async loadSearchSuggestions(q) {
      try {
        const { data } = await SearchSuggestions(q);
        this.SuggestionsList = data.data.options;
      } catch (err) {
        this.$taost("获取失败请稍后重试");
      }
    },
higtnline(val){
  const htmlstr = `<span class='active'>${this.searchText}</span>`
  const str = new RegExp(this.searchText,'gi')
 return  val.replace(str,htmlstr)
}
  }
};
</script>

<style scoped lang="less">
.search-suggestion{
/deep/.active{
  color: red;
}
}
</style>
