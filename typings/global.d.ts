declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production"
  }
}

interface Window {
  /** 关闭预加载动画 */
  removeLoading: () => void
  requestAnimFrame(cb: Function): number
  webkitRequestAnimationFrame(cb: Function): number
  mozRequestAnimationFrame(cb: Function): number
  webkitCancelAnimationFrame(handle: number): void
  mozCancelAnimationFrame(handle: number): void
}
