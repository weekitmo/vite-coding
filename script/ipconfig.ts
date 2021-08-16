import { networkInterfaces } from "os"

export function getIpAddress() {
  const networks = networkInterfaces()
  for (let localNet in networkInterfaces()) {
    const iface = networks[localNet]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}
