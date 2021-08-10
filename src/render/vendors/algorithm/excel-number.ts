/*

示例 1：

输入：columnNumber = 1
输出："A"
示例 2：

输入：columnNumber = 28
输出："AB"
示例 3：

输入：columnNumber = 701
输出："ZY"
示例 4：

输入：columnNumber = 2147483647
输出："FXSHRXW"

*/
// 说白了就是26进制换算
export const titleToNumber = function (columnTitle) {
  let ans = 0
  for (let i = 0; i < columnTitle.length; i++) {
    ans = ans * 26 + (columnTitle[i].charCodeAt(0) - "A".charCodeAt(0) + 1)
  }
  return ans
}
