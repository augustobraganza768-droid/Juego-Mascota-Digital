const record=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const finite=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
export function validate(v){
 if(!record(v)||!finite(v.coins,0,Number.MAX_SAFE_INTEGER)||!Number.isInteger(v.level)||!finite(v.level,1,50)||!record(v.needs)||!record(v.items)||!Array.isArray(v.decor))return false;
 if(v.room!==undefined&&(!Number.isInteger(v.room)||!finite(v.room,0,7)))return false;
 if(v.pet!==undefined&&!['Toby','Luna','Bruno','Mochi','Nube','Kitsu','Musgo','Aura'].includes(v.pet))return false;
 if(!Object.values(v.needs).every(n=>finite(n,0,100))||!Object.values(v.items).every(n=>Number.isSafeInteger(n)&&n>=0))return false;
 if(!v.decor.every(d=>record(d)&&typeof d.type==='string'&&finite(d.x,0,8)&&finite(d.y,0,8)&&Number.isInteger(d.room)&&finite(d.room,0,7)))return false;
 for(const k of ['outfits','presets','profiles','records','preferences'])if(v[k]!==undefined&&!record(v[k]))return false;
 for(const k of ['favorites','unlockedSkills','memories','tricks','found','companions'])if(v[k]!==undefined&&!Array.isArray(v[k]))return false;
 if(v.outfits&&Object.values(v.outfits).some(o=>!record(o)))return false;
 if(v.home&&(!record(v.home)||!Array.isArray(v.home.plots)||!record(v.home.storage)||!record(v.home.designs)||!v.home.plots.every(p=>record(p)&&Number.isInteger(p.crop)&&finite(p.crop,0,3)&&finite(p.at,0,Number.MAX_SAFE_INTEGER)&&finite(p.water,0,3))))return false;
 if(v.world&&(!record(v.world)||!['visited','secrets','missions'].every(k=>Array.isArray(v.world[k]))||!record(v.world.resources)||!record(v.world.gathered)))return false;
 for(const k of ['music','sfx','ambient','master'])if(v[k]!==undefined&&!finite(v[k],0,1))return false;
 if(v.quality!==undefined&&(!Number.isInteger(v.quality)||!finite(v.quality,0,3)))return false;
 return true;
}
export function parse(raw){try{const v=JSON.parse(raw);return validate(v)?v:null}catch{return null}}
export function backups(storage,slot){try{const b=JSON.parse(storage.getItem('puppilove4-backup-'+slot));return Array.isArray(b)?b.filter(validate).slice(0,5):[]}catch{return []}}
export function recover(storage,slot,initial){try{const v=parse(storage.getItem('puppilove4-'+slot))||backups(storage,slot)[0]||(slot===0?parse(storage.getItem('puppilove3')):null);if(v)return {...structuredClone(initial),...v,needs:{...initial.needs,...v.needs}}}catch{}return structuredClone(initial)}
export function persist(storage,slot,state){try{if(!validate(state))return false;const key='puppilove4-'+slot,raw=storage.getItem(key),next=JSON.stringify(state);if(raw===next)return true;const old=parse(raw);if(old)storage.setItem('puppilove4-backup-'+slot,JSON.stringify([old,...backups(storage,slot)].slice(0,5)));storage.setItem(key,next);return true}catch{return false}}
