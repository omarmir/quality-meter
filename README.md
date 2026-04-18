# Quality Meter

Quality Meter is a monorepo for a rubric-based response scoring library and its documentation.

[Example and Live documentation](https://omarmir.github.io/quality-meter/)

## Contents

- `library/`: the `@browser-quality-scorer/core` package
- `docs/`: the VitePress documentation site
- `tools/`: benchmark corpora, scripts, and generated reports

## Development

Install dependencies:

```bash
bun install
```

Run the docs site:

```bash
bun run docs:dev
```

Build the docs site:

```bash
bun run docs:build
```

Run benchmark tooling:

```bash
bun run report:main --write-json --write-md
bun run report:hard-negative --write-json --write-md
bun run report:model-bakeoff --write-json --write-md
bun run report:french-scoring --write-json --write-md
```

## Package

The published package surface lives under `library/` and exports:

- `@browser-quality-scorer/core`
- `@browser-quality-scorer/core/worker-runtime`

For GitHub-based installs without npmjs publishing, stable package snapshots are published to:

- branch: `package-release`
- pinned tags: `pkg-vX.Y.Z`

See [library/README.md](./library/README.md) and the docs site under `docs/` for usage details.
