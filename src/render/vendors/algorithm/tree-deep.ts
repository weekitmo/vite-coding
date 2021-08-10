// 二叉树 最小深度
// root = [3,9,20,null,null,15,7] => 2  root = [2,null,3,null,4,null,5,null,6] => 5
export const minDepth = root => {
  if (root == null) return 0

  let depth = 1 // 当前子树的深度，有1兜底 (根节点高度)

  if (root.left && root.right) {
    // 左右子树都存在
    depth += Math.min(minDepth(root.left), minDepth(root.right))
  } else if (root.left) {
    depth += minDepth(root.left)
  } else if (root.right) {
    depth += minDepth(root.right)
  } else {
    // 左右子树都不存在
    depth += 0
  }
  return depth // 返回整棵树的计算结果
}

export const maxDepth = root => {
  if (!root) return root
  let ret = 1
  function dfs(root, depth) {
    if (!root.left && !root.right) ret = Math.max(ret, depth)
    if (root.left) dfs(root.left, depth + 1)
    if (root.right) dfs(root.right, depth + 1)
  }
  dfs(root, ret)
  return ret
}
