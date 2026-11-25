export const islands=[
['Casa de Toby','Mila','Jardinera','Semillas doradas','🌱','Jardín secreto','Jardinería','flower'],
['Refugio del bosque','Olmo','Guardián','Hongos luminosos','🍄','Gruta de luciérnagas','Jardinería','tree'],
['Cabaña del lago','Nerea','Pescadora','Perlas de agua','🐚','Cueva de la cascada','Pescar','pond'],
['Taller de hadas','Lila','Alquimista','Pétalos mágicos','🌸','Jardín de hadas','Cocinar','flower'],
['Observatorio mineral','Ciro','Minerólogo','Cristales violetas','💎','Cámara de runas','Explorar','portal'],
['Refugio nevado','Alba','Montañista','Copos eternos','❄️','Gruta de auroras','Explorar','tree'],
['Torre celestial','Celeste','Cartógrafa','Polvo estelar','⭐','Mirador flotante','Explorar','portal'],
['Templo lunar','Selene','Guardiana','Fragmentos lunares','🌙','Santuario oculto','Explorar','lamp']];
export function world(s){return s.world??={visited:[0],secrets:[],missions:[],resources:{},gathered:{}}}
export function canTravel(s,i,levels){return i>=0&&i<8&&s.level>=levels[i]&&(i===0||world(s).missions.includes(i-1))}
export function gather(s,i,season,now=Date.now()){let w=world(s),key=i+':'+season;if(now-(w.gathered[key]??-Infinity)<60000)return false;w.gathered[key]=now;w.resources[i]=(w.resources[i]||0)+1;return true}
export function quest(s,i){let w=world(s);if(w.missions.includes(i)||!w.secrets.includes(i)||(w.resources[i]||0)<2)return false;w.resources[i]-=2;w.missions.push(i);return true}
