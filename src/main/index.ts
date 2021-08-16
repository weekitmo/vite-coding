import { join } from "path"
import { app, BrowserWindow } from "electron"

import "./menu"
const isDev = process.env.NODE_ENV === "development"
console.log(process.env.NODE_ENV, isDev)
const WinURL = isDev
  ? `http://localhost:${process.env.PORT}`
  : "file://" + join(__dirname, "../../dist/render/index.html")

console.log(WinURL)

let mainWindow: BrowserWindow | null = null
let willQuitApp = false

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1140,
    minHeight: 700,
    width: 1240,
    height: 700,
    frame: false,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: false,
      webSecurity: true,
      nodeIntegration: true,
      preload: join(__dirname, "../preload/index.js")
    }
  })

  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }
  // and load the index.html of the app.

  mainWindow.loadURL(WinURL)
  console.log(`createWindow`)
  mainWindow.on("close", function (event) {
    if (!willQuitApp) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })
  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    mainWindow = null
  })
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show()
  })
}

app.whenReady().then(createWindow)

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (!mainWindow) {
    createWindow()
  } else {
    mainWindow.show()
  }
})
app.on("before-quit", () => (willQuitApp = true))
