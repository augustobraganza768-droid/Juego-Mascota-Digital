export const crops=[['Fresa',12,60,24,'🍓'],['Lavanda',18,90,38,'🪻'],['Manzano',30,150,65,'🍎'],['Flor lunar',45,210,95,'🌙']];
export const furniture={decor0:'Dormir',decor2:'Beber',decor6:'Dormir',decor16:'Dormir',decor17:'Comer',decor18:'Bañar',decor19:'Almacenar',decor13:'Vestidor',decor28:'Dormir',decor29:'Dormir',decor8:'Beber'};
export function home(s){return s.home??={grid:true,designs:{},plots:[],floor:0,wall:0,expanded:false,storage:{}}}
export function plant(s,i,now=Date.now()){const h=home(s),c=crops[i];if(!c||s.coins<c[1]||h.plots.length>=(h.expanded?8:4))return false;s.coins-=c[1];h.plots.push({id:now+'-'+Math.random(),crop:i,at:now,water:0});return true}
export function growth(p,now=Date.now()){return Math.min(1,Math.max(0,(now-p.at)/(crops[p.crop][2]*1000)+p.water*.12))}
export function harvest(s,id,now=Date.now()){const h=home(s),p=h.plots.find(p=>p.id===id);if(!p||growth(p,now)<1)return false;s.coins+=crops[p.crop][3];s.harvest=(s.harvest||0)+1;h.plots=h.plots.filter(x=>x!==p);return true}
