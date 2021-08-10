/*

示例 1：

输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
示例 2：

输入：nums = [1]
输出：1
示例 3：

输入：nums = [0]
输出：0

*/
// 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
// 1、如果dp[i - 1] < 0，也就是当前遍历到nums的i，之前的最大子序和是负数，那么我们就没必要继续加它了，
//    因为dp[i] = dp[i - 1] + nums[i] 会比nums[i]更小，所以此时还不如dp[i] = nums[i]，就是目前遍历到i的最大子序和呢
// 2、同理dp[i - 1] > 0，说明nums[i]值得去加dp[i - 1]，此时回避nums[i]更大
export const maxSubArray = function (nums) {
  let res = nums[0]
  const dp = [nums[0]]
  for (let i = 1; i < nums.length; i++) {
    if (dp[i - 1] > 0) {
      dp[i] = nums[i] + dp[i - 1]
    } else {
      dp[i] = nums[i]
    }

    res = Math.max(dp[i], res)
  }
  return res
}
