declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production"
    readonly PORT: string
  }
}

interface Window {
  webkitRequestAnimationFrame(cb: Function): number
  mozRequestAnimationFrame(cb: Function): number
  webkitCancelAnimationFrame(handle: number): void
  mozCancelAnimationFrame(handle: number): void
}
