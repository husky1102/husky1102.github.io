"""Build a review-only SVG cursor study; never writes production cursor assets."""
from pathlib import Path
import base64

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]

DEFS = '''<defs>
  <linearGradient id="ice" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#eefcff"/><stop offset=".46" stop-color="#b5e8fa"/><stop offset="1" stop-color="#70bde7"/>
  </linearGradient>
  <linearGradient id="silk" x1="0" y1="0" x2=".8" y2="1">
    <stop stop-color="#fffefb"/><stop offset=".55" stop-color="#eff3ff"/><stop offset="1" stop-color="#c8d4ef"/>
  </linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#fffdf0"/><stop offset=".5" stop-color="#fff1bc"/><stop offset="1" stop-color="#e8c884"/>
  </linearGradient>
  <linearGradient id="pink" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#fff0f5"/><stop offset="1" stop-color="#f3b8d0"/>
  </linearGradient>
  <linearGradient id="skin" x1="0" y1="0" x2=".9" y2="1">
    <stop stop-color="#fff9f3"/><stop offset=".65" stop-color="#ffece6"/><stop offset="1" stop-color="#edb7b4"/>
  </linearGradient>
  <pattern id="gingham" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#fff8d9"/><path d="M1.5 0V3M0 1.5H3" stroke="#edcf82" stroke-width="1.1" opacity=".34"/>
  </pattern>
</defs>'''

def heart(x, y, size, fill='ice', stroke='#6384b4'):
    return f'''<g transform="translate({x} {y}) scale({size/10})">
      <path d="M0 2.6C0-.5 3.7-1.4 5 1.2C6.8-1.5 10-.4 10 2.5C10 5.1 7.3 7.3 5 9C2.6 7.3 0 5.1 0 2.6Z" fill="url(#{fill})" stroke="{stroke}" stroke-width=".65"/>
      <path d="M1.3 2.3L4.9 1.9L8.7 2.1L5 7.6Z" fill="#fff" opacity=".32"/>
      <path d="M1.3 2.3L5 4.8L8.7 2.1M4.9 1.9L5 7.6" fill="none" stroke="#fff" stroke-width=".5" opacity=".65"/>
      <ellipse cx="2.1" cy="1.8" rx=".8" ry=".6" fill="#fff"/>
    </g>'''

def sparkle(x, y, size, gold=False):
    return f'<path transform="translate({x} {y}) scale({size})" d="M0-1Q.12-.12.65 0Q.12.12 0 1Q-.12.12-.65 0Q-.12-.12 0-1Z" fill="#fffdf0" stroke="{"#deb875" if gold else "#81c5e8"}" stroke-width=".11"/>'

def bow(x, y, scale=1):
    return f'''<g transform="translate({x} {y}) scale({scale})" stroke="#7385b0" stroke-width=".48" stroke-linejoin="round">
      <path d="M-1 1C-3.2 3.9-5.3 5.9-7 6.2L-5.9 3.7L-8 3.5L-3-.6Z" fill="url(#silk)"/>
      <path d="M1 1C2.2 4.2 4.5 6 7.7 7.1L6 3.7L8 3.6L3-.6Z" fill="url(#silk)"/>
      <path d="M0 0C-2.1-2.8-6.3-4.2-7-3C-7.8-1.8-6.7 2.6-5.5 2.8C-3.3 2.7-1 1.2 0 0Z" fill="url(#gingham)"/>
      <path d="M0 0C2.8-3.1 6.1-4.5 6.8-3.5C7.6-2.1 7.5 1.8 6.5 2.5C4.2 2.6 1.9.9 0 0Z" fill="url(#gingham)"/>
      <path d="M-1 .4Q-5 .5-5 2.2Q-3.4 4.1-1 .4M1 .4Q5-.6 6 1.5Q5 3.6 1 .4" fill="url(#ice)"/>
      <path d="M-5.8-2.4Q-2.8-1.9-1.5-.7M5.8-2.8Q3-2 1.5-.8" stroke="#fff" opacity=".8" fill="none"/>
      {heart(-2.1,-1.5,4.4,'gold','#bda16d')}
      {heart(-1.55,-1,3.3)}
    </g>'''

DEFAULT = '''<path d="M9.7 4.9Q9.4 3.7 10.5 4.5L31.6 21.7Q32.4 22.4 31.2 22.5L21.4 22.3L15.1 30.6Q14.4 31.5 14.1 30.1Z" fill="url(#ice)" stroke="#526f9f" stroke-width=".75"/>
<path d="M10.9 6.5L29.4 21L20.7 20.8L15.1 28.4Z" fill="url(#silk)" stroke="#8dbce1" stroke-width=".45"/>
<path d="M12.4 9L26.8 20L20 19.7L15.6 25.5Z" fill="url(#ice)" stroke="#779ec6" stroke-width=".45"/>
<path d="M13 10L19.4 19.6L15.8 24.2L16.4 17.2Z" fill="#fff" opacity=".48"/>
<path d="M18.2 13.4L22.4 19.8L19.5 19.6Z" fill="#fff" opacity=".44"/>
<path d="M28 25Q35 23 39.2 29Q44.2 34.5 39.1 36.4Q41 32.3 35.1 32Q30.4 31.7 28 25Z" fill="url(#pink)" stroke="#7a8caf" stroke-width=".5"/>
<path d="M29.1 27Q32.5 30.6 37.5 34Q44.6 39 39.7 43Q44 42 43.6 38.1Q43.2 34.7 36.2 32.6Q33.2 31.5 29.1 27Z" fill="url(#ice)" stroke="#7385b0" stroke-width=".5"/>
<path d="M26.3 26Q22.4 33 28 36.2Q30.2 37.5 33.5 36.3Q27.4 36 29.1 30.2Z" fill="url(#ice)" stroke="#7385b0" stroke-width=".5"/>
<path d="M27.5 27L27.9 38L25 36.1L23.1 37.3L24.8 26Z" fill="url(#silk)" stroke="#7385b0" stroke-width=".5"/>
<path d="M28.5 27Q29.5 31 34.8 34.4L36 37Q30.4 35.6 27.4 30.3" fill="url(#silk)" stroke="#7385b0" stroke-width=".5"/>
'''+heart(13.6,12.4,3.6,'pink','#bf8baf')+sparkle(13.8,10,1.3,True)+sparkle(18.4,18.5,1.5,True)+sparkle(24,16.8,1.3)+bow(27,24.7,1)+'''<path d="M27.5 27.9L28.1 30.5L29.5 32.4" stroke="#bda16d" stroke-width=".45" fill="none"/><circle cx="27.8" cy="29.1" r=".65" fill="url(#silk)" stroke="#8a92b0" stroke-width=".3"/>'''+heart(28,30.5,2.8,'gold','#bda16d')+sparkle(38,35.7,1.2)

TEXT = '''<path d="M10.3 4.2C8.1 3.5 8 6.8 10.2 6.7L13.2 6.4Q14.1 6.6 14.1 8.6V23.4Q14.1 25.4 13.2 25.6L10.2 25.3C8 25.2 8.1 28.5 10.3 27.8L14 27.3H16.8L20.5 27.8C22.7 28.5 22.8 25.2 20.6 25.3L17.6 25.6Q16.7 25.4 16.7 23.4V8.6Q16.7 6.6 17.6 6.4L20.6 6.7C22.8 6.8 22.7 3.5 20.5 4.2L16.8 4.7H14Z" fill="url(#ice)" stroke="#617dae" stroke-width=".48"/>
<path d="M10.1 5.4L13.6 5.2Q15.2 5.4 15.2 8.4V23.6Q15.2 26.5 13.6 26.8L10.1 26.6M16 8.4V23.6M17.5 5.5L20.7 5.5M17.5 26.6H20.7" stroke="#fffef8" stroke-width=".65" fill="none"/>
'''+sparkle(15.5,13.2,.9,True)+heart(14.5,16.4,1.8,'gold','#bd9e69')+bow(15.5,5.2,.52)+bow(15.5,26.7,.48)

POINTER = '''<path d="M20.1 29.5C18 28.8 16.8 27.7 16.1 25.7L13.8 20.5Q12.5 17.8 14.1 18.1Q17.2 18.1 18.3 21L14.1 8.1Q13 4.5 14.9 4.5Q16.1 4.3 16.8 6.7L20.7 16.5Q21.9 13.5 23.6 14.8L25 17.1Q26.4 14.9 28.1 16.9L29 18.7Q30.9 17.3 31.9 20.5L32.3 25.3L31.3 29.9L24 32Z" fill="url(#skin)" stroke="#7785ad" stroke-width=".62"/>
<path d="M20.7 16.5Q21.1 18.1 22 18.2M25 17.1L25.9 19.1M29 18.7L29.8 20.8M18.3 21L19.3 25.1" stroke="#d9a3a7" stroke-width=".45" fill="none"/>
<path d="M15.5 9.3L19.8 21.1M23.2 17L24.4 20.8" stroke="#fff" stroke-width=".65" opacity=".75" fill="none"/>
<path d="M14.3 5.6Q15.7 4.4 16.3 7Q17 9 16.3 9.2Q15.1 9.6 14.6 8Z" fill="url(#ice)" stroke="#8bb1d2" stroke-width=".35"/>
<path d="M13.8 18.7Q14.4 18.2 15.7 20Q16.3 21.1 15.8 21.5Q14.6 21.1 13.8 18.7Z" fill="url(#ice)" stroke="#8bb1d2" stroke-width=".3"/>
<path d="M11.8 6.9L10.8 3.2Q10.4 2.2 9.5 3L9.2 3.5Z M11.8 9.2L8.6 7.6Q7.8 7.3 7.8 8.7Q7.8 9.2 8.5 9.3Z M12.1 11L9 11.7Q8.6 12 9.4 12.8Q9.9 13.2 10.4 12.7Z" fill="url(#ice)" stroke="#688bb6" stroke-width=".4"/>
<path d="M20.6 29.2Q21 27.9 22.3 28.2L26.8 26.3Q28.1 24.3 29.5 25.7Q31.3 24 32.4 25.9Q34.3 25.4 34.8 27.6L36.5 29.1L34.9 30.3L35.8 32.4L32.8 32.4L31.7 34.1L29.5 33.3L27.2 35.1L25.7 33.5L23.3 34.2L22.2 32.5Q18.7 33 19.5 31.3Z" fill="url(#silk)" stroke="#7d8bad" stroke-width=".5"/>
<path d="M28.7 32Q35.1 30.4 39.6 35.6Q44.8 41.4 39.8 45Q44.4 44.1 44 40.4Q43.6 35.8 36.8 34.5L30.2 30.6Z" fill="url(#ice)" stroke="#7385b0" stroke-width=".5"/>
<path d="M30.8 32.3Q31.9 36.9 38.4 38.2Q43 39.1 40.1 43Q44 39 39.5 36.8L34.8 33.7Z" fill="url(#pink)" stroke="#8b92b4" stroke-width=".45"/>
<path d="M27.8 31.8L26.7 41.8L29.3 41L30.8 44L29.6 32Z" fill="url(#silk)" stroke="#7385b0" stroke-width=".5"/>
<path d="M27.3 33L26.1 39.2L23.8 38.3L24.5 33Z" fill="url(#gingham)" stroke="#b3a27b" stroke-width=".4"/>
'''+heart(10.4,13.1,2.8,'pink','#bd8fac')+heart(29.2,24.4,2.4)+bow(28.7,31.8,.94)+'''<path d="M29.3 34L30 36.1L31.7 38.1" fill="none" stroke="#bda16d" stroke-width=".4"/><circle cx="30" cy="35.4" r=".65" fill="url(#silk)" stroke="#8292b4" stroke-width=".3"/>'''+heart(30.4,36.4,2.6,'gold','#bda16d')+sparkle(38.4,37.1,1.1)

for name, body, width, height in [('default',DEFAULT,48,48),('text',TEXT,31,32),('pointer',POINTER,48,48)]:
    for theme in ('light','dark'):
        defs = DEFS
        # Match the existing site's quieter night palette without a raster filter.
        if theme == 'dark':
            for old,new in {'#fffefb':'#eceaf0','#fffdf0':'#e5d8b9','#eefcff':'#d5eaf5','#b5e8fa':'#a3cde3','#70bde7':'#78afd0','#fff9f3':'#e9d8d2','#ffece6':'#e7cec8','#fff8d9':'#e3d6b5','#fff0f5':'#e5cddc'}.items():
                defs = defs.replace(old,new)
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" fill="none"><title>{name} — SVG 重绘提案</title>{defs}<g stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>'
        target = HERE / ('dark' if theme == 'dark' else '') / f'{name}.svg'
        target.write_text(svg)

def data_url(path):
    mime = 'image/svg+xml' if path.suffix == '.svg' else 'image/png'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()

for theme in ('light','dark'):
    folder = 'dark/' if theme == 'dark' else ''
    rows = ''
    for name,label,size in [('default','默认指针','48 × 48'),('text','文本指针','31 × 32'),('pointer','链接指针','48 × 48')]:
        old = data_url(ROOT / 'assets/cursors' / folder / f'{name}@2x.png')
        new = data_url(HERE / folder / f'{name}.svg')
        width,height = (31,32) if name == 'text' else (48,48)
        cells = ''
        for image in (old,new):
            cells += f'<div class="sample"><div class="large"><img src="{image}" width="{width*4}" height="{height*4}" alt="{label}放大效果"></div><div class="actual"><img src="{image}" width="{width}" height="{height}" alt="{label}原尺寸"><span>原尺寸</span></div></div>'
        rows += f'<section><div class="label"><h2>{label}</h2><span>{size} px</span></div>{cells}</section>'
    html = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>指针 SVG 重绘 · 前后对比</title><style>
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;--bg:#fbfaf7;--ink:#354457;--muted:#758194;--line:#dce2e8;--accent:#54789e}body.dark{--bg:#17191d;--ink:#e4e8ee;--muted:#949eaf;--line:#343a44;--accent:#a9c7e9}main{width:1080px;padding:36px 48px 28px}header{display:flex;justify-content:space-between;align-items:start}h1{font-size:29px;letter-spacing:1px;margin:0 0 10px;font-weight:600}p{margin:0;color:var(--muted);line-height:1.7}header a{color:var(--accent);text-decoration:none;border:1px solid var(--line);padding:8px 13px;border-radius:20px;font-size:12px}.heads{display:grid;grid-template-columns:160px 1fr 1fr;margin-top:30px;padding-bottom:12px;border-bottom:1px solid var(--line);color:var(--muted);font-size:13px}.heads b{font-size:15px;color:var(--ink);font-weight:500}section{display:grid;grid-template-columns:160px 1fr 1fr;align-items:center;height:212px;border-bottom:1px solid var(--line)}h2{font-size:17px;font-weight:500;margin:0 0 7px}.label span{color:var(--muted);font-size:12px}.sample{display:flex;align-items:center;justify-content:space-around}.large{width:210px;height:200px;display:flex;align-items:center;justify-content:center}.actual{width:75px;display:flex;flex-direction:column;align-items:center;gap:14px}.actual span{font-size:11px;color:var(--muted)}footer{padding-top:18px;color:var(--muted);font-size:12px;display:flex;justify-content:space-between}img{object-fit:contain}
</style>'''
    html += f'<body class="{theme}"><main><header><div><h1>指针重绘 · 前后对比</h1><p>保留水晶蓝、蝴蝶结与爱心，整理轮廓和细节。仅供预览，尚未替换。</p></div><a href="{"dark" if theme == "light" else "index"}.html">{"查看深色背景" if theme == "light" else "查看浅色背景"}</a></header><div class="heads"><span>{"浅色" if theme == "light" else "深色"}背景 · 4 倍细节</span><b>之前 · 当前 PNG</b><b>之后 · SVG 重绘稿</b></div>{rows}<footer><span>放大图用于查看轮廓；旁边按现有指针尺寸展示。</span><span>2026.09 · 方案 01</span></footer></main></body></html>'
    (HERE / ('index.html' if theme == 'light' else 'dark.html')).write_text(html)

    bg, ink, muted, line = ('#17191d','#e4e8ee','#949eaf','#343a44') if theme == 'dark' else ('#fbfaf7','#354457','#758194','#dce2e8')
    board = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="870"><rect width="1080" height="870" fill="{bg}"/><g font-family="PingFang SC, sans-serif" fill="{ink}">']
    def label(x, y, text, size=14, color=ink):
        return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}">{text}</text>'
    board += [label(48,64,'指针重绘 · 前后对比',29),label(48,98,'保留水晶蓝、蝴蝶结与爱心，整理轮廓和细节。',14,muted),label(48,151,('深色' if theme == 'dark' else '浅色')+'背景 · 4 倍细节',13,muted),label(208,151,'之前 · 当前 PNG',15),label(620,151,'之后 · SVG 重绘稿',15)]
    for i,(name,title,width,height) in enumerate([('default','默认指针',48,48),('text','文本指针',31,32),('pointer','链接指针',48,48)]):
        y = 170+i*212
        board += [f'<path d="M48 {y}H1032" stroke="{line}"/>',label(48,y+99,title,17),label(48,y+123,f'{width} × {height} px',12,muted)]
        for column,path in enumerate([ROOT/'assets/cursors'/folder/f'{name}@2x.png',HERE/folder/f'{name}.svg']):
            cx=318+column*412
            url=data_url(path)
            board += [f'<image x="{cx-width*2}" y="{y+106-height*2}" width="{width*4}" height="{height*4}" xlink:href="{url}"/>',f'<image x="{cx+164-width/2}" y="{y+86-height/2}" width="{width}" height="{height}" xlink:href="{url}"/>',label(cx+146,y+133,'原尺寸',11,muted)]
    board += [f'<path d="M48 806H1032" stroke="{line}"/>',label(48,838,'放大图用于查看轮廓；旁边按现有指针尺寸展示。',12,muted),'</g></svg>']
    (HERE/f'comparison-{theme}.svg').write_text(''.join(board))
