// 是否回文

// 1-2-2-1 true
// 1-2-3 false
// 快慢指针
/**
 * 时间复杂度：O(n)。
   空间复杂度：O(1)，只用了slow,fast两个指针。
 * @param head 
 * @returns {boolean}
 */
export function isPalindrome(head: { next: any; val: any } | null): boolean {
  let fast, slow
  fast = slow = head
  while (fast != null && fast.next != null) {
    fast = fast.next.next
    slow = slow.next
  }
  let left = head
  let right = reverse(slow)
  while (right != null) {
    if (left.val != right.val) {
      return false
    }
    left = left.next
    right = right.next
  }
  return true

  function reverse(head) {
    let pre = null,
      cur = head
    while (cur != null) {
      const next = cur.next
      cur.next = pre
      pre = cur
      cur = next
    }
    return pre
  }
}

// 反转链表 将当前节点的 \textit{next}next 指针改为指向前一个节点
// head=>1=>2=>3=>null，我们想要把它改成 head<=1<=2<=3<=null。

export const reverseList = function (head) {
  let prev = null
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}

import { SingleList } from "../single-list/index"

const test1 = new SingleList()
let arr = [1, 2, 3, 3, 2, 1]

for (let i = 0; i < arr.length; i++) {
  test1.add(arr[i])
}

test1.display()

const b = isPalindrome(test1)
console.log(b)
