import {products,slots} from './data.js';
export const rarity=['Común','Poco común','Raro','Épico','Legendario','Mítico'];
export const colors=['#e8a1b5','#a9a0e6','#83bd94','#76c8d9','#f1c66b','#a6d6a0'];
export function meta(id){const p=products.find(x=>x[0]===id&&x[3]==='accessory');if(!p)return null;const m=/^acc(\d)-(\d)$/.exec(id),tier=m?Number(m[1]):0;return {id,name:p[1],slot:p[4],tier,color:colors[tier],benefit:tier%3===1?'xp':tier%3===2?'coins':'care',amount:tier===0?0:5+tier*3};}
export const tree=[['care1','Cuidador','care',10,1,null],['care2','Manos mágicas','care',15,2,'care1'],['care3','Guardián','care',20,3,'care2'],['nature1','Recolector','coins',10,1,null],['nature2','Abundancia','coins',15,2,'nature1'],['nature3','Tesoro natural','coins',20,3,'nature2'],['explore1','Explorador','xp',10,1,null],['explore2','Cartógrafo','xp',15,2,'explore1'],['explore3','Viajero celestial','xp',20,3,'explore2']];
export function normalize(s){s.outfits??={};s.presets??={};s.unlockedSkills??=[];s.favorites??=[];if(s.equipped&&!s.outfits[s.pet]&&meta(s.equipped)&&s.items[s.equipped]>0)s.outfits[s.pet]={[meta(s.equipped).slot]:s.equipped};s.equipped='';for(const [pet,o] of Object.entries(s.outfits))for(const k of Object.keys(o))if(meta(o[k])?.slot!==k||!(s.items[o[k]]>0))delete o[k];return s;}
export function available(s,id){return (s.items[id]||0)-Object.entries(s.outfits).filter(([p,o])=>p!==s.pet&&Object.values(o).includes(id)).length>0;}
export function equip(s,id){const m=meta(id);if(!m||!available(s,id))return false;const o=s.outfits[s.pet]??={};if(o[m.slot]===id)delete o[m.slot];else o[m.slot]=id;return true;}
export function unlock(s,id){const n=tree.find(x=>x[0]===id);if(!n||s.unlockedSkills.includes(id)||s.skills<n[4]||(n[5]&&!s.unlockedSkills.includes(n[5])))return false;s.skills-=n[4];s.unlockedSkills.push(id);return true;}
export function bonus(s,type){return 1+(tree.filter(n=>n[2]===type&&s.unlockedSkills.includes(n[0])).reduce((a,n)=>a+n[3],0)+Object.values(s.outfits[s.pet]||{}).map(meta).filter(m=>m?.benefit===type).reduce((a,m)=>a+m.amount,0))/100;}
// Coordinates in the original 240 × 224 SVG viewBox, shared by every pet.
export function drawGear(ctx,outfit,time=0,layer='front',pet='Toby'){
 ctx.save();ctx.translate(-60,-105);ctx.scale(.5,.5);
 for(const k of (layer==='back'?['back']:['body','paws','neck','head'])){
 const m=meta(outfit?.[k]);if(!m)continue;
 ctx.save();ctx.fillStyle=m.color;ctx.strokeStyle='#745575';ctx.lineWidth=3;ctx.lineJoin='round';
 if(m.tier>=3){ctx.shadowColor=m.color;ctx.shadowBlur=8;}
 const shape=pts=>{ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.stroke()};
 const oval=(x,y,a,b)=>{ctx.beginPath();ctx.ellipse(x,y,a,b,0,0,Math.PI*2);ctx.fill();ctx.stroke()};
 if(k==='head'){
 ctx.translate(125,35);
 if(m.id==='hat'){shape([[-44,0],[-10,-67],[13,-45],[38,0]]);oval(0,0,51,8);ctx.fillStyle='#ffe3a1';oval(-3,-27,6,6);}
 else{shape([[-43,0],[-47,-32],[-22,-17],[0,-43],[22,-17],[47,-32],[43,0]]);ctx.fillStyle='#fff0ba';oval(0,-12,6,8);}
 }
 if(k==='neck'){ctx.strokeStyle=m.color;ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(80,153);ctx.quadraticCurveTo(125,178,172,153);ctx.stroke();if(m.id==='bandana')shape([[96,161],[154,161],[125,191]]);else oval(125,169,8,9);}
 if(k==='body')shape([[66,159],[91,166],[159,166],[180,159],[184,189],[150,196],[104,196],[62,186]]);
 if(k==='back'){for(const side of [-1,1]){ctx.save();ctx.translate(125+side*48,165);ctx.scale(side,1);ctx.rotate(Math.sin(time*5)*.09);shape([[0,0],[26,-52],[64,-72],[59,-40],[75,-47],[61,-15],[42,5],[15,12]]);ctx.restore();}}
 if(k==='paws')for(const x of [79,169])oval(x,204,17,9);
 ctx.restore();
 }ctx.restore();
}
export function preview(canvas,img,outfit){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);if(!img?.complete||!img.naturalWidth)return;c.save();c.translate(canvas.width/2,158);c.scale(1.05,1.05);drawGear(c,outfit,0,'back');c.drawImage(img,-60,-105,120,112);drawGear(c,outfit);c.restore();}
