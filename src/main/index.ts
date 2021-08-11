/**
 * electron 主文件
 */
import "@src/common/patch"
import { join } from "path"
import { app, BrowserWindow, ipcMain, powerMonitor } from "electron"
import { EVENT_MAIN_MAP, EVENT_REPLY_MAP } from "../render/utils/ipc"
import dotenv from "dotenv"
import createProtocol from "./createProtocol"
import { createUrl } from "./helper"
import { MainEnv } from "./env"
import { initTray } from "./tray"
MainEnv.isDev = app.isPackaged
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

let openedBrowserMap = new Map()

// 创建一个 BrowserWindow 对象，打开一个新的窗口
function openNewWindow(arg: NewWindow) {
  const winUrl = createUrl(app.isPackaged, arg.router)
  console.log(winUrl)

  let child = new BrowserWindow({
    width: arg.width,
    height: arg.height,
    resizable: arg.resizable ?? false,
    show: false,
    parent: win,
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  child.on("resize", updateReply)
  child.on("move", updateReply)
  child.once("close", function () {
    console.log("child close")
    win.webContents.send(EVENT_REPLY_MAP.openWindowClose, child.id)

    openedBrowserMap.delete(child.id)
    child = null
  })

  child.once("ready-to-show", () => {
    child.show()
    openedBrowserMap.set(child.id, child)
    win.webContents.send(EVENT_REPLY_MAP.openWindowSuccess, child.id)
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
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      // enableRemoteModule保证renderer.js可以可以正常require('electron').remote
      enableRemoteModule: true,
      preload: join(__dirname, "../../src/preload/index.js")
    },
    // only in window(win32)
    icon: join(__dirname, "assets/dock.png")
  })

  createProtocol("app")
  const URL = createUrl(app.isPackaged)

  if (!app.isPackaged) {
    win?.webContents.openDevTools()
  }

  win.on("ready-to-show", () => {
    win.show()
    // if (process.platform === "darwin") {
    //   app.dock.setIcon(join(__dirname, "assets/dock.png"))
    // }
    console.log(`win ready-to-show`, process.platform)
  })

  win?.loadURL(URL)

  win?.on("blur", () => {
    // app.dock.bounce(); // mac dock 弹跳
    const badgeString = app.dock.getBadge()
    if (badgeString === "") {
      app.dock.setBadge("1")
    } else {
      app.dock.setBadge((parseInt(badgeString) + 1).toString())
    }
  })
}

app.whenReady().then(() => {
  createWin()

  const tray = initTray()
  // // 系统挂起
  // powerMonitor.on("suspend", () => {
  //   tray.send({
  //     type: "stop"
  //   })
  // })
  // // 系统恢复
  // powerMonitor.on("resume", () => {
  //   tray.send({
  //     type: "run"
  //   })
  // })
})
app.on("window-all-closed", () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== "darwin") {
    app.quit()
  }
})
// only on macos
app.on("activate", (event, hasVisibleWindows: boolean) => {
  console.log("activate", hasVisibleWindows)
})
