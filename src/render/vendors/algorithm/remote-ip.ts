/**
 * 输入：s = "25525511135"
   输出：["255.255.11.135","255.255.111.35"]
   输入：s = "101023"
   输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]

 * @param s 
 * @returns {Array}
 */
export function restoreIpAddresses(s: string): string[] {
  //res保存最终结果,temp表示每一个路径分支产生的结果
  let res: string[] = [],
    temp: string[] = []
  //start表示从s的哪一位开始，这里从s的第0位开始
  let start = 0
  if (s.length < 4 || s.length > 12) return res
  //递归函数
  restoreIp(s, start, temp, res)
  return res
}

function restoreIp(s: string, start: number, temp: string[], res: string[]) {
  //递归终止条件
  if (temp.length === 4 && start === s.length) {
    res.push(temp.join("."))
    return
  } else if (temp.length > 4) {
    //当temp的长度超过4就直接返回，因为肯定不满足IP地址的条件
    return
  }
  for (let i = start; i < s.length; i++) {
    //1.位数超过1位并且起始点是0的剪掉
    if (i + 1 - start > 1 && s[start] === "0") return

    // rest表示s的前i个字符（也就是取走的字符，在图中是第一行的1,12,123等）
    const rest = s.substring(start, i + 1)
    //2.大于255的剪掉
    if (+rest > 255) return

    temp.push(rest)
    //保存了前i个字符(rest)就继续从第i+1开始分割
    restoreIp(s, i + 1, temp, res)
    temp.pop()
  }
}

console.log(restoreIpAddresses("101023"))
