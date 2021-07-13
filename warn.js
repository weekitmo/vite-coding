// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require("chalk")
const log = console.log

log(
  chalk.bgRed(
    "🔔 🔔 Don't use 'git commit', please use 'yarn commit' to generate a commit log & it will be auto generate a changelog！\n"
  ) + chalk.green("  If you are already using this command, please ignore it ")
)
