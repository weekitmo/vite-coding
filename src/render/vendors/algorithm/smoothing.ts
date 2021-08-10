// 滤波算法

// 加权平均滤波
// N值的选取：流量，N=12；压力：N=4；液面，N=4~12；温度，N=1~4
export function useWeightSmoothing(n = 12, coefficient = 0.5) {
  const queue = []
  return function smoothing(value: number) {
    if (queue.length > n) {
      queue.shift()
    }

    queue.push(value)
    if (queue.length < n) return queue[queue.length - 1]
    // 权重逐个递减
    const result = queue.reduce(
      (prev, current) => coefficient * current + (1 - coefficient) * prev,
      0
    )
    return result
  }
}

// 滑动平均滤波法
export function useSmoothing(n = 12) {
  const queue = []
  return function smoothing(value: number) {
    if (queue.length > n) {
      queue.shift()
    }

    queue.push(value)
    if (queue.length < n) return queue[queue.length - 1]
    let result = queue.reduce((prev, current) => current + prev, 0)
    result /= queue.length
    return result
  }
}
