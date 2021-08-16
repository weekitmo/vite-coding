const initTopDrag = () => {
  const topDiv = document.createElement("div")
  topDiv.style.position = "fixed"
  topDiv.style.top = "0"
  topDiv.style.left = "0"
  topDiv.style.height = "40px"
  topDiv.style.width = "100%"
  topDiv.style.zIndex = "9999"
  topDiv.style.pointerEvents = "none"
  // @ts-ignore: Unreachable code error
  topDiv.style["-webkit-user-select"] = "none" // 禁止选择文字
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unreachable code error
  topDiv.style["-webkit-app-region"] = "drag"
  document.body.appendChild(topDiv)
}

window.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
  initTopDrag()
})

export {}
