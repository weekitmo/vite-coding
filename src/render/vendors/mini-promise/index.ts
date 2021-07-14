// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = "PENDING"
const FULLFILLED = "FULLFILLED"
const REJECTED = "REJECTED"

class MiniPromise {
  status = ""
  value
  reason
  constructor(executor) {
    // default status is pending
    this.status = PENDING
    // will return value
    this.value = undefined
    // error reason
    this.reason = undefined

    // resolve fullfill
    let resolve = value => {
      if (this.status === PENDING) {
        this.status = FULLFILLED
        this.value = value
      }
    }

    // reject
    let reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
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
  then(onFulfilled, onRejected?) {
    if (this.status === FULLFILLED) {
      onFulfilled(this.value)
    }

    if (this.status === REJECTED) {
      onRejected && onRejected(this.reason)
    }
  }
}

/*** use test */
const promise = new MiniPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功")
  }, 1000)
  console.log(`sync step log`)
}).then(
  data => {
    console.log("success", data)
  },
  err => {
    console.log("faild", err)
  }
)
