import { spawn, StdioOptions } from "child_process"
export default function createShell(command, stdio: StdioOptions = "pipe") {
  return spawn(command, {
    stdio,
    shell: true
  })
}
