import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        component: () =>
            import ("@/views/login")
    },
    {
        path: '/',
        name: 'layout',
        component: () =>
            import ('@/views/layout'),
        children: [{
            path: '',
            name: 'home',
            component: () =>
                import ("@/views/home")
        }, {
            path: '/pa',
            name: 'pa',
            component: () =>
                import ("@/views/pa")
        }, {
            path: '/video',
            name: 'video',
            component: () =>
                import ("@/views/video")
        }, {
            path: '/my',
            name: 'my',
            component: () =>
                import ("@/views/my")
        }, ]
    }, {
        path: '/search',
        name: 'search',
        component: () =>
            import ("@/views/search")
    }, {
        path: '/article:articleId',
        name: 'article',
        component: () =>
            import ("@/views/article"),
        //方便文章详情页面拿到文章列表页面的id数据进行进一步的操作
        props: true
    }
]

const router = new VueRouter({
    routes
})

export default router