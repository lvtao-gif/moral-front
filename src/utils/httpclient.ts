import axios from "axios";
import router from '@/router'

axios.defaults.baseURL = ''

//post请求头
axios.defaults.headers.post["Content-Type"] = "application/json";

//设置超时
axios.defaults.timeout = 5000;

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status == 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    err => {
        // alert(`异常请求：${JSON.stringify(error.message)}`)
        if (err.response && err.response.status === 401) {
            alert(`身份认证已失效，请重新登录`)
            const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
            router.push('/login?redirectUrl=' + fullPath)
        }
    }
)
export default {
    post(url, data, heads) {
        return new Promise((resolve, reject) => {

            axios({
                method: 'post',
                url,
                data: data,
                headers: heads,
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                });
        })
    },

    put(url, data, heads) {
        return new Promise((resolve, reject) => {

            axios({
                method: 'put',
                url,
                data: data,
                headers: heads,
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                });
        })
    },

    get(url, data) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                params: data,
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
};
