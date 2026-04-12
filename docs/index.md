---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Quality Meter"
  text: "Rate your narrative responses anywhere"
  tagline: Avoid the garbage in and garbage out
  actions:
    - theme: brand
      text: What is this?
      link: /guide/what-is-this
    - theme: alt
      text: Example
      link: /guide/example
    - theme: alt
      text: API Documentaton
      link: /guide/api
  image:
    src: /assets/fluent-color--gauge-32.svg
    alt: gauge

features:
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 14 14"><g fill="none" fill-rule="evenodd" clip-rule="evenodd"><path fill="#a8b1ff" d="M5.041.748a4.368 4.368 0 0 1 6.645 3.115a3.23 3.23 0 0 1 .208 6.118a4.906 4.906 0 0 0-9.776-.145a3.692 3.692 0 0 1 1.183-7.004A4.37 4.37 0 0 1 5.04.748Z"/><path fill="#c8abfa" d="M9.127 10.325a2.127 2.127 0 0 0-3.004-1.939l2.815 2.816a2.1 2.1 0 0 0 .19-.877Zm.485 2.516a3.627 3.627 0 1 0-5.225-5.032a3.627 3.627 0 0 0 5.225 5.032m-1.734-.578L5.062 9.447a2.127 2.127 0 0 0 2.816 2.816"/></g></svg>
    title: Private by default
    details: Scoring runs locally in the browser, so narrative responses do not need to leave the device.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#4f7cff" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m1 14.93V19h-2v-2.07A8.01 8.01 0 0 1 5.07 13H7v-2H5.07A8.01 8.01 0 0 1 11 5.07V7h2V5.07A8.01 8.01 0 0 1 18.93 11H17v2h1.93A8.01 8.01 0 0 1 13 16.93"/><circle cx="12" cy="12" r="3.5" fill="#8fb2ff"/></svg>
    title: No inference bill
    details: Real-time scoring on narrative text is expensive at API scale. Running locally removes per-request inference cost.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64"><path fill="#fbb11c" d="M43.4.159L12.06 28.492l24.31 7.538L18.12 64l35.26-33.426l-18.978-8.464z"/></svg>
    title: Immediate feedback
    details: Users get feedback in real time, similar to a password strength meter.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><path fill="#546e7a" d="M4 28V8c0-2.2 1.8-4 4-4h28c2.2 0 4 1.8 4 4v20c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4"/><path fill="#bbdefb" d="M36 7H8c-.6 0-1 .4-1 1v20c0 .6.4 1 1 1h28c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1"/><path fill="#37474f" d="M38 33H6c-2.2 0-4-1.8-4-4h40c0 2.2-1.8 4-4 4"/><path fill="#e38939" d="M24 40V16c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4H28c-2.2 0-4-1.8-4-4"/><path fill="#fff3e0" d="M40 15H28c-.6 0-1 .4-1 1v22c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V16c0-.6-.4-1-1-1"/><circle cx="34" cy="41.5" r="1.5" fill="#a6642a"/></svg>
    title: Small, portable model
    details: The bundled model is light enough to run in the browser, on edge infrastructure, or in server-side environments.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#58c27d" d="M4 19h16v2H4zm1-3h3v2H5zm0-4h6v2H5zm0-4h10v2H5zm12 8h2v2h-2zm-3-4h5v2h-5zm2-4h3v2h-3z"/></svg>
    title: Criterion-level breakdown
    details: Go beyond one number with per-criterion scoring that shows which parts of the answer are supported or missing.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#7b9cff" d="M4 18c2.5-5.5 5.8-8.2 10-8c2.4.1 4.3 1.1 6 3V9l4 5l-4 5v-3c-1.5-1.5-3.1-2.2-5-2.3c-3.2-.1-5.9 2-8.5 6.3z"/></svg>
    title: Adaptive scoring
    details: Start with a quick pass, then spend more work only when the answer looks ambiguous.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#f08c5a" d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7m0 4a3 3 0 1 0 3 3a3 3 0 0 0-3-3"/><path fill="#ffd1b8" d="M11 8h2v5h-2zm0 6h2v2h-2z"/></svg>
    title: Constraint-aware scoring
    details: Penalize answers that ignore explicit requirements like budget, time, or stated limits.
  - icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#8c7cf0" d="M4 5h16v3H4zm2 5h12v3H6zm-2 5h16v3H4z"/><path fill="#c6bafc" d="M18 4h2v15h-2zm-7 0h2v15h-2z"/></svg>
    title: Works with your rubric
    details: Score against your own criteria instead of relying on a generic single-score judge.
---
