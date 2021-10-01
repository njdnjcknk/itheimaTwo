import Vue from 'vue'
import Vuex from 'vuex'

import { setToken, getToken } from '../utils/storage'
Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
    state: {
        user: getToken(TOKEN_KEY)
            // JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    },
    mutations: {
        setUser(state, data) {
            //将传过来的token保存给user变量后期谁用谁取
            state.user = data
                // 重新刷新页面内之后容器中的token会丢失所以还要保存到本地存储
                // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
            setToken(TOKEN_KEY, state.user)
        }
    },
    actions: {},
    modules: {}
})