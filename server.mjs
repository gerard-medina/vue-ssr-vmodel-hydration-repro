import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { setTimeout as sleep } from 'node:timers/promises'

import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

import { App } from './app.mjs'

const PORT = Number(process.env.PORT ?? 3333)
// How long the client bundle is held back, to leave time to interact before hydration.
const DELAY = Number(process.env.DELAY ?? 5000)

const require = createRequire(import.meta.url)
const vueBrowserBuild = require.resolve('vue/dist/vue.esm-browser.js')

const page = (html) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>v-model before hydration</title>
  <script type="importmap">{ "imports": { "vue": "/vue.js" } }</script>
  <script type="module" src="/client.mjs"></script>
</head>
<body>
  <div id="app">${html}</div>
</body>
</html>`

const js = (res, body) => res.writeHead(200, { 'content-type': 'text/javascript' }).end(body)

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')
  if (pathname === '/') {
    const html = await renderToString(createSSRApp(App))
    return res.writeHead(200, { 'content-type': 'text/html' }).end(page(html))
  }
  if (pathname === '/client.mjs') {
    await sleep(DELAY)
    return js(res, await readFile(new URL('./client.mjs', import.meta.url)))
  }
  if (pathname === '/app.mjs') return js(res, await readFile(new URL('./app.mjs', import.meta.url)))
  if (pathname === '/vue.js') return js(res, await readFile(vueBrowserBuild))
  res.writeHead(404).end()
}).listen(PORT, () => {
  console.log(`http://localhost:${PORT} (client bundle delayed ${DELAY} ms)`)
})
