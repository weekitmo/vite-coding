<template>
  <Preview />
  <n-message-provider>
    <n-dialog-provider>
      <HelloWorld />
    </n-dialog-provider>
  </n-message-provider>

  <div class="shadow-md rounded-xl bg-gray-300 py-4 w-60 m-auto mt-2">
    This is Vue count: {{ count }}
  </div>
  <react :component="rComponent" :message="message" :reset="onCallback"></react>
  <div class="sizebox"></div>
</template>

<script>
import HelloWorld from "./components/vue/hello-word.vue"
import ReactFc from "./components/react/sfc.tsx"
import { ReactWrapper } from "./vendors/mixin-lib/index"
// import { defineAsyncComponent } from "vue"
// const Preview = defineAsyncComponent(() =>
//   import("@render/components/3d-preview.vue")
// )
import Preview from "@render/components/3d-preview.vue"
export default {
  name: "App",
  components: {
    HelloWorld,
    react: ReactWrapper,
    Preview
  },
  data() {
    return {
      rComponent: ReactFc,
      message: ``,
      baseMessage: `vue component use react`,
      count: 0
    }
  },
  created() {
    this.message = this.baseMessage
  },
  methods: {
    onCallback() {
      console.log(`click ${this.message}`)
      this.count++
      this.message = this.baseMessage + this.count
    }
  }
}
</script>

<style>
.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}
.sizebox {
  padding: 10px;
}
</style>
