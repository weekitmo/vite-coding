/*

示例 1：

输入：s = "()"
输出：true
示例 2：

输入：s = "()[]{}"
输出：true
示例 3：

输入：s = "(]"
输出：false
示例 4：

输入：s = "([)]"
输出：false

*/
// 用栈解决的问题， 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
export const isValid = function (s) {
  const map = { "{": "}", "(": ")", "[": "]" }
  const stack = []
  for (let i of s) {
    if (map[i]) {
      stack.push(i)
    } else {
      if (map[stack[stack.length - 1]] === i) {
        stack.pop()
      } else {
        return false
      }
    }
  }
  return stack.length === 0
}
