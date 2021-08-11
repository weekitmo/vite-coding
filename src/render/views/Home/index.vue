<template>
  <div class="page-wrapper m-auto">
    <NakedEye3d />
    <MergeWater />
    <n-message-provider>
      <n-dialog-provider>
        <HelloWorld />
      </n-dialog-provider>
    </n-message-provider>

    <div class="shadow-md rounded-xl bg-gray-300 py-4 w-60 m-auto mt-2">
      This is Vue count: {{ count }}
    </div>
    <react
      :component="rComponent"
      :message="message"
      :reset="onCallback"
    ></react>
    <div class="sizebox"></div>
  </div>
</template>

<script>
import HelloWorld from "@render/components/vue/sfc.vue"
import ReactFc from "@render/components/react/sfc.tsx"
import { ReactWrapper } from "@render/vendors/mixin-lib/index"
// import { defineAsyncComponent } from "vue"
// const NakedEye3d = defineAsyncComponent(() =>
//   import("@render/components/3d-NakedEye3d.vue")
// )
import { defineComponent } from "vue"
import NakedEye3d from "@render/components/nakedeye3d.vue"
import MergeWater from "@render/components/vue/merge-water.vue"
export default defineComponent({
  name: "Home",
  inheritAttrs: false,
  components: {
    HelloWorld,
    react: ReactWrapper,
    NakedEye3d,
    MergeWater
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
  },
  activated() {
    console.log(`home activated`, this.count)
  },
  beforeUnmount() {
    console.log(`home beforeUnmount`, this.count)
  }
})
</script>
