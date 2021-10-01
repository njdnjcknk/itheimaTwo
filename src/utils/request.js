/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store' // <===========增加
import jsonBig from 'json-bigint'

const request = axios.create({
    baseURL: 'http://toutiao-app.itheima.net/', // 接口的基准路径
    // transformResponse 允许自定义原始的响应数据（字符串）
    transformResponse: [function(data) {
        try {
            // 如果转换成功则返回转换的数据结果
            return jsonBig.parse(data)
        } catch (err) {
            // 如果转换失败，则包装为统一数据格式并返回
            return data
        }
    }]
})

// 请求拦截器   <===========增加
request.interceptors.request.use(function(config) {
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
}, function(error) {
    return Promise.reject(error)
})

// 响应拦截器


export default request