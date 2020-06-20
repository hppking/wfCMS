import axios from 'axios'
import store from 'store'
import { intersection } from 'rambda'
import { parseURL } from './url'

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
});
/*
export default function */

service.interceptors.request.use(
    config => {
        const URL = parseURL(window.location.href)
        //请求页面
        config.headers['X-Referer'] = URL.hash
        //页面参数
        config.headers['X-Option'] = URL.query
        //当前页面URL
        config.headers['X-Url'] = URL.source
        if (store.get('token')) {
            //登录成功后token
            config.headers['X-Token'] = store.get('token')
        }

        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default (_url, data, ops = {}) => {
    const params = _url.split(' ')
    const methods = ['GET', 'POST', 'PUT', 'DELETE']
    const _method = intersection(methods, params)
    const method = _method.length > 0 ? _method[0] : 'GET'
    const url = _url.indexOf('://') > -1 ? _url.replace(method, '').replace(/\s/g, '') : '/api' + _url.replace(method, '').replace(/\s/g, '')
    if (arguments.length == 3) { //请求头

    }
    const options = { method, url, data, ...ops }
    if (method == 'GET') {
        options.params = data || {};
        delete options.data
    }
    return service(options)
};
