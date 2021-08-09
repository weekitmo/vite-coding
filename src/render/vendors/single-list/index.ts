//节点应用类型
export function SingleNode(val) {
  this.val = val
  this.next = null
}

//链表引用类型
export function SingleList() {
  //哨兵节点
  this.head = new SingleNode("head")
  this.size = 0
}

SingleList.prototype = {
  //在链表尾部添加节点
  add: function (val) {
    let current = this.head
    while (current.next != null) {
      current = current.next
    }
    current.next = new SingleNode(val)

    this.size++
  },

  //遍历链表，不对链表元素操作都可以调用此方法
  forEach: function (callback) {
    for (
      let current = this.head.next;
      current != null;
      current = current.next
    ) {
      callback(current.val)
    }
  },

  //查找链表元素的位置
  indexOf: function (val) {
    let pos = 0
    let current = this.head.next
    while (current != null) {
      if (current.val === val) {
        break
      }
      current = current.next
      pos++
    }
    return pos
  },

  /**
   * 在位置pos处插入节点值为val
   * 若成功则返回插入的值，若失败则返回null
   */
  insert: function (pos, val) {
    if (pos < 0 || pos > this.size - 1) {
      return null
    }

    //插入位置的上一个节点
    let last = this.head
    for (let i = 0; i < pos; i++) {
      last = last.next
    }
    //保存下一个节点的引用
    let ready = last.next
    last.next = new SingleNode(val)
    last.next.next = ready

    this.size++
    return val
  },

  /**
   * 删除指定位置的元素
   * 若成功则返回删除的值，若失败则返回null
   */
  removeAt: function (index) {
    if (index < 0 || index > this.size - 1) {
      return null
    }

    let current = this.head.next
    let last = this.head
    for (let i = 0; i < index; i++) {
      last = current
      current = current.next
    }
    last.next = current.next

    this.size--
    return current.val
  },

  //删除相应元素
  remove: function (val) {
    let current = this.head.next
    let last = this.head
    while (current != null) {
      if (current.val === val) {
        last.next = current.next
        //已删除节点
        this.size--
        break
      }
      last = current
      current = current.next
    }
  },

  // 单链表的遍历显示
  display() {
    let result = ""
    let currNode = this.head

    while (currNode) {
      result += currNode.val
      currNode = currNode.next
      if (currNode) {
        result += " -> "
      }
    }
    console.log(result)
  }
}

// let myList = new SingleList()
// let arr = [3, 4, 5, 16, 7, 18, 9, 5]

// for (let i = 0; i < arr.length; i++) {
//   myList.add(arr[i])
// }

// myList.display()

// // 判断是否有环
// function isLoop(head) {
//   let record = new Map()
//   while (head) {
//     if (record.get(head.val)) {
//       console.log(`loop node in ${head.val}`)
//       return true
//     } else {
//       record.set(head.val, head)
//       head = head.next
//     }
//   }
//   return false
// }

// let result = isLoop(myList.head)
// console.log(result)
