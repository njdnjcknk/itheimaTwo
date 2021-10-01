// 存token
export const setToken = (key, value) => {
    // 判断传过来的value是否是一个对象是存进本地
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}

//取token
export const getToken = (key) => {
    const data = window.localStorage.getItem(key)
    try {
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}

//删token
export const removeToken = key => {
    window.localStorage.removeItem(key)
}