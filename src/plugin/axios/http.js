import axios from 'axios'
import Qs from 'qs'
import Vue from 'vue'
import { Loading,
  Message
} from 'element-ui'

// import { Message } from 'element-ui';
import router from '@/router'

axios.defaults.timeout = 5000
axios.defaults.baseURL = window.apiObj.ApiUrl

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');//注意使用的时候需要引入cookie方法，推荐js-cookie
    // console.log(config)
    //
    config.data = Qs.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    // if(token){
    //   config.params = {'token':token}
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // console.log(error.response)
    if (error.response.status == 505) {
      window.localStorage.removeItem('token')
      window.localStorage.clear()
      router.push('/login')
    } else if (error.response.status == 509) {
      Message({
        message: error.response.data.msg,
        type: 'error'
      })
      router.push('/401')
    } else {
      Message({
        message: error.response.data.msg,
        type: 'error'
      })
    }

    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch (url, params = {}) {
  return new Promise((resolve, reject) => {
    let loadingInstance = Loading.service({
      lock: true,
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.3)'
    })
    axios.get(axios.defaults.baseURL + url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
        loadingInstance.close()
      })
      .catch(err => {
        reject(err)
        loadingInstance.close()
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
  data.token = window.localStorage.getItem('token')
  let loadingInstance = Loading.service({
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.3)'
  })
  return new Promise((resolve, reject) => {
    axios.post(axios.defaults.baseURL + url, data)
      .then(response => {
        resolve(response.data)
        loadingInstance.close()
      }, err => {
        reject(err)
        loadingInstance.close()
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

// export function patch(url,data = {}){
//   return new Promise((resolve,reject) => {
//     axios.patch(url,data)
//          .then(response => {
//            resolve(response.data);
//          },err => {
//            reject(err)
//          })
//   })
// }

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

// export function put(url,data = {}){
//   return new Promise((resolve,reject) => {
//     axios.put(url,data)
//          .then(response => {
//            resolve(response.data);
//          },err => {
//            reject(err)
//          })
//   })
// }
