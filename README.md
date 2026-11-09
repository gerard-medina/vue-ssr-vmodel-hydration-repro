# v-model: state changed before hydration is lost

Minimal reproduction for checkbox, radio and select `v-model` bindings, which reset what the
user changed before hydration. Text inputs, as the control case, keep it since vuejs/core#14411.

No bundler: the server renders `app.mjs` with `renderToString`, and the browser hydrates the
same component with the full browser build of Vue. The client bundle is held back for
`DELAY` ms (5000 by default) to leave time to interact before hydration.

```sh
npm install
npm start          # http://localhost:3333
DELAY=10000 npm start
```

## Steps

1. Open the page. While the status says **not hydrated yet**, type in the text input, tick
   both checkboxes, pick radio **b** and choose **B** in the select.
2. Wait until the status says **hydrated** and compare each field with the model printed
   below the fields.

## Result (Vue 3.5.45, Chromium)

| Field | Before hydration (DOM / model) | After hydration (DOM / model) |
| --- | --- | --- |
| text | typed / `""` | typed / typed ✅ |
| checkbox, model `false` | ticked / `false` | **unticked** / `false` |
| checkbox, model `undefined` | ticked / `undefined` | ticked / **`undefined`** (DOM and model disagree) |
| radio | b / `"a"` | **a** / `"a"` |
| select | B / `"a"` | **A** / `"a"` |

Expected: the same as the text input. What the user changed before hydration stays in the
DOM and is assigned to the model.
