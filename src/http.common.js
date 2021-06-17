import axios from 'axios';
import Cookies from 'js-cookie';
let instance = axios.create({
    baseURL: process.env.BASE_URL || "https://todo-appdemo.herokuapp.com/api",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.setAccessToken = (access_token) => {
    window.localStorage.setItem('ACCESS_TOKEN', access_token)
    Cookies.set('ACCESS_TOKEN', access_token)
}

instance.setTokens = (tokens) => {
    Cookies.set('TOKENS', tokens)
}

const getLocalRefreshToken = () => {
    console.log(JSON.parse(Cookies.get('TOKENS')).refresh_token)
    return JSON.parse(Cookies.get('TOKENS')).refresh_token;
}

const getLocalAccessToken = () => {
    let access_token = window.localStorage.getItem('ACCESS_TOKEN') || Cookies.get('ACCESS_TOKEN')
    if (access_token) {
        instance.setAccessToken(access_token)
        return access_token
    }
    return '';
}

const getNewAccessToken = () => {
    return instance({
        method: 'post',
        url: "/auth/refreshtoken",
        headers: { 'x-refresh-token': getLocalRefreshToken() }
    })
}

const clearTokens = () => {
    window.localStorage.removeItem("ACCESS_TOKEN");
    Cookies.remove('TOKENS', { path: '/' })
    Cookies.remove('ACCESS_TOKEN', { path: '/' })
}
instance.defaults.headers.common['x-access-token'] = getLocalAccessToken();

instance.interceptors.request.use((request) => {
    return request
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
    return response
}, error => {
    let { status } = error.response
    if (status === 401) {
        console.log('Get new access_token using refresh_token')
        getNewAccessToken().then((res) => {
            const { access_token } = res.data;
            instance.setAccessToken(access_token);
        })
    }

    return Promise.reject(error)
})

export {
    instance,
    getLocalRefreshToken,
    getLocalAccessToken,
    clearTokens
};