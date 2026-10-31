from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,json,math,textwrap
root=Path(__file__).resolve().parents[1];out=root/'dist/assets';tasks=json.loads((root/'tools/tasks.json').read_text())
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';f=lambda z,b=False:ImageFont.truetype(bold if b else font,z)
for task in tasks:
 fps=15;W,H=800,450
 p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(fps),'-i','-','-an','-c:v','libx264','-preset','ultrafast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',str(out/(task['id']+'-guide.mp4'))],stdin=subprocess.PIPE)
 for n in range(9*fps):
  phase=min(2,n//(3*fps));t=n/fps;im=Image.new('RGB',(W,H),'#f8f6f1');d=ImageDraw.Draw(im)
  d.rounded_rectangle((25,23,775,427),radius=24,fill='#eee8f7');d.text((55,45),'SAMAJH / VISUAL STEP GUIDE',font=f(12,True),fill='#705397')
  title=task['title'];d.text((55,75),title,font=f(23,True),fill='#33283f')
  d.rounded_rectangle((265,130,535,288),radius=14,fill='white',outline='#c5b6d9',width=2)
  # Visual cue: progress controls in a fictional task window.
  d.rounded_rectangle((283,149,517,246),radius=9,fill='#e5ebdf' if phase==2 else '#f1ecf7')
  if task['id'] in ['mic','join']:
   x=400;d.rounded_rectangle((390,164,410,202),radius=10,fill='#6b4ea5');d.arc((380,174,420,213),0,180,fill='#6b4ea5',width=3);d.line((400,213,400,224),fill='#6b4ea5',width=3)
   if phase==0:d.line((377,165,424,221),fill='#b26e65',width=4)
  elif task['id']=='blur':
   d.ellipse((382,158,419,198),fill='#d8ab92');d.rounded_rectangle((367,196,434,237),radius=15,fill='#a28bbb')
   d.rectangle((294,165,315,213),fill='#c6cdbb' if phase else '#b5c5a4');d.rectangle((482,169,501,210),fill='#d8d4ce')
  elif task['id']=='share':
   for i in range(3):d.rounded_rectangle((294+i*74,170,356+i*74,222),radius=6,fill='#d7c9e8' if i==1 else '#e1ddd0',outline='#705397' if i==1 and phase else '#d3ccd9',width=2)
  elif task['id']=='access':
   for i in range(3):d.ellipse((325+i*50,171,354+i*50,200),fill='#b9cda9' if i==0 else '#d5c9df');d.text((328+i*50,206),['S','A','B'][i],font=f(12),fill='#705397')
   if phase==2:d.line((377,183,453,183),fill='#f1ecf7',width=5)
  else:
   d.rounded_rectangle((370,160,430,232),radius=5,fill='white',outline='#a68dbf',width=2)
   for i in range(3):d.line((381,178+i*14,419,178+i*14),fill='#c6b6d9',width=3)
   if phase==2:d.line([(384,213),(395,222),(416,199)],fill='#6d8d59',width=3)
  for i in range(3):
   x=325+i*60;d.rounded_rectangle((x,261,x+42,271),radius=4,fill='#7657a6' if i<=phase else '#ddd1ea')
  words=textwrap.wrap(task['steps'][phase],42)
  for j,line in enumerate(words):d.text(((W-d.textlength(line,font=f(22,True)))/2,322+j*29),line,font=f(22,True),fill='#473653')
  d.text((55,392),f'Step {phase+1} of 3  /  Fictional practice, nothing real changes',font=f(12),fill='#7c6c89')
  d.line((55,413,55+690*(n/(9*fps)),413),fill='#9a80ba',width=3)
  if n==0:im.save(out/(task['id']+'-poster.png'))
  p.stdin.write(im.tobytes())
 p.stdin.close();assert p.wait()==0
 vtt='WEBVTT\n\n'
 for i,step in enumerate(task['steps']):vtt+=f'00:0{i*3}.000 --> 00:0{(i+1)*3}.000\n{step}\n\n'
 (out/(task['id']+'-guide.vtt')).write_text(vtt)
 print(task['id'],flush=True)
