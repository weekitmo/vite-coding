interface TreeNode {
  val: any
  left: TreeNode | null
  right: TreeNode | null
}

class TreeNodeCtor implements TreeNode {
  left: TreeNode | null = null
  right: TreeNode | null = null
  constructor(public val: any) {}
}
//二叉树
function BinaryTree() {
  //根节点
  let root = null

  //新增节点
  const insertNode = function (node: TreeNode, newNode: TreeNode) {
    //约定右孩子都大于左孩子节点
    if (newNode.val < node.val) {
      if (node.left === null) {
        //没有左孩子，则新增左孩子
        node.left = newNode
      } else {
        //如果有左孩子则递归算法实现插入左孩子节点
        insertNode(node.left, newNode)
      }
    } else {
      //如果有孩子为null，则新增右孩子
      if (node.right === null) {
        node.right = newNode
      } else {
        //如果有左孩子则递归算法实现插入右孩子节点
        insertNode(node.right, newNode)
      }
    }
  }
  // 插入新节点
  this.insert = function (val: any) {
    //创建节点
    let node = new TreeNodeCtor(val)
    if (root === null) {
      //判断是否为根节点
      root = node
    } else {
      // 不是根节点则新增节点
      insertNode(root, node)
    }
  }
}
//构建二叉树
const nodes = [6, 2, 3, 4, 9, 8, 7, 12, 1, 22]
const binaryTree = new BinaryTree()
nodes.forEach(v => {
  binaryTree.insert(v)
})
