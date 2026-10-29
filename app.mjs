import { assess } from './geometry.mjs';
const defaults = {length:200,width:80,door:90,corridorA:100,corridorB:100,uncertainty:2,margin:0};
const form = document.querySelector('#form'), svg = document.querySelector('#diagram');
const fields = Object.keys(defaults);
function values(){ return Object.fromEntries(fields.map(k => [k, form.elements[k].value === '' ? NaN : Number(form.elements[k].value)])); }
function setValues(p){ for (const k of fields) form.elements[k].value = p[k]; update(); }
function update(){
  const p=values();
  try {
    const r=assess(p); document.querySelector('#error').textContent='';
    document.querySelector('#result').textContent=r.reasons.length?'Ruled out in this model':'Unknown';
    document.querySelector('#explanation').textContent=r.reasons.length?r.reasons.join(' ')+' This only describes the idealized model.':'No necessary condition failed. This does not demonstrate a route or a fit.';
    const f=n=>Number(n.toPrecision(5));
    svg.innerHTML=`<path d="M40 275 H310 V70 H480 V275 H555 V365 H40 Z" fill="#e1eee6" stroke="#7b9f90" stroke-width="3"/><path d="M40 275 H310 V70 M480 70 V275 H555 M40 365 H555" fill="none" stroke="#648d7e" stroke-width="4"/><path d="M88 275 V365 M180 275 V365" stroke="#668b7c" stroke-width="4"/><path d="M90 288 H178 M90 282 V294 M178 282 V294" stroke="#6d8e82"/><text x="95" y="310" fill="#476b5e" font-size="14">Door ${f(p.door)}</text><text x="168" y="345" fill="#476b5e" font-size="14">Corridor A ${f(p.corridorA)}</text><text x="329" y="145" fill="#476b5e" font-size="14">Corridor B ${f(p.corridorB)}</text><rect x="62" y="95" width="165" height="63" rx="4" fill="#aacdc0" stroke="#557e70" stroke-width="2"/><rect x="55" y="88" width="179" height="77" rx="5" fill="none" stroke="#729b8c" stroke-dasharray="5 4"/><text x="65" y="188" fill="#476b5e" font-size="14">Item ${f(p.length)} × ${f(p.width)}</text><text x="65" y="208" fill="#718b80" font-size="12">Margin ${f(p.margin)} · uncertainty ±${f(p.uncertainty)}</text><text x="65" y="230" fill="#718b80" font-size="12">Illustrative, not to scale</text>`;
  } catch(e){ document.querySelector('#error').textContent=e.message; document.querySelector('#result').textContent='Unknown'; document.querySelector('#explanation').textContent='Complete valid measurements to run the check.'; svg.innerHTML=''; }
}
form.addEventListener('input',update);
document.querySelector('#save').addEventListener('click',()=>{try{const p=values();assess(p);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({version:1,...p},null,2)],{type:'application/json'}));a.download='pivot-project.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}catch(e){document.querySelector('#error').textContent=e.message;}});
document.querySelector('#open').addEventListener('click',()=>document.querySelector('#file').click());
document.querySelector('#file').addEventListener('change',async e=>{try{const p=JSON.parse(await e.target.files[0].text());if(p.version!==1) throw Error('Unsupported project version.');assess(p);setValues(p);}catch(err){document.querySelector('#error').textContent='Cannot open project: '+err.message;}e.target.value='';});
document.querySelector('#print').addEventListener('click',()=>window.print());
setValues(defaults);
