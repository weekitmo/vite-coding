/**
 * electron 主文件
 */
import "@src/common/patch"
import { join } from "path"
import { app, BrowserWindow, ipcMain } from "electron"
import { EVENT_MAIN_MAP, EVENT_REPLY_MAP } from "../render/utils/ipc"
import dotenv from "dotenv"
// remove csp warning
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
dotenv.config({ path: join(__dirname, "../../.env") })

let win: BrowserWindow

ipcMain.on(EVENT_MAIN_MAP.asynchronousMessage, (event, arg) => {
  console.log(`[MAIN-IPC]`, arg) // prints "ping"
  event.sender.send(EVENT_REPLY_MAP.asynchronousReply, "pong")
})

ipcMain.on(EVENT_MAIN_MAP.synchronousMessage, (event, arg) => {
  console.log(`[MAIN-IPC]`, arg) // prints "ping"
  event.returnValue = "synchronous-pong"
})

function createWin() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, "../../src/preload/index.js")
    }
  })

  const URL = app.isPackaged
    ? `file://${join(__dirname, "../render/index.html")}` // vite 构建后的静态文件地址
    : `http://localhost:${process.env.PORT}` // vite 启动的服务器地址

  win?.loadURL(URL)

  win.webContents.openDevTools()
}

app.whenReady().then(createWin)
