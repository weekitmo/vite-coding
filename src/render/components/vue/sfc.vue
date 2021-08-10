<template>
  <div class="mx-1 md:rounded-none my-1">
    <n-space>
      <n-button @click="handleConfirm">警告</n-button>
      <n-button @click="handleSuccess">成功</n-button>
      <n-button @click="handleError">错误</n-button>
      <n-button @click="ipcSync">ipc同步通信</n-button>
      <n-button @click="ipcAsync">ipc异步通信</n-button>
      <n-button @click="toAbout">关于页面</n-button>
      <n-button @click="openNewWindow">新开window</n-button>
    </n-space>
  </div>
  <figure class="md:flex bg-gray-100 rounded-xl p-8 md:p-0 mb-2">
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

  <n-space class="my-2 mx-2">
    <n-button>Default</n-button>
    <n-button type="primary">Primary</n-button>
    <n-button type="info">Info</n-button>
    <n-button type="success">Success</n-button>
    <n-button type="warning">Warning</n-button>
    <n-button type="error">Error</n-button>
  </n-space>

  <div class="show-date-picker w-40 my-2 mx-2">
    <n-date-picker v-model:value="timestamp" type="datetime" clearable />
    <pre>{{ timestamp && JSON.stringify(timestamp) }}</pre>
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
import {
  EVENT_MAIN_MAP,
  EVENT_REPLY_MAP,
  useSyncIpcRenderer,
  useSendIpcRenderer,
  useAsyncIpcRenderer
} from "@render/utils/ipc"
import { useRouter } from "vue-router"

export default defineComponent({
  name: "HelloWorld",

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
    const channelCallback = (event: Electron.IpcRendererEvent, arg) => {
      console.log(arg)
    }
    const { send } = useAsyncIpcRenderer(
      EVENT_REPLY_MAP.asynchronousReply,
      channelCallback
    )

    const ipcSync = () => {
      const v = useSyncIpcRenderer(
        EVENT_MAIN_MAP.synchronousMessage,
        currentHex.value
      )
      console.log(`[RENDER]: `, v)
    }
    const ipcAsync = () => {
      send(EVENT_MAIN_MAP.asynchronousMessage, currentHex.value)
    }
    onMounted(() => {
      colorpicker.value = new ColorPickerTool({
        id: "canvas",
        callback: onPickerCallback,
        canvasWidth: 500,
        canvasHeight: 500,
        imageURL:
          "https://i0.hdslb.com/bfs/feed-admin/0baa8ed60a2b0d1726a1b8d5f0af32130eae30e3.jpg@880w_388h_1c_95q"
      })
    })
    const message = useMessage()
    const dialog = useDialog()
    const router = useRouter()
    return {
      toAbout() {
        router.push({ name: "About" })
      },
      openNewWindow() {
        useSendIpcRenderer(EVENT_MAIN_MAP.openWindow, {
          router: "about",
          width: 400,
          height: 400,
          resizable: false
        })
      },
      handleConfirm() {
        dialog.warning({
          title: "提示",
          content: "此操作将永久删除该文件, 是否继续?",
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            message.success("确定")
          },
          onNegativeClick: () => {
            message.info("取消")
          }
        })
      },
      handleSuccess() {
        dialog.success({
          title: "恭喜",
          content: "恭喜你，这是一条成功消息",
          positiveText: "谢谢",
          onPositiveClick: () => {
            message.success("确定")
          }
        })
      },
      handleError() {
        dialog.error({
          title: "提示",
          content: "错了哦，这是一条错误消息",
          positiveText: "知道了",
          showIcon: false,
          onPositiveClick: () => {
            message.success("知道了")
          }
        })
      },
      count,
      useScriptSetup,
      useTsPlugin,
      currentHex,
      timestamp,
      ipcSync,
      ipcAsync
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
