import type { RouteRecordRaw } from "vue-router"

export const vueRouters = function (): Array<RouteRecordRaw> {
  let routerList: Array<RouteRecordRaw> = []
  const modules = import.meta.glob("../views/**/*.vue")
  Object.keys(modules).forEach(key => {
    const nameMatch = key.match(/^\.\.\/views\/(.+)\.vue/)
    if (!nameMatch) return
    const indexMatch = nameMatch[1].match(/(.*)\/Index$/i)
    let name = indexMatch ? indexMatch[1] : nameMatch[1]
    // 首字母转小写 letterToLowerCase 首字母转大写 letterToUpperCase
    routerList.push({
      path: `/${name.toLowerCase()}`,
      name: `${name.toUpperCase()}`,
      component: modules[key]
    })
  })
  return routerList
}
// 下划线转换驼峰
export function toHump(name) {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
// 驼峰转换下划线
export function toLine(name) {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase()
}

// export function getModules() {
//   const components = import.meta.glob("../views/**/*.vue")
//   return components
// }
// export function getComponents() {
//   const components = import.meta.globEager("../views/**/*.vue")
//   return components
// }
