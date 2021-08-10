import { join } from "path"

export function createUrl(env, router = "") {
  const URL = env
    ? `app://${join(
        __dirname,
        `
    ../render/index.html#/${router}`
      )}` // vite 构建后的静态文件地址
    : `http://localhost:${process.env.PORT}/#/${router}` // vite 启动的服务器地址

  return URL
}
