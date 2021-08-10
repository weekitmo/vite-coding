/* eslint-disable @typescript-eslint/no-empty-function */
// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING"
const FULLFILLED = "FULLFILLED"
const REJECTED = "REJECTED"

type ResolveOrRejectFunc = (v: any) => any

// eslint-disable-next-line @typescript-eslint/ban-types
const mockMicroTask = (callback: () => void) => {
  if (setImmediate) {
    setImmediate(callback)
  } else {
    setTimeout(callback, 0)
  }
}
class MiniPromise {
  status = ""
  value
  reason
  onResolvedCallbacks
  onRejectedCallbacks

  constructor(executor) {
    // default status is pending
    this.status = PENDING
    // will return value
    this.value = undefined
    // error reason
    this.reason = undefined
    // 成功的回调
    this.onResolvedCallbacks = []
    // 失败的回调
    this.onRejectedCallbacks = []

    // resolve fullfill
    let resolve = value => {
      if (value instanceof MiniPromise) {
        // 递归解析
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.status = FULLFILLED
        this.value = value

        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    // reject
    let reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason

        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      // reason = error
      reject(error)
    }
  }

  // then reject is optional
  then(
    onFulfilled?: ResolveOrRejectFunc | undefined,
    onRejected?: ResolveOrRejectFunc | undefined
  ) {
    if (!onFulfilled) {
      onFulfilled = v => v
    }
    // 不传值也应该抛出错误供catch 捕获
    if (!onRejected) {
      onRejected = err => {
        throw err
      }
    }

    // 每次调用返回一个新的promise
    const promiseNext = new MiniPromise((resolve, reject) => {
      if (this.status === FULLFILLED) {
        // 模拟微任务
        mockMicroTask(() => {
          try {
            let returnValue = onFulfilled(this.value)
            // returnValue可能是一个proimise
            promiseParser(promiseNext, returnValue, resolve, reject)
          } catch (e) {
            //Promise/A+ 2.2.7.2
            reject(e)
          }
        })
      }
      if (this.status === REJECTED) {
        //Promise/A+ 2.2.3
        mockMicroTask(() => {
          try {
            let returnValue = onRejected(this.reason)
            promiseParser(promiseNext, returnValue, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          mockMicroTask(() => {
            try {
              let returnValue = onFulfilled(this.value)
              promiseParser(promiseNext, returnValue, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })

        this.onRejectedCallbacks.push(() => {
          mockMicroTask(() => {
            try {
              let returnValue = onRejected(this.reason)
              promiseParser(promiseNext, returnValue, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })

    return promiseNext
  }

  static resolve(data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new MiniPromise((resolve, _) => {
      resolve(data)
    })
  }

  static reject(reason) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new MiniPromise((_, reject) => {
      reject(reason)
    })
  }

  catch(errCallback) {
    return this.then(null, errCallback)
  }

  finally(callback) {
    return this.then(
      value => {
        return MiniPromise.resolve(callback()).then(() => value)
      },
      reason => {
        return MiniPromise.resolve(callback()).then(() => {
          throw reason
        })
      }
    )
  }

  static all(values: any[]) {
    return new MiniPromise((resolve, reject) => {
      const resultArr = []
      let orderIndex = 0
      const processResultByKey = (value, index) => {
        resultArr[index] = value
        if (++orderIndex === values.length) {
          resolve(resultArr)
        }
      }
      for (let i = 0; i < values.length; i++) {
        let value = values[i]
        if (value && typeof value.then === "function") {
          value.then(value => {
            processResultByKey(value, i)
          }, reject)
        } else {
          processResultByKey(value, i)
        }
      }
    })
  }

  static race(promises: MiniPromise[]) {
    return new MiniPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let val = promises[i]
        if (val && typeof val.then === "function") {
          val.then(resolve, reject)
        } else {
          // 普通值
          resolve(val)
        }
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abort = (v?: any) => {}

  wrap(promise) {
    let abort
    let createPromise = new MiniPromise((resolve, reject) => {
      // 什么也不返还，利用赛跑机制
      abort = reject
    })
    let p = MiniPromise.race([promise, createPromise]) // 任何一个先成功或者失败 就可以获取到结果
    p.abort = abort
    return p
  }
}

// {}
const promiseParser = (promiseNext, returnValue, resolve, reject) => {
  if (promiseNext === returnValue) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    )
  }

  let called = false
  if (
    (typeof returnValue === "object" && returnValue != null) ||
    typeof returnValue === "function"
  ) {
    try {
      // 为了判断 resolve 过的就不用再 reject 了
      let then = (<MiniPromise>returnValue).then
      if (typeof then === "function") {
        // 不要写成 returnValue.then
        then.call(
          returnValue,
          resolveValue => {
            // 根据 promise 的状态决定是成功还是失败
            if (called) return
            called = true
            // 递归解析的过程可能 promise 中还有 promise
            promiseParser(promiseNext, resolveValue, resolve, reject)
          },
          rejectValue => {
            // 只要失败就失败
            if (called) return
            called = true
            reject(rejectValue)
          }
        )
      } else {
        // 如果 returnValue.then 是个普通值就直接返回
        resolve(returnValue)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // 如果 returnValue 是个普通值就直接返回
    resolve(returnValue)
  }
}

/*** use test */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
new MiniPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功")
  }, 1000)
  console.log(`sync step log`)
})
  .then()
  .then(
    data => {
      console.log("success", data)
    },
    err => {
      console.log("faild", err)
    }
  )
