import re, os
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(D)
src = open(f'{D}/base.html').read()   # styles, logo and modules 1-4

# --- pieces from the current page
css = re.search(r'<style>\n/\* Layout:(.*?)</style>', src, re.S).group(0)
logo = re.search(r'(<svg class="logo-svg".*?</svg>)', src, re.S).group(1)
pagesA = src[src.index('  PAGES.m1 = function'):src.index('  function placeholder(m) {')]

extra_css = '''
/* ---- site additions ---- */
body { margin: 0; }
[hidden] { display: none !important; }
img { max-width: 100%; }
:root { --danger: #b3361b; }
.toplinks { margin-top: 12px; }
.toplinks .home-link { margin-top: 0; }
.rooms li span:last-child { white-space: normal !important; text-align: right; }
.muted-s { color: var(--muted); font-size: 14px; }
.muted-c { color: var(--muted); }
.who { font-size: 15px; color: var(--muted); margin-top: 8px; }
.nomatch { margin: 16px 8px; color: var(--muted); font-size: 14px; }
.navlink .pill.good { color: var(--good); border-color: var(--good); }
.navlink .pill.bad { color: var(--bad); border-color: var(--bad); }
.navlink.testlink .num { border-style: dashed; }
.phase .gate-line { margin-top: auto; border-top: 1px solid var(--line); padding-top: 10px; font-size: 14px; display: flex; gap: 8px; align-items: baseline; }
.phase .gate-line b { color: var(--orange-ink); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
.phase .gate-line a { color: var(--ink); font-weight: 600; }

/* profile form */
.profile { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 18px 20px; margin: 18px 0; }
.profile p { margin-top: 0; }
.profile .fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 14px; }
.profile label { display: grid; gap: 4px; font-size: 13px; font-weight: 600; color: var(--muted); min-width: 0; }
.profile input, .profile select { font: 15px var(--font-body); color: var(--ink); background: var(--ground); border: 1px solid var(--line); border-radius: 8px; height: 42px; padding: 0 10px; width: 100%; }
.gate .profile { border-color: var(--orange); }
.signin .row { display: flex; flex-wrap: wrap; gap: 10px; }
.formerr { color: var(--bad); font-weight: 600; margin: 0 0 12px; }
.signin input[name=code] { letter-spacing: .3em; font-family: var(--font-mono); font-size: 20px; max-width: 220px; }

/* result card */
.result { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 16px; align-items: center; border-radius: 12px; padding: 16px 18px; margin: 12px 0 18px; border: 1.5px solid var(--line); background: var(--surface); }
.result.pass { border-color: var(--good); background: var(--good-wash); }
.result.fail { border-color: var(--bad); background: var(--bad-wash); }
.result .big { font: 800 34px var(--font-display); font-variant-numeric: tabular-nums; }
.result.pass .big { color: var(--good); }
.result.fail .big { color: var(--bad); }
.result p { margin: 2px 0 0; font-size: 14px; }
.result .sent { color: var(--muted); }
@media (max-width: 560px) { .result { grid-template-columns: auto minmax(0, 1fr); } .result .btn { grid-column: 1 / -1; justify-content: center; } }

/* tests */
.tq { border: 1px solid var(--line); background: var(--surface); border-radius: 12px; padding: 14px 18px 10px; margin: 0 0 12px; }
.tq.answered { border-color: var(--orange); }
.tq legend { font-weight: 600; padding: 0 6px; margin-left: -6px; }
.tq label { display: flex; gap: 10px; align-items: flex-start; padding: 7px 4px; cursor: pointer; border-radius: 6px; }
.tq label:hover { background: var(--ground); }
.tq input { accent-color: var(--orange); margin-top: 4px; flex: none; }
.submitbar { position: sticky; bottom: env(safe-area-inset-bottom, 0px); display: flex; justify-content: space-between; align-items: center; gap: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 12px 16px; margin-top: 16px; box-shadow: 0 -4px 20px rgba(0,0,0,.06); }
.submitbar span { font-variant-numeric: tabular-nums; color: var(--muted); }
.btn[disabled] { opacity: .45; cursor: not-allowed; }
.btn-danger { background: var(--bad); color: #fff; }
.lockbox { background: var(--surface); border: 1px dashed var(--muted); border-radius: 12px; padding: 18px 20px; }
.lockbox ul { margin: 8px 0 0; padding-left: 20px; }
.rv { border-left: 4px solid var(--line); background: var(--surface); border-radius: 0 10px 10px 0; padding: 10px 14px; margin-bottom: 10px; }
.rv.ok { border-left-color: var(--good); }
.rv.no { border-left-color: var(--bad); }
.rv p { margin: 0 0 4px; }
.rv .why { color: var(--muted); font-size: 14px; }

/* grades */
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 18px 0; }
.tile { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
.tile span { display: block; font-size: 12.5px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.tile b { font: 800 22px var(--font-display); font-variant-numeric: tabular-nums; }
.gtable td a { color: var(--ink); }
.gtable tr.trow td { background: var(--orange-wash); font-weight: 600; }
.gpill { display: inline-block; min-width: 28px; text-align: center; font-weight: 700; border-radius: 99px; padding: 1px 8px; }
.gpill.good { background: var(--good-wash); color: var(--good); }
.gpill.bad { background: var(--bad-wash); color: var(--bad); }

/* toast */
.toast { position: fixed; left: 50%; bottom: calc(20px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); background: var(--ink); color: var(--surface); padding: 10px 16px; border-radius: 10px; font-size: 14px; z-index: 50; max-width: calc(100% - 32px); box-shadow: 0 8px 30px rgba(0,0,0,.2); }
'''
css = css.replace('</style>', extra_css + '</style>')

body = f'''<header class="bar">
  <button class="menu-btn" id="menuBtn" aria-controls="rail" aria-expanded="false">Modules</button>
  <a class="brand" href="#home" aria-label="United Porte Academy home">
    {logo}
    <span class="tag">Academy</span>
  </a>
  <span class="spacer"></span>
  <span class="progress-mini" id="progMini"></span>
</header>

<div class="shell">
  <nav class="rail" id="rail" aria-label="Course modules">
    <input class="search" id="search" type="search" placeholder="Find a module…" aria-label="Find a module">
    <ol class="toplinks">
      <li><a class="navlink home-link" href="#home" data-id="home"><span class="num">⌂</span><span>Start here</span><span></span></a></li>
      <li><a class="navlink home-link" href="#grades" data-id="grades"><span class="num">★</span><span>My grades</span><span></span></a></li>
      <li><a class="navlink home-link" href="#me" data-id="me"><span class="num">☺</span><span>My details</span><span></span></a></li>
    </ol>
    <div id="navParts"></div>
  </nav>
  <div class="scrim" id="scrim"></div>
  <main id="main" tabindex="-1"><div class="page" id="page"></div></main>
</div>
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
'''

fw = open(f'{D}/framework.js').read()
fw = fw.replace('/*@@TESTS@@*/', open(f'{D}/tests.js').read())
fw = fw.replace('/*@@MODULES@@*/', pagesA + open(f'{D}/m5_8.js').read() + open(f'{D}/m9_14.js').read())

fonts = '''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@500;600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap">'''

site = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>United Porte Academy</title>
<meta name="description" content="Training course for new United Porte team members.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='%23f98d37'/%3E%3Cpath d='M12 32V10h16v22' fill='none' stroke='%23131313' stroke-width='4'/%3E%3C/svg%3E">
{fonts}
{css}
</head>
<body>
{body}
<script>
{fw}
</script>
</body>
</html>
'''
open(f'{OUT}/index.html', 'w').write(site)
# artifact preview (skeleton is added by the host)
open(f'{D}/preview.html', 'w').write(f'<title>United Porte Academy</title>\n{fonts}\n{css}\n{body}\n<script>\n{fw}\n</script>\n')
print(len(site))
