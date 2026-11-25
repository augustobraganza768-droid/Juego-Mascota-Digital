export function atmosphere(ctx,w,h,t,room,quality,night){
 const colors=['#ffe4a3','#b9f4b5','#a4e9ff','#f8c1ef','#c7b5ff','#d6efff','#fff0c2','#b4a3ff'];
 const color=colors[room]||colors[0];ctx.save();
 const g=ctx.createRadialGradient(w*.24,h*.12,0,w*.24,h*.12,w*.85);g.addColorStop(0,color+'38');g.addColorStop(1,color+'00');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 if(night>.65){ctx.fillStyle='#17284926';ctx.fillRect(0,0,w,h)}
 const n=[12,24,42,65][quality]||24;
 for(let i=0;i<n;i++){let x=((i*137.53+t*(4+i%5))%w),y=h*(.1+.8*((i*.618033)%1))+Math.sin(t*.6+i)*12;let r=1+i%3*.6;ctx.globalAlpha=.25+.3*(1+Math.sin(t*1.8+i))/2;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
export class Soundscape{
 constructor(){this.ctx=null;this.step=0;this.timer=0;this.noise=null;}
 start(){try{this.ctx??=new AudioContext();this.ctx.resume();if(!this.noise){let b=this.ctx.createBuffer(1,this.ctx.sampleRate*2,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;let s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter();this.amb=this.ctx.createGain();this.amb.gain.value=0;s.buffer=b;s.loop=true;f.type='lowpass';f.frequency.value=450;s.connect(f).connect(this.amb).connect(this.ctx.destination);s.start();this.noise=f;}}catch{}}
 note(freq,vol,duration=.8,type='sine'){if(!this.ctx||!vol||this.ctx.state!=='running')return;let c=this.ctx,o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(Math.max(.0001,vol*.055),t+.045);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g).connect(c.destination);o.start(t);o.stop(t+duration+.02);}
 tick(s,weather,night){if(!this.ctx)return;let master=s.master??.8,active=!document.hidden;this.amb?.gain.setTargetAtTime(active?master*(s.ambient??.25)*(weather===1||weather===3?.045:.012):0,this.ctx.currentTime,.4);if(this.noise)this.noise.frequency.setTargetAtTime(weather===1||weather===3?1200:350,this.ctx.currentTime,.5);if(!active)return;let roots=[261.63,293.66,220,349.23,246.94,196,329.63,174.61],root=roots[s.room]||261.63,notes=[1,1.25,1.5,2,1.5,1.25,1.125,1.5];let v=master*s.music*(night>.65?.65:1);this.note(root*notes[this.step++%8],v,1.6,'sine');if(this.step%4===1)this.note(root*.5,v*.45,2.6,'triangle');}
}
