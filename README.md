[Live documentation](https://omarmir.github.io/quality-meter/)

# Quality Meter

Quality Meter is a monorepo for a rubric-based response scoring library and its documentation.

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
bun run benchmark
bun run benchmark:hard-negative
bun run benchmark:adaptive
bun run benchmark:low-latency
bun run benchmark:model-bakeoff
bun run benchmark:wording
```

## Package

The published package surface lives under `library/` and exports:

- `@browser-quality-scorer/core`
- `@browser-quality-scorer/core/worker-runtime`

See [library/README.md](./library/README.md) and the docs site under `docs/` for usage details.
