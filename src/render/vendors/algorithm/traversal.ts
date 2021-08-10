// 二叉树 遍历
/*
          A
        /  \
      B     C
    /  \     \
  D    E      F

*/

// 前序遍历 A-B-D-E-C-F
export function preorderTraversal(root) {
  // 初始化数据
  const res = []
  const stack = []
  while (root || stack.length) {
    while (root) {
      res.push(root.val)
      stack.push(root)
      root = root.left
    }
    root = stack.pop()
    root = root.right
  }
  return res
}

// 中序遍历 D-B-E-A-C-F
export function preorderTraversal2(root) {
  // 初始化数据
  const res = []
  const stack = []
  while (root || stack.length) {
    while (root) {
      stack.push(root)
      root = root.left
    }
    root = stack.pop()
    res.push(root.val)
    root = root.right
  }
  return res
}

// 后序遍历 D-E-B-F-C-A
export function postorderTraversal(root) {
  // 初始化数据
  const res = []
  const stack = []
  while (root || stack.length) {
    while (root) {
      stack.push(root)
      res.unshift(root.val)
      root = root.right
    }
    root = stack.pop()
    root = root.left
  }
  return res
}
