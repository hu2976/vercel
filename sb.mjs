import { chromium } from 'playwright'
const out='/private/tmp/claude-501/-Users-hujinghan/f1d8f462-79d1-4749-a7b5-97c9f879182f/scratchpad/shots'
const b = await chromium.launch()
for (const theme of ['light','dark']) {
  const p = await (await b.newContext({viewport:{width:1280,height:820},colorScheme:theme})).newPage()
  await p.addInitScript((t)=>localStorage.setItem('theme',t), theme)
  await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.waitForTimeout(700)
  await p.screenshot({path:`${out}/cut-home-${theme}.png`, clip:{x:0,y:0,width:1280,height:820}})
}
await b.close(); console.log('ok')
