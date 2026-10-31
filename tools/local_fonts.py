import re,urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
root=Path(__file__).resolve().parents[1];css=(root/'font-source.css').read_text();dest=root/'dist/assets/fonts';dest.mkdir(exist_ok=True)
blocks=re.findall(r'@font-face\s*\{.*?\}',css,re.S)
def get(block):
 family=re.search("font-family: '(.*?)'",block)[1];weight=re.search('font-weight: (\\d+)',block)[1];url=re.search(r'url\((.*?)\)',block)[1];name=family.lower().replace(' ','-')+'-'+weight+'.ttf'
 data=urllib.request.urlopen(url,timeout=20).read();(dest/name).write_bytes(data);return block.replace(url,'assets/fonts/'+name)
blocks=list(ThreadPoolExecutor(max_workers=8).map(get,blocks))
p=root/'dist/style.css';current=p.read_text();current=re.sub(r"^@import[^\n]+\n",'',current);p.write_text('\n'.join(blocks)+'\n'+current)
for family in ['dmsans','manrope']:
 try:(dest/(family+'-OFL.txt')).write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/'+family+'/OFL.txt',timeout=20).read())
 except Exception: print('License fetch unavailable:',family)
print('Eight local font files ready.')
