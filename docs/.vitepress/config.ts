import tailwindcss from "@tailwindcss/vite"
import type { PluginOption } from "vite"
import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Quality Meter",
  description:
    "A typescript library to rate the quality of responses using a small encoder only AI model",
  vite: {
    plugins: [tailwindcss() as unknown as PluginOption],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Example", link: "/guide/example" },
      { text: "Guide", link: "/guide/" },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "What Is This?", link: "/guide/what-is-this" },
          { text: "API", link: "/guide/api" },
          { text: "Authoring", link: "/guide/authoring" },
          { text: "Known Limitations", link: "/guide/known-limitations" },
          { text: "Example", link: "/guide/example" },
        ],
      },
      {
        text: "Reports",
        items: [
          { text: "Reports Overview", link: "/guide/reports-overview" },
          { text: "Main Benchmark", link: "/guide/main-benchmark" },
          {
            text: "Hard Negative Benchmark",
            link: "/guide/hard-negative-benchmark",
          },
          {
            text: "Adaptive Refinement",
            link: "/guide/adaptive-refinement",
          },
          {
            text: "Scoring Improvement",
            link: "/guide/scoring-improvement",
          },
          {
            text: "Low-Latency Improvement",
            link: "/guide/low-latency-improvement",
          },
          { text: "Wording Experiments", link: "/guide/wording-experiments" },
          { text: "Model Bakeoff", link: "/guide/model-bakeoff" },
        ],
      },
      {
        text: "Next Steps",
        items: [{ text: "French Scoring", link: "/guide/french-scoring" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/omarmir/quality-meter" },
    ],
  },
})
