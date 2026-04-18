import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'library/src/index.ts',
    'worker-runtime': 'library/src/worker-runtime.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: false,
  target: 'es2022',
  external: ['@huggingface/transformers'],
  outDir: 'library/dist',
  tsconfig: 'library/tsconfig.build.json',
})
