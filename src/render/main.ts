// https://tailwindcss.com/docs
import "@src/common/patch"
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store/vuex"

import "./index.css"
// tailwind prebuild by postcss
import "./tailwind.entry.css"

import {
  // create naive ui
  create,
  NButton,
  NDatePicker,
  NDialogProvider,
  NMessageProvider,
  NSpace
} from "naive-ui"

const naive = create({
  components: [NButton, NDatePicker, NSpace, NDialogProvider, NMessageProvider]
})

const app = createApp(App)
app.use(router)
app.use(store)
app.use(naive)
// Note: on Server Side, you need to manually push the initial location
router.isReady().then(() => app.mount("#app"))
// app.mount("#app")
