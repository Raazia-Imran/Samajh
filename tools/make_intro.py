from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import math,subprocess
root=Path(__file__).resolve().parents[1]
out=root/'dist/assets'
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=lambda size,b=False:ImageFont.truetype(bold if b else font,size)
W,H=960,540;fps=24;duration=12
proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(fps),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'hello-samajh.mp4')],stdin=subprocess.PIPE)
titles=['Choose one small goal.','Try it in a safe space.','See what changes.','Give it a go yourself.']
subs=['A call. A file. Something you want to do.','No real accounts. Nothing to break.','Understand the idea, beyond the button.','No rush. No judgement. Just you, learning.']
def centered(d,text,y,font,fill):d.text(((W-d.textlength(text,font=font))/2,y),text,font=font,fill=fill)
for n in range(fps*duration):
 t=n/fps;stage=min(3,int(t/3));im=Image.new('RGB',(W,H),'#f9f7f2');d=ImageDraw.Draw(im)
 d.rounded_rectangle((45,35,915,505),radius=30,fill='#eee8f7')
 d.rounded_rectangle((75,60,120,105),radius=13,fill='#6549a5');d.text((86,62),'S',font=f(31,True),fill='white');d.text((135,67),'samajh.',font=f(24,True),fill='#302739')
 oy=math.sin(t*2)*5
 d.rounded_rectangle((340,130+oy,620,310+oy),radius=18,fill='#fffdf8',outline='#c7b9db',width=3)
 d.rounded_rectangle((360,151+oy,600,282+oy),radius=10,fill=['#e5eddc','#e7e0f1','#e7e0f1','#e4eddd'][stage])
 if stage==0:
  d.rounded_rectangle((391,175+oy,569,220+oy),radius=9,fill='white');d.text((414,188+oy),'Share a window',font=f(17),fill='#6549a5')
  d.ellipse((455,238+oy,469,252+oy),fill='#b49bcf');d.ellipse((484,238+oy,498,252+oy),fill='#b49bcf')
 elif stage==1:
  d.rounded_rectangle((432,167+oy,528,258+oy),radius=15,fill='#6549a5');d.line([(457,210+oy),(475,227+oy),(507,190+oy)],fill='white',width=7)
 elif stage==2:
  for x,col in [(385,'#c7d9bd'),(496,'#d2c3e4')]:
   d.rounded_rectangle((x,176+oy,x+77,250+oy),radius=12,fill=col)
  d.line([(467,212+oy),(494,212+oy)],fill='#6549a5',width=4);d.polygon([(486,206+oy),(495,212+oy),(486,218+oy)],fill='#6549a5')
 else:
  d.ellipse((439,173+oy,521,255+oy),fill='#c2d7b2');d.line([(458,214+oy),(475,231+oy),(507,191+oy)],fill='#557544',width=7)
 d.polygon([(340,316+oy),(620,316+oy),(645,334+oy),(315,334+oy)],fill='#b09bca')
 centered(d,titles[stage],365,f(30,True),'#31263f');centered(d,subs[stage],411,f(17),'#786984')
 for i in range(4):
  x=421+i*31;d.rounded_rectangle((x,464,x+22,470),radius=3,fill='#6549a5' if i==stage else '#d4c9e1')
 if n==30:im.save(out/'video-poster.png')
 proc.stdin.write(im.tobytes())
proc.stdin.close();assert proc.wait()==0
(out/'intro.vtt').write_text('WEBVTT\n\n00:00.000 --> 00:03.000\nChoose one small goal. A call. A file. Something you want to do.\n\n00:03.000 --> 00:06.000\nTry it in a safe space. No real accounts. Nothing to break.\n\n00:06.000 --> 00:09.000\nSee what changes. Understand the idea, beyond the button.\n\n00:09.000 --> 00:12.000\nGive it a go yourself. No rush. No judgement.\n')
print('Created 12-second captioned introduction and poster.')
