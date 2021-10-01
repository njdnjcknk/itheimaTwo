// import store from '../store'


//导入基地址
import request from '@/utils/request.js'

export const login = data => {
    return request({
        method: 'post',
        url: '/v1_0/authorizations',
        data
    })
}

//定义发送验证码的请求
export const loginVerify = mobile => {
    return request({
        method: 'get',
    })
}

// 请求用户信息
export const getUserName = () => {
    return request({
        method: 'get',
        url: '/v1_0/user',

    })
}

//请求频道数据
export const getUserChannels = () => {
    return request({
        method: 'get',
        url: '/v1_0/user/channels',
    })
}

//获取列表数据
export const getArticles = params => {
    return request({
        method: 'get',
        url: '/v1_1/articles',
        params
    })
}

//获取推荐频道数据
export const getAllChannels = () => {
    return request({
        method: 'get',
        url: '/v1_0/channels',
    })
}

/**
 * 添加用户频道
 */
export const addUserChannel = channel => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/channels',
        data: {
            channels: [channel]
        }
    })
}

/**
 * 删除用户频道
 */
export const deleteUserChannel = channelId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/channels/${channelId}`
    })
}

//搜索模块接口
//搜索联想接口
export const SearchSuggestions = q => {
    return request({
        method: 'get',
        url: '/v1_0/suggestion',
        params: {
            q
        }
    })
}

//搜索结果接口
export const SearchResult = params => {
    return request({
        method: 'get',
        url: '/v1_0/search',
        params
    })
}

/**
 * 根据 id 获取指定文章
 */
export const getArticleById = articleId => {
    return request({
        method: 'GET',
        url: `/v1_0/articles/${articleId}`
    })
}

/**
 * 添加关注
 */
export const addFollow = userId => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target: userId
        }
    })
}

/**
 * 取消关注
 */
export const deleteFollow = userId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${userId}`
    })
}