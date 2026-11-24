const $=id=>document.getElementById(id);
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
function rng(seed){let a=1779033703^seed.length;for(let i=0;i<seed.length;i++){a=Math.imul(a^seed.charCodeAt(i),3432918353);a=a<<13|a>>>19}
return function(){a=Math.imul(a^a>>>16,2246822507);a=Math.imul(a^a>>>13,3266489909);a^=a>>>16;return (a>>>0)/4294967296}}
const today=new Date().toLocaleDateString("sv",{timeZone:"America/Mexico_City"});let tag=today;
const shuf=(a,r)=>a.map(x=>[r(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const fits=(p,k)=>k[0]==="c"?p[1].includes(k.slice(2)):p[4].includes(k.slice(2));
const lab=k=>(k[0]==="c"?"":"País: ")+k.slice(2);
const LS={get(k,f){try{const v=JSON.parse(localStorage.getItem(k));return v===null?f:v}catch(e){return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const CFG={grid:{easy:{pool:10,min:5,lives:6},hard:{pool:99,min:2,lives:3}},
bingo:{easy:{pool:12,sl:10,lives:5},hard:{pool:99,sl:6,lives:3}},
wordle:{easy:{top:100,lives:10},hard:{top:400,lives:6}}};
const SLUG={ligamx:"liga-mx",argentina:"liga-argentina",europa:"europa"};
function topClubs(lg,n){const c={};DATA[lg].players.forEach(p=>{if(p[2]>=6)p[1].forEach(x=>c[x]=(c[x]||0)+1)});return Object.keys(c).sort((a,b)=>c[b]-c[a]).slice(0,n)}
const CC={};
function cats(lg){if(CC[lg])return CC[lg];
const P=DATA[lg].players,def=(typeof CATS!=="undefined"&&CATS[lg])||{},cl=[...new Set(P.flatMap(p=>p[1]))],L=[],top=new Set(topClubs(lg,CFG.grid.easy.pool));
const add=(id,label,clubs,test,easy,sub,desc)=>L.push({id,label,clubs:new Set(clubs),test,easy,sub,desc,ty:id[0]});
cl.forEach(c=>add("c|"+c,c,[c],null,top.has(c),"jugó en este club","Jugó en "+c+" (al menos una etapa)."));
(def.derbies||[]).forEach(([n,a,b])=>{if(cl.includes(a)&&cl.includes(b))add("d|"+n,n,[a,b],p=>p[1].includes(a)&&p[1].includes(b),true,"jugó en ambos: "+a+" + "+b,"Jugó en ambos equipos del clásico: "+a+" y "+b+".")});
(def.regions||[]).forEach(([n,cs])=>{const k=cs.filter(c=>cl.includes(c));if(k.length>=2)add("r|"+n,"Clubes de "+n,k,p=>p[1].some(c=>k.includes(c)),true,"jugó en alguno: "+k.slice(0,3).join(", ")+(k.length>3?"…":""),"Jugó en al menos uno de estos clubes de "+n+": "+k.join(", ")+".")});
Object.entries(def.leagues||{}).forEach(([n,cs])=>{const k=cs.filter(c=>cl.includes(c));if(k.length>=2)add("l|"+n,"Jugó en "+n,k,p=>p[1].some(c=>k.includes(c)),true,"en cualquiera de sus clubes","Jugó en al menos un club de "+n+" (de los clubes incluidos en el juego).")});
[["g|<70","Nacidos antes de 1970",y=>y>0&&y<1970,"antes de 1970","Nació antes de 1970."],["g|70","Nacidos en los 70",y=>y>=1970&&y<1980,"1970–1979","Nació entre 1970 y 1979."],["g|80","Nacidos en los 80",y=>y>=1980&&y<1990,"1980–1989","Nació entre 1980 y 1989."],["g|90","Nacidos en los 90",y=>y>=1990&&y<2000,"1990–1999","Nació entre 1990 y 1999."],["g|00","Nacidos desde 2000",y=>y>=2000,"2000 en adelante","Nació en el año 2000 o después."]].forEach(([id,l,f,s,dd])=>add(id,l,[],p=>f(p[3]),true,s,dd));
const nc={};P.forEach(p=>p[4].forEach(c=>nc[c]=(nc[c]||0)+1));const th=Math.max(40,P.length*.02);
Object.keys(nc).filter(c=>nc[c]>=th).forEach(c=>add("n|"+c,"País: "+c,[],p=>p[4].includes(c),nc[c]>=th*2,"nacionalidad","Tiene la nacionalidad de "+c+" (según Wikidata)."));
add("t|3","Trotamundos",[],p=>p[1].length>=3,true,"3 o más clubes distintos","Jugó en 3 o más clubes distintos de los que incluye esta liga.");
const N=L.length,map={};L.forEach((x,i)=>{x.i=i;map[x.id]=x});
const mem=P.map(p=>p[1].map(c=>map["c|"+c].i));
L.filter(x=>x.ty!=="c").forEach(x=>P.forEach((p,j)=>{if(x.test(p))mem[j].push(x.i)}));
const bad=new Uint8Array(N*N);
for(let a=0;a<N;a++)for(let b=a+1;b<N;b++){const x=L[a],y=L[b];let z=x.ty===y.ty&&"gnt".includes(x.ty);if(!z)for(const c of x.clubs)if(y.clubs.has(c)){z=true;break}if(z)bad[a*N+b]=bad[b*N+a]=1}
const pc=new Int32Array(N*N);
mem.forEach(m=>{for(let u=0;u<m.length;u++)for(let v=u+1;v<m.length;v++){const a=m[u],b=m[v];if(!bad[a*N+b]){pc[a*N+b]++;pc[b*N+a]++}}});
return CC[lg]={L,map,pc,N}}
const catOf=id=>cats(lg).map[id];
const catOK=(p,id)=>{const c=catOf(id);return c.ty==="c"?p[1].includes(c.label):c.test(p)};
const dupT=a=>a.some((x,i)=>a.some((y,j)=>i<j&&x.ty===y.ty&&"gnt".includes(x.ty)));
function genGrid(lg,d){const c=CFG.grid[d],{L,pc,N}=cats(lg),r=rng("g"+lg+d+tag),pool=L.filter(x=>d==="hard"||x.easy);
const wsh=a=>a.map(x=>[Math.pow(r(),1/(x.ty==="c"?1:2)),x]).sort((p,q)=>q[0]-p[0]).map(z=>z[1]);
for(let m=c.min;m>=1;m--)for(let t=0;t<4000;t++){const rows=wsh(pool).slice(0,3);if(dupT(rows))continue;
const cand=pool.filter(x=>!rows.includes(x)&&rows.every(y=>pc[y.i*N+x.i]>=m));if(cand.length<3)continue;
const cols=wsh(cand).slice(0,3);if(dupT(cols))continue;return{rows:rows.map(x=>x.id),cols:cols.map(x=>x.id)}}}
function catHead(id){const c=catOf(id),d=h("div","h",c.label);if(c.sub)d.append(h("small","",c.sub));if(c.label.length>15)d.style.fontSize="10.5px";d.title=c.desc;d.style.cursor="pointer";d.onclick=()=>{$("msg").textContent=c.label+": "+c.desc};return d}
function genBingo(lg,d){const c=CFG.bingo[d],pl=DATA[lg].players,r=rng("b"+lg+d+tag),cat={},ok=c.pool>=99?null:new Set(topClubs(lg,c.pool));
pl.forEach((p,i)=>{if(p[2]<c.sl)return;p[1].forEach(x=>{if(!ok||ok.has(x))(cat["c|"+x]=cat["c|"+x]||[]).push(i)});p[4].forEach(x=>(cat["n|"+x]=cat["n|"+x]||[]).push(i))});
const keys=Object.keys(cat).filter(k=>cat[k].length>=6);const ck=keys.filter(k=>k[0]==="c"),nk=keys.filter(k=>k[0]==="n");
for(let t=0;t<3000;t++){const ks=shuf([...shuf(ck,r).slice(0,6),...shuf(nk,r).slice(0,3)],r);if(ks.length<9)continue;
const used=new Set(),ans=[];for(const k of ks){const q=shuf(cat[k],r).find(i=>!used.has(i));if(q===undefined)break;used.add(q);ans.push(q)}
if(ans.length===9)return{keys:ks,players:shuf(ans,r).map(i=>pl[i])}}}
function genWordle(lg,d){const r=rng("w"+lg+d+tag);
const c=DATA[lg].players.filter(p=>p[3]&&p[4].length).sort((a,b)=>b[2]-a[2]).slice(0,CFG.wordle[d].top);return c[Math.floor(r()*c.length)]}
function cmp(g,s){const sh=g[1].filter(c=>s[1].includes(c)),eq=sh.length===s[1].length&&g[1].length===s[1].length,ar=(a,b)=>a<b?" ↑":a>b?" ↓":"";
return[["País",g[4][0]||"?",g[4].some(c=>s[4].includes(c))?"g":"n"],["Clubes",sh.length+"/"+s[1].length,eq?"g":sh.length?"y":"n"],
["Año",g[3]+ar(g[3],s[3]),g[3]===s[3]?"g":Math.abs(g[3]-s[3])<=3?"y":"n"],["Nº clubes",g[1].length+ar(g[1].length,s[1].length),g[1].length===s[1].length?"g":"n"]]}
/*UI*/
const GAMES={grid:["Grid","Completa el 3×3 con jugadores que cumplan las dos categorías."]};
const GAMES_FUTURE={bingo:["Bingo","Coloca cada jugador en la categoría donde encaja."],wordle:["Wordle de jugador","Adivina al jugador secreto del día con pistas."]};
const B=document.body.dataset,SITE=B.site==="1",ROOT=B.root||"";
const l0=LS.get("fj:lg","ligamx");let game=B.game||"grid",lg=B.league||(DATA[l0]?l0:"ligamx"),diff=LS.get("fj:diff","easy"),S,onPick=null;
const D=()=>tag===today?"easy":diff;
const dname=()=>D()==="easy"?"Fácil":"Difícil";
const rnd=()=>"r"+Math.random().toString(36).slice(2,8);
const dk=()=>"fj:dly:"+today+"|"+game+"|"+lg;
const fmt=ms=>{const t=Math.round(ms/1000);return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")};
function lives(){$("lives").textContent=game==="wordle"?"Intentos: "+(S.max-S.lives)+"/"+S.max:"Vidas: "+"❤".repeat(Math.max(S.lives,0))+"🖤".repeat(Math.max(S.max-S.lives,0))}
const FBON=()=>typeof FB!=="undefined"&&FB.projectId&&FB.apiKey;
const FBASE=()=>"https://firestore.googleapis.com/v1/projects/"+FB.projectId+"/databases/(default)/documents";
async function fbTop(path,field,dir,n){const ck="fj:c:"+path+field,c=LS.get(ck,null);if(c&&Date.now()-c.ts<3e5)return c.d;
try{const r=await fetch(FBASE()+"/"+path+":runQuery?key="+FB.apiKey,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({structuredQuery:{from:[{collectionId:"entries"}],orderBy:[{field:{fieldPath:field},direction:dir}],limit:n}})});
const j=await r.json();if(!Array.isArray(j))return null;const d=j.filter(x=>x.document).map(x=>{const f=x.document.fields;return{nick:f.nick.stringValue,v:+f[field].integerValue}});LS.set(ck,{ts:Date.now(),d});return d}catch(e){return null}}
const fv=o=>({fields:Object.fromEntries(Object.entries(o).map(([k,v])=>[k,typeof v==="number"?{integerValue:String(v)}:{stringValue:v}]))});
async function fbSend(path,id,o,update){try{const u=FBASE()+"/"+path+(update?"/"+id+"?updateMask.fieldPaths=nick&updateMask.fieldPaths=n&key=":"?documentId="+id+"&key=")+FB.apiKey;
const r=await fetch(u,{method:update?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(fv(o))});
const ok=r.status===200;if(ok)try{Object.keys(localStorage).filter(k=>k.startsWith("fj:c:")).forEach(k=>localStorage.removeItem(k))}catch(e){}return ok}catch(e){return false}}
const dev=()=>{let d=LS.get("fj:dev",null);if(!d){d="";for(let i=0;i<24;i++)d+=Math.floor(Math.random()*16).toString(16);LS.set("fj:dev",d)}return d};
const BADW=["puto","puta","mierda","pendej","verga","chinga","coño","joder","cabron","culero","nazi","hitler","fuck","shit","porn","pedofil","violad"];
function okNick(n){n=n.trim();if(n.length<3||n.length>12)return"Usa entre 3 y 12 caracteres.";if(!/^[\p{L}\p{N} ._-]+$/u.test(n))return"Solo letras, números, espacio, punto, guion y guion bajo.";
const m=norm(n).replace(/0/g,"o").replace(/[1!]/g,"i").replace(/3/g,"e").replace(/[$5]/g,"s").replace(/[ ._-]/g,"");if(BADW.some(w=>m.includes(w)))return"Elige otro alias.";return""}
function askNick(msg,send){return new Promise(res=>{const w=h("div","nick"),i=h("input"),m=h("div","msg",msg),ok=h("button","btn","Enviar"),no=h("button","btn","Omitir");
i.value=LS.get("fj:nick","");i.maxLength=12;i.placeholder="Tu alias";
ok.onclick=async()=>{const e=okNick(i.value);if(e){m.textContent=e;return}const n=i.value.trim();LS.set("fj:nick",n);ok.disabled=true;const r=await send(n);w.replaceChildren(h("div","msg",r?"¡Listo, ya estás en el ranking!":"No se pudo enviar. Inténtalo más tarde."));res(r)};
no.onclick=()=>{w.remove();res(false)};w.append(m,i,ok,no);$("end").append(w)})}
async function share(){const t="Golazo Diario · "+GAMES[game][0]+" "+DATA[lg].name+" ("+dname()+") "+(tag===today?today:"juego libre")+"\n"+S.res+"\n"+S.emo+"\n"+location.href.split("#")[0];
try{if(navigator.share){await navigator.share({text:t});return}await navigator.clipboard.writeText(t);$("msg").textContent="Resultado copiado."}catch(e){$("msg").textContent="No se pudo compartir."}}
function toMenu(){if(SITE&&B.game){location.href=ROOT||"./"}else{$("play").hidden=true;$("home").hidden=false;fillTables();scrollTo(0,0)}}
function btns(sh){const d=h("div","btns");if(sh){const a=h("button","btn","Compartir");a.onclick=share;d.append(a)}
const n=h("button","btn","Partida nueva, ¡acumula racha!");n.onclick=()=>{tag=rnd();start()};const m=h("button","btn","Volver al menú principal");m.onclick=toMenu;d.append(n,m);return d}
async function end(t,win){S.done=true;$("box").hidden=true;$("extra").innerHTML="";S.res=t;
S.emo=game==="wordle"?S.rows.map(r=>r[1].map(x=>({g:"🟩",y:"🟨",n:"⬜"})[x[2]]).join("")).join("\n"):[0,1,2].map(i=>S.cells.slice(i*3,i*3+3).map(c=>c?"🟩":"⬛").join("")).join("\n");
const daily=tag===today,ms=Date.now()-S.t0,errs=game==="wordle"?Math.max(S.rows.length-1,0):S.max-S.lives,e=h("div","end");
$("end").innerHTML="";$("end").append(e);e.append(h("b","",t+(win?" · "+fmt(ms):"")),h("br"));
if(daily){LS.set(dk(),{w:win,ms});const key="daily/"+today+"_"+game+"_"+lg,score=ms*10+Math.min(errs,9);
if(win&&FBON()&&ms>=3000){const top=await fbTop(key,"score","ASCENDING",5);
if(top&&(top.length<5||score<top[top.length-1].v))await askNick("¡Entraste al top del día! Escribe tu alias para el ranking.",n=>fbSend(key+"/entries",dev(),{nick:n,score}))}}
else{const s=LS.get("fj:st:"+game,{cur:0,best:0});s.cur=win?s.cur+1:0;s.best=Math.max(s.best,s.cur);LS.set("fj:st:"+game,s);
e.append(h("small","","Racha actual: "+s.cur+" · Mejor racha: "+s.best),h("br"));
if(win&&FBON()){const sb=LS.get("fj:sb:"+game,0),top=await fbTop("streaks/"+game,"n","DESCENDING",5);
if(top&&s.cur>sb&&(top.length<5||s.cur>top[top.length-1].v))await askNick("¡Racha de "+s.cur+"! Entras al top de rachas. Escribe tu alias.",async n=>{const ok=await fbSend("streaks/"+game+"/entries",dev(),{nick:n,n:s.cur},sb>0);if(ok)LS.set("fj:sb:"+game,s.cur);return ok})}}
e.append(btns(true))}
function locked(d){S={done:true,max:1,lives:1};lives();$("board").innerHTML="";const e=h("div","end");
e.append(h("b","","Ya jugaste el reto de hoy"),h("br"),h("small","",d.w?"Lo completaste en "+fmt(d.ms):"Hoy no lo lograste"),h("br"),btns(false));$("end").append(e)}
function start(){$("end").innerHTML="";$("extra").innerHTML="";$("box").hidden=true;$("msg").textContent="";$("date").textContent=DATA[lg].name+" · "+dname()+" · "+(tag===today?"Reto diario "+today:"Juego libre");
[...$("diff").children].forEach(x=>x.classList.toggle("on",x.dataset.d===D()));$("diff").hidden=tag===today;
if(tag===today){const d=LS.get(dk(),null);if(d){locked(d);return}}
({grid:gGrid,bingo:gBingo,wordle:gWordle})[game]();S.t0=Date.now()}
function gGrid(){S={g:genGrid(lg,D()),cells:Array(9).fill(null),used:new Set(),lives:CFG.grid[D()].lives,max:CFG.grid[D()].lives,sel:null,done:false};
$("msg").textContent="Toca una casilla y elige un jugador que cumpla las dos categorías.";
onPick=p=>{if(S.done)return;const k=S.sel,row=S.g.rows[Math.floor(k/3)],col=S.g.cols[k%3];
if(S.used.has(p)){$("msg").textContent="Ese jugador ya está en el tablero.";return}
if(catOK(p,row)&&catOK(p,col)){S.cells[k]=p[0];S.used.add(p);S.sel=null;$("box").hidden=true;$("msg").textContent="¡Correcto!"}
else{S.lives--;$("msg").textContent=p[0]+" no encaja en esa casilla."}
drawGrid();const n=S.cells.filter(Boolean).length;if(n===9||S.lives<=0)end(n+"/9 aciertos",n===9)};drawGrid()}
function drawGrid(){lives();const b=h("div","grid g4");b.append(h("div","h"));S.g.cols.forEach(c=>b.append(catHead(c)));
S.g.rows.forEach((r,i)=>{b.append(catHead(r));for(let j=0;j<3;j++){const k=i*3+j,v=S.cells[k],d=h("div","c"+(v?" ok":"")+(S.sel===k?" sel":""),v||"");
d.onclick=()=>{if(v||S.done)return;S.sel=k;$("box").hidden=false;$("q").value="";$("sug").innerHTML="";$("q").focus();drawGrid()};b.append(d)}});
$("board").innerHTML="";$("board").append(b)}
function gBingo(){const g=genBingo(lg,D()),l=CFG.bingo[D()].lives;S={keys:g.keys,pl:g.players,i:0,cells:Array(9).fill(null),lives:l,max:l,done:false};drawBingo()}
function bEnd(){const n=S.cells.filter(Boolean).length;end(n+"/9 colocados",n===9)}
function drawBingo(){lives();const b=h("div","grid g3"),p=S.pl[S.i];
S.keys.forEach((k,j)=>{const d=h("div","c"+(S.cells[j]?" ok":""));d.append(h("small","",lab(k)));if(S.cells[j])d.append(h("span","",S.cells[j]));
d.onclick=()=>{if(S.done||S.cells[j])return;if(fits(p,k)){S.cells[j]=p[0];$("msg").textContent="¡Correcto!";nextB()}else{S.lives--;$("msg").textContent=p[0]+" no encaja ahí.";if(S.lives<=0){drawBingo();return bEnd()}drawBingo()}};b.append(d)});
$("board").innerHTML="";$("board").append(b);const e=$("extra");e.innerHTML="";
if(!S.done){const c=h("div","cur");c.append(h("div","","Jugador "+(S.i+1)+"/9: "),h("b","",p[0]));const s=h("button","btn","Saltar (−1 vida)");
s.onclick=()=>{S.lives--;if(S.lives<=0){drawBingo();return bEnd()}nextB()};c.append(h("br"),s);e.append(c)}}
function nextB(){S.i++;if(S.i>=9||S.cells.every(Boolean)){drawBingo();return bEnd()}drawBingo()}
function gWordle(){const l=CFG.wordle[D()].lives;S={sec:genWordle(lg,D()),rows:[],lives:l,max:l,done:false};$("box").hidden=false;$("q").value="";$("sug").innerHTML="";
$("extra").append(h("div","msg","Verde = coincide · amarillo = cerca · ↑/↓ = el secreto tiene un valor mayor/menor."));
onPick=p=>{if(S.done)return;if(S.rows.some(r=>r[2]===p)){$("msg").textContent="Ya lo probaste.";return}
S.rows.push([p[0]+(p[3]?" · "+p[3]:""),cmp(p,S.sec),p]);S.lives--;$("msg").textContent="";drawWordle();
if(p===S.sec)end("¡Era "+p[0]+"! En "+S.rows.length+" intentos",true);else if(S.lives<=0)end("Era "+S.sec[0],false)};drawWordle()}
function drawWordle(){lives();const b=h("div");S.rows.forEach(r=>{const d=h("div","row");d.append(h("b","",r[0]));const c=h("div","chips");
r[1].forEach(x=>{const k=h("div","chip "+x[2],x[1]);k.prepend(h("small","",x[0]));c.append(k)});d.append(c);b.append(d)});$("board").innerHTML="";$("board").append(b)}
$("q").oninput=e=>{const v=norm(e.target.value.trim()),s=$("sug");s.innerHTML="";if(v.length<2||!onPick)return;
DATA[lg].players.filter(p=>{const nm=p.n||(p.n=norm(p[0]));return v.split(/\s+/).every(t=>nm.includes(t))}).sort((a,b)=>b[2]-a[2]).slice(0,8).forEach(p=>{const b=h("button","",p[0]+(p[3]?" · "+p[3]:""));b.onclick=()=>{$("sug").innerHTML="";$("q").value="";onPick(p)};s.append(b)})};
function openGame(g,daily){if(SITE&&!B.game){location.href=ROOT+g+"/"+SLUG[lg]+"/"+(daily?"#reto":"");return}
game=g;tag=daily?today:rnd();$("home").hidden=true;$("play").hidden=false;$("ttl").textContent=GAMES[g][0];start()}
$("back").onclick=toMenu;
async function fillTables(){const fill=(id,d,fn,empty)=>{const t=$(id);if(!t)return;t.innerHTML="";if(!FBON()){t.append(h("div","emp","Ranking pronto"));return}
if(!d){t.append(h("div","emp","Sin conexión"));return}if(!d.length){t.append(h("div","emp",empty));return}
d.forEach((x,i)=>{const r=h("div");r.append(h("span","",(i+1)+". "+x.nick),h("span","",fn(x.v)));t.append(r)})};
await Promise.all(Object.keys(GAMES).map(async g=>{if(!FBON()){fill("t-"+g);fill("s-"+g);return}
fill("t-"+g,await fbTop("daily/"+today+"_"+g+"_"+lg,"score","ASCENDING",5),v=>fmt(Math.floor(v/10)),"Sé el primero");
fill("s-"+g,await fbTop("streaks/"+g,"n","DESCENDING",5),v=>String(v),"Sin rachas aún")}))}
function buildHome(){const c=$("cards");c.innerHTML="";const lt=h("div","tabs");
Object.keys(DATA).forEach(k=>{const b=h("button","tab"+(k===lg?" on":""),DATA[k].name);b.onclick=()=>{lg=k;LS.set("fj:lg",k);[...lt.children].forEach(x=>x.classList.toggle("on",x===b));fillTables()};lt.append(b)});
const cols=h("div","cols one"),sc=h("div","cols one");
Object.keys(GAMES).forEach(g=>{const col=h("div","col"),sq=h("button","sq",GAMES[g][0]);sq.onclick=()=>openGame(g,false);
const rd=h("button","btn rd","Reto diario");rd.onclick=()=>openGame(g,true);const t=h("div","tbl");t.id="t-"+g;col.append(sq,rd,h("div","hn","Más rápidos hoy"),t);cols.append(col);
const c2=h("div","col"),t2=h("div","tbl");t2.id="s-"+g;c2.append(h("div","hn",GAMES[g][0]),t2);sc.append(c2)});
c.append(lt,cols,h("div","hsec","Rachas más largas"),sc);fillTables()}
Object.keys(DATA).forEach(k=>{const b=h("button","tab"+(k===lg?" on":""),DATA[k].name);
b.onclick=()=>{if(SITE&&B.game){location.href=ROOT+game+"/"+SLUG[k]+"/"+(tag===today?"#reto":"");return}lg=k;LS.set("fj:lg",k);[...$("tabs").children].forEach(x=>x.classList.toggle("on",x===b));if(!$("play").hidden)start()};$("tabs").append(b)});
[["easy","Fácil"],["hard","Difícil"]].forEach(([d,n])=>{const b=h("button","tab",n);b.dataset.d=d;b.onclick=()=>{diff=d;tag=rnd();LS.set("fj:diff",d);start()};$("diff").append(b)});

const root=document.documentElement,mq=window.matchMedia?matchMedia("(prefers-color-scheme: dark)"):{matches:false};
const isDark=()=>root.dataset.theme?root.dataset.theme==="dark":mq.matches;
const st0=LS.get("fj:theme",null);if(st0)root.dataset.theme=st0;
const hd=h("header","top"),lo=h("a","logo"),tb=h("button","themebtn");
lo.href=ROOT||"./";lo.append(h("span","lg1","Golazo"),h("span","lg2"," Diario"));
lo.onclick=e=>{if(B.game)return;e.preventDefault();toMenu()};
const paint=()=>{tb.textContent=isDark()?"🌙 Oscuro":"☀️ Claro";tb.title=isDark()?"Modo oscuro activo. Toca para cambiar a claro":"Modo claro activo. Toca para cambiar a oscuro";tb.setAttribute("aria-label",isDark()?"Cambiar a modo claro":"Cambiar a modo oscuro")};
tb.onclick=()=>{const n=isDark()?"light":"dark";root.dataset.theme=n;LS.set("fj:theme",n);paint()};
const LOGO='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="36" height="36" role="img" aria-label="Golazo Diario"><clipPath id="gdcp"><rect width="120" height="120" rx="26"/></clipPath><g clip-path="url(#gdcp)"><rect width="60" height="120" fill="#4169E1"/><rect x="60" width="60" height="120" fill="#0b0b0b"/></g><g fill="none" stroke="#fff" stroke-width="10"><path d="M47.2 47.95A21 21 0 1 0 51 60H31"/><path d="M75 39H85A21 21 0 0 1 85 81H75Z"/></g></svg>';
const hr=h("div","hr"),mk=h("a","mk");mk.href=ROOT||"./";mk.setAttribute("aria-label","Golazo Diario");mk.innerHTML=LOGO;mk.onclick=lo.onclick;
paint();hr.append(tb,mk);hd.append(lo,hr);document.querySelector("main").prepend(hd);

const EMAIL="contacto@golazodiario.lat";
const PAGES={
about:["Acerca de","<p><b>Golazo Diario</b> es una colección gratuita de retos de fútbol (Grid, Bingo y Wordle) con jugadores de Liga MX, Liga Argentina y las principales ligas de Europa. Hay un reto diario y partidas ilimitadas.</p>"],
privacy:["Aviso de privacidad","<p>Tus partidas, rachas y alias se guardan en tu navegador. Si decides enviar un alias a un ranking, guardamos tu alias y tu resultado. No pedimos registro ni datos personales.</p>"],
contact:["Contacto","<p>¿Dudas, ideas o propuestas? Escríbenos a:</p><p><a href=\"mailto:"+EMAIL+"\">"+EMAIL+"</a></p>"]};
function panel(title,node){const ov=h("div","ov"),p=h("div","pn"),x=h("button","btn","Cerrar"),t=h("b","",title);
x.onclick=()=>ov.remove();ov.onclick=e=>{if(e.target===ov)ov.remove()};p.append(t,node,x);ov.append(p);document.body.append(ov)}
function report(){const w=h("div"),d=h("p","","Cuéntanos qué jugadores están mal (nombre, club o país) o cuáles faltan."),
ta=h("textarea");ta.placeholder="Escribe aquí qué jugadores están mal o cuáles faltan. Ejemplo: «Liga MX: falta Cuauhtémoc Blanco».";ta.rows=5;
const m=h("div","msg"),s=h("button","btn","Enviar por correo");
s.onclick=()=>{const v=ta.value.trim();if(!v){m.textContent="Escribe primero qué está mal o qué falta.";return}
location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Reporte de datos – "+DATA[lg].name)+"&body="+encodeURIComponent(v)};
w.append(d,ta,m,s);panel("Reportar un error",w)}
const ft=h("div","foot");
const PG={about:"acerca/",privacy:"privacidad/",contact:"contacto/",report:"reportar/"};
function openTab(k){const c=k==="report"?null:PAGES[k];
const body=k==="report"?'<p>Cuéntanos qué jugadores están mal (nombre, club o país) o cuáles faltan.</p><textarea id=t rows=6 placeholder="Escribe aquí qué jugadores están mal o cuáles faltan. Ejemplo: Liga MX: falta Cuauhtémoc Blanco."></textarea><p><button onclick="var v=document.getElementById(\'t\').value.trim();if(!v){alert(\'Escribe primero qué está mal o qué falta.\');return}location.href=\'mailto:'+EMAIL+'?subject=\'+encodeURIComponent(\'Reporte de datos\')+\'&body=\'+encodeURIComponent(v)">Enviar por correo</button></p>':c[1];
const t=k==="report"?"Reportar un error":c[0];
const w=window.open("","_blank");if(!w){const d=h("div");d.innerHTML=body;panel(t,d);return}
w.document.write('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>'+t+' | Golazo Diario</title><body style="font:16px/1.55 system-ui;max-width:640px;margin:0 auto;padding:20px"><h1>'+t+'</h1>'+body+'<textarea style=display:none></textarea>');w.document.close()}
[["about","Acerca de"],["privacy","Aviso de privacidad"],["contact","Contacto"],["report","Reportar un error"]].forEach(([k,n])=>{let a;
if(SITE){a=h("a","fl",n);a.href=ROOT+PG[k];a.target="_blank";a.rel="noopener"}
else{a=h("button","fl",n);a.onclick=()=>openTab(k)}
ft.append(a)});
document.querySelector("main").append(ft);
if(B.game){game=B.game;tag=location.hash==="#reto"?today:rnd();$("home").hidden=true;$("play").hidden=false;$("ttl").textContent=GAMES[game][0];start()}else buildHome();
