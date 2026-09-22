const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '_site');
const evidence = path.resolve(process.env.QA_OUTPUT || path.join(root, 'local/browser-check'));
const types = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json'};
const server = http.createServer((request,response) => {
  let resource;
  try { resource = path.resolve(output, '.' + decodeURIComponent(new URL(request.url,'http://localhost').pathname)); } catch (_) { response.writeHead(400).end(); return; }
  if (!resource.startsWith(output + path.sep) && resource !== output) { response.writeHead(403).end(); return; }
  if (fs.existsSync(resource) && fs.statSync(resource).isDirectory()) resource=path.join(resource,'index.html');
  if (new URL(request.url,'http://localhost').pathname === '/__qa_document__/') {
    const html = fs.readFileSync(path.join(output,'about/index.html'),'utf8').replace(/<main[\s\S]*?<\/main>/, '<main id="main" tabindex="-1" class="site-content"><h1>Document fixture</h1><pre><code>const answer = 42;</code></pre><table><tr><td>'+ 'WideColumn'.repeat(100) +'</td></tr></table></main>');
    response.writeHead(200, {'content-type':'text/html'}).end(html); return;
  }
  if (!fs.existsSync(resource) && !path.extname(resource)) resource += '.html';
  if (!fs.existsSync(resource)) { response.writeHead(404).end(); return; }
  response.writeHead(200, {'content-type': types[path.extname(resource)] || 'application/octet-stream'});
  fs.createReadStream(resource).pipe(response);
});
const results=[];
let browser;
async function check(name,fn) { await fn(); results.push({name,status:'pass'}); console.log('PASS',name); }
(async () => {
  fs.mkdirSync(evidence,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({headless:true, ...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});
  for(const width of [390,1440]) {
    const context=await browser.newContext({viewport:{width,height:900},colorScheme:'light',reducedMotion:'reduce'});
    const page=await context.newPage();const errors=[];const failed=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.url().startsWith(origin) && response.status()>=400)failed.push(response.url());});
    for(const route of ['/','/about/','/cv/','/cv_zh/','/terms/','/sitemap/','/404.html']) {
      await check(`${width}px ${route}: content, resources, overflow and landmarks`,async()=>{
        await page.goto(origin+route);await page.evaluate(()=>document.fonts.ready);
        assert.equal(await page.locator('main').count(),1);
        assert.equal(await page.locator('h1').count(),1);
        assert.ok((await page.locator('main').innerText()).length>30);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
        assert.ok(await page.locator('#theme-toggle').isVisible());
        assert.deepEqual(await page.locator('img').evaluateAll(images=>images.filter(img=>!img.complete || !img.naturalWidth || !img.alt).map(img=>img.src)),[]);
        const key=route==='/'?'home':route.replaceAll('/','').replace('.html','');
        await page.screenshot({path:path.join(evidence,`${key}-${width}.png`),fullPage:true});
      });
    }
    await check(`${width}px theme preference survives navigation and reload`,async()=>{
      await page.goto(origin+'/');await page.locator('#theme-toggle').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
      assert.equal(await page.locator('#theme-toggle').getAttribute('aria-pressed'),'true');
      await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
      await page.screenshot({path:path.join(evidence,`home-dark-${width}.png`),fullPage:true});
      await page.goto(origin+'/about/');assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
      await page.locator('#theme-toggle').click();
    });
    if(width===390) await check('mobile menu opens, closes with Escape and restores focus',async()=>{
      const menu=page.locator('.menu-toggle');const links=page.locator('#site-links');
      assert.equal(await links.isVisible(),false);
      assert.equal(await links.evaluate(el=>el.inert),true);
      await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');assert.equal(await links.isVisible(),true);
      await page.keyboard.press('Escape');assert.equal(await links.isVisible(),false);assert.equal(await menu.evaluate(el=>el===document.activeElement),true);
      await menu.click();await links.getByRole('link',{name:'简历',exact:true}).click();await page.waitForURL('**/cv_zh/');
    });
    await check(`${width}px CV language switch and print visibility`,async()=>{
      await page.goto(origin+'/cv/');await page.getByRole('link',{name:'切换到中文简历'}).click();await page.waitForURL('**/cv_zh/');
      assert.equal(await page.locator('html').getAttribute('lang'),'zh');
      await page.getByRole('link',{name:'Switch to English CV'}).click();await page.waitForURL('**/cv/');
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      await page.emulateMedia({media:'print'});assert.equal(await page.locator('.site-header').isVisible(),false);assert.equal(await page.locator('.resume-links').isVisible(),false);assert.ok(await page.locator('#education').isVisible());await page.emulateMedia({media:'screen'});
    });
    await check(`${width}px privacy contents link reaches the selected section`,async()=>{
      await page.goto(origin+'/terms/');await page.locator('.document-toc').getByRole('link',{name:'浏览器本地设置'}).click();
      assert.ok(decodeURIComponent(page.url()).endsWith('#浏览器本地设置'));
      const top=await page.getByRole('heading',{name:'浏览器本地设置',exact:true}).evaluate(el=>el.getBoundingClientRect().top);assert.ok(top>=0 && top<900);
    });
    await check(`${width}px browser error and resource checks`,async()=>{assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);});
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
  await check('without JavaScript all primary navigation and content remain accessible',async()=>{
    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const tab=await nojs.newPage();await tab.goto(origin+'/');
    assert.ok(await tab.getByRole('link',{name:'查看英文 CV'}).isVisible());assert.ok(await tab.locator('#site-links').isVisible());assert.ok(await tab.locator('main').evaluate(el=>el.getBoundingClientRect().top)>=await tab.locator('.site-header').evaluate(el=>el.getBoundingClientRect().bottom));await nojs.close();
  });
  await check('mock blog handshake, child theme and navigation restore the return bar',async()=>{
    await page.route('https://www.husky1102.top/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body>Reader fixture</body></html>'}));
    await page.goto(origin+'/blog_embed/');
    const frame=page.frameLocator('#blog-frame');
    const child=page.frames().find(frame=>frame.url().startsWith('https://www.husky1102.top/'));
    assert.ok(child);assert.ok(await page.getByRole('link',{name:'返回主页'}).isVisible());
    const theme=await page.locator('html').getAttribute('data-theme');
    await child.evaluate(theme=>parent.postMessage({type:'husky:embed:ready',version:1,theme,capabilities:{returnHome:true,themeControl:true},url:'https://www.husky1102.top/article/?embed=1'},'*'),theme);
    await page.locator('body.blog-embed-ready').waitFor();assert.equal(await page.locator('.site-header').isVisible(),false);
    await child.evaluate(()=>parent.postMessage({type:'husky:embed:theme',version:1,theme:'dark'},'*'));
    await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
    await child.evaluate(()=>parent.postMessage({type:'husky:embed:navigating',version:1},'*'));
    await page.locator('.site-header').waitFor({state:'visible'});
    assert.equal(await page.locator('.blog-reader__external').getAttribute('href'),'https://www.husky1102.top/article/');
    assert.equal(await page.locator('#blog-frame').getAttribute('referrerpolicy'),'no-referrer');
  });
  // Serve canonical redirect destinations from this build, never the live site.
  await page.route('https://husky1102.github.io/**', async route => {
    const url = new URL(route.request().url());
    const response = await page.request.get(origin + url.pathname + url.search);
    await route.fulfill({response});
  });
  await check('legacy archive entry points redirect to the blog',async()=>{
    for(const route of ['/categories/','/tags/','/year-archive/','/wordpress/blog-posts/']){await page.goto(origin+route);await page.waitForURL('**/blog_embed/');}
  });
  await context.close();
  const motionContext=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const motion=await motionContext.newPage();
  await check('normal motion, reduced-motion changes and back-to-top work on the rebuilt shell',async()=>{
    await motion.goto(origin+'/');
    await motion.waitForFunction(()=>document.documentElement.dataset.homeMotion==='active');
    const stage=motion.locator('.home-hero__stage');await stage.hover();
    await motion.waitForFunction(()=>document.querySelector('.home-hero__stage').classList.contains('is-popped'));
    await motion.emulateMedia({reducedMotion:'reduce'});
    await motion.waitForFunction(()=>document.documentElement.dataset.homeMotion==='static');
    await motion.locator('.site-footer').scrollIntoViewIfNeeded();
    await motion.locator('.back-to-top').click();await motion.waitForFunction(()=>scrollY===0);
    await motion.goto(origin+'/about/');
    await motion.locator('.site-footer').scrollIntoViewIfNeeded();
    await motion.waitForFunction(()=>document.querySelector('.scroll-progress span').style.width==='100%');
    await motion.locator('.back-to-top').click();await motion.waitForFunction(()=>scrollY===0);
  });
  await check('keyboard skip link reaches main content',async()=>{
    await motion.goto(origin+'/cv/');await motion.keyboard.press('Tab');
    assert.equal(await motion.evaluate(()=>document.activeElement.getAttribute('href')),'#main');
    await motion.keyboard.press('Enter');assert.equal(await motion.evaluate(()=>document.activeElement.id),'main');
  });
  await motionContext.close();
  for(const fallback of [false,true]) await check(`code copy ${fallback?'fallback':'clipboard'} and wide table behavior`,async()=>{
    const fixtureContext=await browser.newContext({viewport:{width:390,height:844}});
    await fixtureContext.addInitScript(fallback=>{
      Object.defineProperty(navigator,'clipboard',{value:fallback?undefined:{writeText:async value=>{window.copiedValue=value;}}});
      if(fallback) document.execCommand=action=>{window.copiedValue=document.activeElement.value;return action==='copy';};
    },fallback);
    const fixture=await fixtureContext.newPage();await fixture.goto(origin+'/__qa_document__/');
    await fixture.locator('.code-copy').click();
    await fixture.waitForFunction(()=>window.copiedValue==='const answer = 42;');
    assert.equal(await fixture.locator('.code-copy').innerText(),'已复制');
    assert.ok(await fixture.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.ok(await fixture.locator('table').evaluate(el=>el.scrollWidth>el.clientWidth));
    assert.equal(await fixture.locator('textarea').count(),0);
    await fixtureContext.close();
  });
})().catch(error=>{results.push({status:'fail',error:error.stack});console.error(error);process.exitCode=1;}).finally(async()=>{
  fs.mkdirSync(evidence,{recursive:true});fs.writeFileSync(path.join(evidence,'results.json'),JSON.stringify(results,null,2)+'\n');
  if(browser)await browser.close();server.close();
});
