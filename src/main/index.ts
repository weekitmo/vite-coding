/**
 * electron 主文件
 */
import "@src/common/patch"
import { join } from "path"
import { app, BrowserWindow, ipcMain, remote } from "electron"
import { EVENT_MAIN_MAP, EVENT_REPLY_MAP } from "../render/utils/ipc"
import dotenv from "dotenv"
import createProtocol from "./createProtocol"
import { createUrl } from "./helper"
// remove csp warning
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
dotenv.config({ path: join(__dirname, "../../.env") })

interface NewWindow {
  router: string
  width: number
  height: number
  resizable: boolean
}

let win: BrowserWindow

ipcMain.on(EVENT_MAIN_MAP.asynchronousMessage, (event, arg) => {
  console.log(`[MAIN-IPC]`, arg) // prints "ping"
  event.sender.send(EVENT_REPLY_MAP.asynchronousReply, "pong")
})

ipcMain.on(EVENT_MAIN_MAP.synchronousMessage, (event, arg) => {
  console.log(`[MAIN-IPC]`, arg) // prints "ping"
  event.returnValue = "synchronous-pong"
})
ipcMain.on(EVENT_MAIN_MAP.openWindow, (event, arg: NewWindow) => {
  console.log(`[MAIN-IPC]`, arg)
  openNewWindow(arg)
})

// 创建一个 BrowserWindow 对象，打开一个新的窗口
function openNewWindow(arg: NewWindow) {
  const winUrl = createUrl(app.isPackaged, arg.router)
  console.log(winUrl)

  let child = new BrowserWindow({
    width: arg.width,
    height: arg.height,
    resizable: arg.resizable ?? false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  child.on("resize", updateReply)
  child.on("move", updateReply)
  child.once("close", function () {
    console.log("child close")
    // win.webContents.send(EVENT_REPLY_MAP.openWindowClose, child.id)
    child = null
    win.setEnabled(true)
  })

  child.once("ready-to-show", () => {
    child.show()
    // win.webContents.send(EVENT_REPLY_MAP.openWindowSuccess, child.id)
  })

  child.loadURL(winUrl)

  function updateReply() {
    console.log(`updateReply`, {
      id: child.id,
      size: child.getSize(),
      position: child.getPosition()
    })
    win.webContents.send(EVENT_REPLY_MAP.windowUpdate, {
      id: child.id,
      size: child.getSize(),
      position: child.getPosition()
    })
  }
}

function createWin() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // enableRemoteModule保证renderer.js可以可以正常require('electron').remote
      enableRemoteModule: true,
      preload: join(__dirname, "../../src/preload/index.js")
    }
  })

  createProtocol("app")
  const URL = createUrl(app.isPackaged)

  if (!app.isPackaged) {
    win?.webContents.openDevTools()
  }

  win?.loadURL(URL)
}

app.whenReady().then(createWin)
