const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const script = fs.readFileSync(path.join(__dirname, '../assets/js/blog-embed.js'), 'utf8');
function boot() {
  const events = {}, frameEvents = {}, sent = [], classes = new Set(), applied = [];
  let current = 'dark';
  const external = {}, status = {};
  const child = { postMessage: (data, origin) => sent.push({data, origin}) };
  const frame = { contentWindow: child, getAttribute: () => 'https://www.husky1102.top/', addEventListener: (type, fn) => frameEvents[type] = fn };
  const window = { addEventListener: (type, fn) => events[type] = fn, setTimeout() {}, clearTimeout() {} };
  const document = { getElementById: () => frame, querySelector: s => s === '.blog-reader__external' ? external : status,
    body: { classList: { add: c => classes.add(c), remove: c => classes.delete(c) } } };
  vm.runInNewContext(script, {window,document,URL,location:{href:'https://husky1102.github.io/blog_embed/'}});
  window.huskyBlogEmbed.start({current:()=>current,receive:t=>{current=t;applied.push(t);}});
  const message = (data, origin='https://www.husky1102.top', source=child) => events.message({data,origin,source});
  return {events,frameEvents,sent,classes,applied,frame,external,status,message};
}
const ready = {type:'husky:embed:ready',version:1,theme:'dark',capabilities:{returnHome:true,themeControl:true},url:'https://www.husky1102.top/a/?embed=1#b'};
test('listener precedes embed opt-in and initial messages use the exact origin',()=>{
  const b=boot(); assert.equal(b.frame.src,'https://www.husky1102.top/?embed=1');
  assert.equal(b.sent[0].origin,'https://www.husky1102.top'); assert.equal(b.sent[0].data.type,'husky:embed:init');
  assert.equal(b.classes.size,0);
});
test('only validated capabilities and matching theme can hide the fallback',()=>{
  const b=boot();
  for(const data of [null,[],{...ready,version:2},{...ready,theme:'system'},{...ready,capabilities:{returnHome:true}},{...ready,capabilities:Object.assign([],{returnHome:true,themeControl:true})}]) b.message(data);
  b.message(ready,'https://www.husky1102.top.evil.test'); b.message(ready,'https://www.husky1102.top',{});
  assert.equal(b.classes.size,0);
  b.message({...ready,theme:'light'}); assert.equal(b.classes.size,0); assert.equal(b.sent.at(-1).data.type,'husky:embed:init');
  b.message(ready); assert.ok(b.classes.has('blog-embed-ready'));
  assert.equal(b.external.href,'https://www.husky1102.top/a/#b');
});
test('loads and child departures restore fallback; a new ready is required',()=>{
  const b=boot(); b.message(ready); b.message({type:'husky:embed:navigating',version:1}); assert.equal(b.classes.size,0);
  b.frameEvents.load(); assert.equal(b.sent.at(-1).data.type,'husky:embed:init'); assert.equal(b.classes.size,0);
  b.message(ready); assert.equal(b.classes.size,1);
  b.frameEvents.error(); assert.equal(b.classes.size,0); assert.equal(b.status.hidden,false);
});
test('remote theme is applied without echo; local changes notify the child',()=>{
  const b=boot(), count=b.sent.length;
  b.message({type:'husky:embed:theme',version:1,theme:'light'});
  assert.deepEqual(b.applied,['light']); assert.equal(b.sent.length,count);
  b.events['husky:theme-change'](); assert.equal(b.sent.at(-1).data.theme,'light');
});
test('ready cannot replace the external reading link with another origin',()=>{
  const b=boot(); b.message({...ready,url:'https://evil.test/'}); assert.equal(b.external.href,undefined);
});
