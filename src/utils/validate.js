export default {
  validatePhone (rule, value, callback) {
    const reg = /^[1][3-9][0-9]{9}$/
    if (!value) {
      return callback(new Error('请输入手机号码'))
    }
    if ((!reg.test(value))) {
      callback(new Error('手机号码格式错误'))
    } else {
      callback()
    }
  }
}
