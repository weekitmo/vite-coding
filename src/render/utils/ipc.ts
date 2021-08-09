import { ipcRenderer } from "electron"
import { onMounted, onBeforeUnmount } from "@vue/runtime-core"
export enum EVENT_MAIN_MAP {
  asynchronousMessage = `asynchronous-message`,
  synchronousMessage = `synchronous-message`
}
export enum EVENT_REPLY_MAP {
  asynchronousReply = `asynchronous-reply`,
  synchronousReply = `synchronous-reply`
}

export function useSyncIpcRenderer(name: EVENT_MAIN_MAP, params) {
  return ipcRenderer.sendSync(name, params)
}

export function useAsyncIpcRenderer(
  name: EVENT_REPLY_MAP,
  callback: (event: Electron.IpcRendererEvent, arg: any) => void
) {
  const listenable = () => {
    console.log(name)
    ipcRenderer.on(name, callback)
  }

  onMounted(() => {
    listenable()
  })

  onBeforeUnmount(() => {
    ipcRenderer.off(name, callback)
  })

  const send = (sendName: EVENT_MAIN_MAP, value) => {
    console.log(sendName, value)
    ipcRenderer.send(sendName, value)
  }

  return {
    listenable,
    send
  }
}
