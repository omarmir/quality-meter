# Reports Overview

This page is the stable index for the report system. It is intentionally not generated from benchmark output.

## Command Pattern

All public report entrypoints use the same form:

```bash
bun run report:<name> [--write-json|--use-cache] [--write-md]
```

Supported report names:

- `main`
- `hard-negative`
- `adaptive`
- `scoring-improvement`
- `low-latency`
- `wording-exp`
- `model-bakeoff`

Shared flags:

- `--write-json`: rerun the benchmark and overwrite its JSON artifact
- `--use-cache`: read the existing JSON artifact instead of rerunning the benchmark
- `--write-md`: rewrite the matching VitePress markdown page

`--write-json` and `--use-cache` are mutually exclusive.

If neither is provided, the command defaults to cache-backed output.

## Common Commands

Refresh a report from a fresh benchmark run and rewrite its markdown page:

```bash
bun run report:main --write-json --write-md
```

Regenerate a report page from an existing JSON artifact:

```bash
bun run report:main --use-cache --write-md
```

Print the cached console summary without rewriting anything:

```bash
bun run report:main --use-cache
```

## Report Pages

- [Main Benchmark](/guide/main-benchmark)
- [Hard Negative Benchmark](/guide/hard-negative-benchmark)
- [Adaptive Refinement](/guide/adaptive-refinement)
- [Scoring Improvement](/guide/scoring-improvement)
- [Low-Latency Improvement](/guide/low-latency-improvement)
- [Wording Experiments](/guide/wording-experiments)
- [Model Bakeoff](/guide/model-bakeoff)

## JSON Artifacts

- [tools/reports/benchmark-results.json](/home/omar/Code/quality-meter/tools/reports/benchmark-results.json)
- [tools/reports/hard-negative-results.json](/home/omar/Code/quality-meter/tools/reports/hard-negative-results.json)
- [tools/reports/adaptive-refinement-results.json](/home/omar/Code/quality-meter/tools/reports/adaptive-refinement-results.json)
- [tools/reports/low-latency-iterations.json](/home/omar/Code/quality-meter/tools/reports/low-latency-iterations.json)
- [tools/reports/wording-experiments.json](/home/omar/Code/quality-meter/tools/reports/wording-experiments.json)
- [tools/reports/scoring-improvement.json](/home/omar/Code/quality-meter/tools/reports/scoring-improvement.json)
- [tools/reports/model-bakeoff.json](/home/omar/Code/quality-meter/tools/reports/model-bakeoff.json)

## Source Files

- [tools/scripts/run-report.ts](/home/omar/Code/quality-meter/tools/scripts/run-report.ts): public dispatcher for every report command
- [tools/benchmark/cases.ts](/home/omar/Code/quality-meter/tools/benchmark/cases.ts): handwritten 300-case main corpus
- [tools/benchmark/hard-negatives.ts](/home/omar/Code/quality-meter/tools/benchmark/hard-negatives.ts): synthetic hard-negative generation

## Typical Workflow

If you changed the shipped scorer and want fresh main benchmark numbers plus the markdown page:

```bash
bun run report:main --write-json --write-md
```

If you changed hard-negative generation or weak-answer handling:

```bash
bun run report:hard-negative --write-json --write-md
```

If you changed adaptive refinement, low-latency logic, or wording prompts:

```bash
bun run report:adaptive --write-json --write-md
bun run report:low-latency --write-json --write-md
bun run report:wording-exp --write-json --write-md
bun run report:scoring-improvement --use-cache --write-md
```

If you only changed report templates and want to regenerate pages from existing JSON:

```bash
bun run report:main --use-cache --write-md
bun run report:hard-negative --use-cache --write-md
bun run report:adaptive --use-cache --write-md
bun run report:low-latency --use-cache --write-md
bun run report:wording-exp --use-cache --write-md
bun run report:scoring-improvement --use-cache --write-md
```

If you want to rebuild the docs site afterward:

```bash
bun run docs:build
```

## Notes

- This page is static by design and should not be rewritten by benchmark scripts.
- Individual report pages are generated from JSON artifacts.
- The lower-level benchmark scripts remain implementation details and are not the public documentation surface.
