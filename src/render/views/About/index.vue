<template>
  <div class="bg h-screen w-screen py-2 px-2">
    <div class="inner bg-gray-100 h-full rounded-xl">
      <div class="title">{{ title }} {{ name }}</div>
      <div class="my-2">
        <n-button @click="back">返回</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

const title = ref("About")
const name = ref("weekit")
const router = useRouter()
const back = () => {
  router.back()
}
</script>

<style scoped lang="scss">
div.bg {
  .title {
    color: red;
  }
}
</style>
