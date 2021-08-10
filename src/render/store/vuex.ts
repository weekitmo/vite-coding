import { createStore } from "vuex"

export default createStore({
  state: () => {
    return {
      count: 0
    }
  },
  mutations: {
    add(state, payload) {
      state.count = payload
    }
  },
  actions: {
    async update(ctx) {
      await delay()
      ctx.commit("add", {
        count: ctx.state.count + 1
      })
    }
  },
  modules: {}
})

async function delay(time = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("done"), time)
  })
}
