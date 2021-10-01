import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//加载全局样式
import '@/styles/index.less'
//加载icon图标样式
import '@/styles/icon.less';
//加载移动端自适应设备
import 'amfe-flexible'
//加载vant组件
import Vant from 'vant'
import 'vant/lib/index.css'
//引入处理相对时间的过滤器
import './utils/dayjs'
// import { Toast, CountDown, Icon, Dialog, Tab, Tabs, List, PullRefresh, Popup, Grid, } from 'vant';
import { Form, Field, Toast, CountDown, Icon, Image as VanImage, Tab, Tabs, List, PullRefresh, Cell, CellGroup, Popup, Grid, GridItem, } from 'vant'
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Popup);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(Tab);
Vue.use(Tabs);
// Vue.use(Dialog);
Vue.use(Icon);
Vue.use(CountDown);
Vue.use(Toast)
Vue.use(Vant)
    // Vue.use(ImagePreview)
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')