<template>
  <div class="page-wrapper m-auto">
    <NakedEye3d />
    <MergeWater />

    <div class="shadow-md rounded-xl bg-gray-300 py-4 w-60 m-auto mt-2">
      This is Vue count: {{ count }}
    </div>

    <div class="sizebox"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue"
import NakedEye3d from "@render/components/nakedeye3d.vue"
import MergeWater from "@render/components/vue/merge-water.vue"
export default defineComponent({
  name: "Home",
  inheritAttrs: false,
  components: {
    NakedEye3d,
    MergeWater
  },
  data() {
    return {
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
