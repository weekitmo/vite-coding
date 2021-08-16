import createShell from "./create-shell"
export const runElectron = () => {
  createShell(
    "cross-env NODE_ENV=development electron ./dist/main/index.js"
  ).on("exit", code => {
    if (code === 100) runElectron()
    // 使用kill而不是exit，不然会导致子进程无法全部退出
    if (code === 0) process.kill(0)
  })
}
export const runViteAndTsc = () =>
  new Promise<void>(reslove => {
    createShell("npx vite && tsc -w").stdout.on("data", buffer => {
      console.log(buffer.toString())
      if (buffer.toString().includes("Watching for file changes")) {
        reslove()
      }
    })
  })

export const runBuild = () =>
  new Promise<void>(reslove => {
    createShell(
      "tsc src/main/index.ts --moduleResolution Node --removeComments -t ES5 --outDir dist/main && vue-tsc --noEmit && vite build"
    ).stdout.on("end", buffer => {
      reslove()
    })
  })

runViteAndTsc().then(runElectron)
