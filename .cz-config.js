/// https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js
module.exports = {
  types: [
    {
      value: ":construction: WIP",
      name: "💪 WIP: Work in progress"
    },
    {
      value: ":sparkles: feat",
      name: "✨ Feat: A new feature"
    },
    {
      value: ":bug: fix",
      name: "🐛 Fix: A bug fix"
    },
    {
      value: ":hammer: refactor",
      name: "🔨 Refactor: A code change that neither fixes a bug nor adds a feature"
    },
    {
      value: ":pencil: docs",
      name: "📝 Docs: Documentation only changes"
    },
    {
      value: ":white_check_mark: test",
      name: "✅ Test: Add missing tests or correcting existing tests"
    },
    {
      value: ":thought_balloon: chore",
      name: "🗯 Chore: Change that don't modify src or test files. Such as updating build tasks, package manager"
    },
    {
      value: ":lipstick: ui",
      name: "💄 Update: Update the UI and style files."
    },
    {
      value: ":art: style",
      name: "🎨 Change: Change that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)"
    },
    {
      value: ":package: update(dependencies)",
      name: "📦 Update: Update compiled files or packages."
    },
    {
      value: ":green_heart: fix(ci)",
      name: "💚 Fix: Fix(CI) Build."
    },
    {
      value: ":truck: move",
      name: "🚚 Mv: Moving or renaming files."
    },
    {
      value: ":fire: prune",
      name: "🔥 Remove: Removing code or files."
    },
    {
      value: ":bookmark: release",
      name: "🔖 Release: Release Version tags."
    },
    {
      value: ":rocket: build(stable)",
      name: "🚀 Build: stable!"
    }
  ],

  scopes: [],

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"]
}
