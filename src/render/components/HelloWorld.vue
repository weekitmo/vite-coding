<template>
  <h1>{{ msg }}</h1>

  <label>
    <input type="checkbox" v-model="useScriptSetup" />
    Use
    <code>&lt;script setup&gt;</code>
  </label>
  <label>
    <input type="checkbox" v-model="useTsPlugin" />
    Provide types for
    <code>*.vue</code>
    imports
  </label>

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
          "https://and-static.ghzs.com/image/game/gallery/2021/06/23/60d2f7cd2fbaa5687f33fa51.png"
      })
    })
    return { count, useScriptSetup, useTsPlugin, currentHex, timestamp }
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
