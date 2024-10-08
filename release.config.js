/* eslint-disable no-undef */
module.exports = {
  branches: [
    {
      name: "master",
      prerelease: false,
    },
    {
      name: "rc/*",
      prerelease: true,
    },
  ],
  plugins: [
    // Analyze commits based on Conventional Commits
    "@semantic-release/commit-analyzer",

    // Generate release notes and changelog
    "@semantic-release/release-notes-generator",

    // Update CHANGELOG.md file with the release notes
    [
      "@semantic-release/changelog",
      {
        changelogFile: "docs/CHANGELOG.md",
      },
    ],

    // Update package.json with the new version
    [
      "@semantic-release/npm",
      {
        npmPublish: false, // Prevent npm publish if not needed
      },
    ],

    // Commit the updated files (changelog/*.md and package.json)
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "docs/CHANGELOG.md"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],

    // Create a new release and tag on GitHub
    "@semantic-release/github",
  ],
};
