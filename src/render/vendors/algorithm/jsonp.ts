/**
 * 只能发送Get请求 不支持post put delete
   不安全 xss攻击
 * @param param0 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function jsonp({ url, params, cb }) {
  return new Promise((resolve, reject) => {
    const w = window as any
    w[cb] = function (data) {
      // 声明全局变量
      resolve(data)
      document.body.removeChild(script)
    }
    params = { ...params, cb }
    let arrs = []
    for (let key in params) {
      arrs.push(`${key}=${params[key]}`)
    }
    let script = document.createElement("script")
    script.src = `${url}?${arrs.join("&")}`
    script.onerror = function () {
      reject(`script error`)
    }
    document.body.appendChild(script)
  })
}
