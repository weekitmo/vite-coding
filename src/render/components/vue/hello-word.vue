<template>
  <h1>{{ msg }}</h1>

  <label>
    <input type="checkbox" v-model="useScriptSetup" />
    Use
    <code>&lt;script setup&gt;</code>
  </label>
  <n-space>
    <n-button @click="handleConfirm">警告</n-button>
    <n-button @click="handleSuccess">成功</n-button>
    <n-button @click="handleError">错误</n-button>
  </n-space>
  <figure class="md:flex bg-gray-100 rounded-xl p-8 md:p-0">
    <img
      class="w-32 h-32 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
      src="@render/assets/electron.png"
      alt=""
      width="384"
      height="512"
    />
    <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
      <blockquote>
        <p class="text-lg font-semibold">
          “Tailwind CSS is the only framework that I've seen scale on large
          teams. It’s easy to customize, adapts to any design, and the build
          size is tiny.”
        </p>
      </blockquote>
      <figcaption class="font-medium">
        <div class="text-cyan-600">Sarah Dayan</div>
        <div class="text-gray-500">Staff Engineer, Algolia</div>
      </figcaption>
    </div>
  </figure>

  <button @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code>
    to test hot module replacement.
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
  </p>

  <n-space>
    <n-button>Default</n-button>
    <n-button type="primary">Primary</n-button>
    <n-button type="info">Info</n-button>
    <n-button type="success">Success</n-button>
    <n-button type="warning">Warning</n-button>
    <n-button type="error">Error</n-button>
  </n-space>

  <div class="show-date-picker">
    <n-date-picker v-model:value="timestamp" type="date" clearable />
    <pre>{{ JSON.stringify(timestamp) }}</pre>
  </div>

  <div class="wrapper">
    <div class="show-hex">
      <div class="current" :style="{ 'background-color': currentHex }"></div>
      <div class="hex-text">{{ currentHex }}</div>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, Ref } from "vue"
import { ColorPickerTool } from "@render/vendors/image-color-picker/index"
import { useMessage, useDialog } from "naive-ui"

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup: () => {
    const count = ref(0)
    const useScriptSetup = ref(false)
    const useTsPlugin = ref(false)
    const colorpicker: Ref<ColorPickerTool> = ref(null)
    const currentHex = ref("#000000")
    const timestamp = ref(null)
    const onPickerCallback = hex => {
      console.log(hex)
      currentHex.value = hex
    }
    onMounted(() => {
      colorpicker.value = new ColorPickerTool({
        id: "canvas",
        callback: onPickerCallback,
        canvasWidth: 500,
        canvasHeight: 500,
        imageURL:
          "https://i0.hdslb.com/bfs/sycp/creative_img/202107/3497baf2c79cd6f0529d5c99acdf3eda.jpg@880w_388h_1c_95q"
      })
    })
    const message = useMessage()
    const dialog = useDialog()
    return {
      handleConfirm() {
        dialog.warning({
          title: "警告",
          content: "你确定？",
          positiveText: "确定",
          negativeText: "不确定",
          onPositiveClick: () => {
            message.success("确定")
          },
          onNegativeClick: () => {
            message.error("不确定")
          }
        })
      },
      handleSuccess() {
        dialog.success({
          title: "成功",
          content: "厉害",
          positiveText: "哇",
          onPositiveClick: () => {
            message.success("耶！")
          }
        })
      },
      handleError() {
        dialog.error({
          title: "错误",
          content: "拿来吧你~",
          positiveText: "知道了",
          onPositiveClick: () => {
            message.success("我就知道")
          }
        })
      },
      count,
      useScriptSetup,
      useTsPlugin,
      currentHex,
      timestamp
    }
  }
})
</script>

<style scoped lang="scss">
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

#canvas {
  /* pointer-events: none; */
  cursor: none;
  border: 1px solid #979797;
  width: 500px;
  height: 500px;
  margin-left: 50px;
  border-radius: 16px;
}

.show-hex {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  .current {
    width: 60px;
    height: 60px;
    border-radius: 6px;
  }
  .hex-text {
    color: #979797;
    font-size: 14px;
    margin-left: 10px;
  }
}
</style>
