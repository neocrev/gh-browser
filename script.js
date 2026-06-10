/* ============================================================
   gh-browser — GitHub repository browser
   ============================================================ */

const API = 'https://api.github.com';
const RAW = 'https://raw.githubusercontent.com';
const GB = 1024**3; const MB = 1024**2; const KB = 1024;

/* ─── Utilities ─── */
function qs(s){return document.querySelector(s)}
function qsa(s){return document.querySelectorAll(s)}
function el(t,a,...c){let e=document.createElement(t);for(let k in a)e.setAttribute(k,a[k]);c.forEach(ch=>e.append(ch));return e}

function humanSize(n){
  if(!n||n<0)return '?'; n=+n;
  for(const u of['B','KB','MB','GB','TB']){if(n<1024)return u==='B'?`${n} B`:`${n.toFixed(1)} ${u}`;n/=1024}
  return `${n.toFixed(1)} TB`;
}

function storage(k,v){if(v!==void 0){localStorage.setItem('ghb_'+k,JSON.stringify(v));return}v=localStorage.getItem('ghb_'+k);try{return JSON.parse(v)}catch{return v||null}}

/* ─── SVG icons (inline) ─── */
const ICONS={
  folder:`<svg viewBox="0 0 24 24" fill="none" stroke="#89a0c2" stroke-width="1.8" stroke-linecap="round"><path d="M4 20h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-7.5L9.87 4.13A1 1 0 0 0 9.17 4H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1z"/></svg>`,
  file:`<svg viewBox="0 0 24 24" fill="none" stroke="#c0caf5" stroke-width="1.8" stroke-linecap="round"><path d="M14 2H6a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 2v6h6"/></svg>`,
  image:`<svg viewBox="0 0 24 24" fill="none" stroke="#bb9af7" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8.5" cy="9.5" r="2.5"/><path d="m2 17 5-4 3 3 5-5 7 6"/></svg>`,
  audio:`<svg viewBox="0 0 24 24" fill="none" stroke="#e0af68" stroke-width="1.8" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  video:`<svg viewBox="0 0 24 24" fill="none" stroke="#ff9e64" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/></svg>`,
  archive:`<svg viewBox="0 0 24 24" fill="none" stroke="#7ecb8b" stroke-width="1.8" stroke-linecap="round"><path d="M4 4h16v3H4z"/><rect x="4" y="7" width="16" height="13" rx="1"/><path d="M12 11v4m-2-2h4"/></svg>`,
  pdf:`<svg viewBox="0 0 24 24" fill="none" stroke="#f7768e" stroke-width="1.8" stroke-linecap="round"><path d="M14 2H6a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>`,
  code:`<svg viewBox="0 0 24 24" fill="none" stroke="#b4f9f8" stroke-width="1.8" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  star:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  fork:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
  repo:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>`,
  download:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  left:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>`,
};

function fileIcon(name){
  const ext = name.split('.').pop().toLowerCase();
  if(!ext||name==='')return ICONS.file;
  if(['jpg','jpeg','png','gif','webp','svg','bmp','ico','avif','heic','tiff'].includes(ext))return ICONS.image;
  if(['mp3','flac','ogg','wav','aac','m4a','opus','wma'].includes(ext))return ICONS.audio;
  if(['mp4','mkv','avi','mov','webm','wmv','flv'].includes(ext))return ICONS.video;
  if(['zip','tar','gz','bz2','xz','7z','rar','zst'].includes(ext))return ICONS.archive;
  if(['pdf'].includes(ext))return ICONS.pdf;
  if(['py','js','ts','rs','go','c','cpp','h','hpp','java','rb','php','swift','kt','scala','m','mm','sh','bash','zsh','fish','pl','lua','r','sql','graphql','css','scss','less','html','htm','xml','yaml','yml','json','toml','ini','cfg','conf','md','rst','txt','env','gitignore','dockerfile','makefile'].includes(ext))return ICONS.code;
  return ICONS.file;
}

/* ─── State ─── */
let state={owner:'',repo:'',branch:'',path:''};
let repoData=null;
let fileCache={};

/* ─── DOM refs ─── */
const $=id=>document.getElementById(id);
const inp=qs('#gh-input');
const goBtn=qs('#gh-go');
const statusEl=qs('#status');
const mainEl=qs('#main');
const recentEl=qs('#recent');

/* ─── GitHub API ─── */
const token=storage('token');
const headers={Accept:'application/vnd.github.v3+json'};
if(token)headers.Authorization=`Bearer ${token}`;
let rateLimit={remaining:60,reset:0};

async function ghFetch(url){
  const r=await fetch(url,{headers});
  if(r.headers.get('X-RateLimit-Remaining')){
    rateLimit.remaining=+r.headers.get('X-RateLimit-Remaining');
    rateLimit.reset=+r.headers.get('X-RateLimit-Reset');
  }
  if(!r.ok){
    const msg=await r.json().catch(()=>({message:r.statusText}));
    const err=new Error(msg.message||r.statusText);
    err.status=r.status;throw err;
  }
  return r.json();
}

function updateRateInfo(){
  const d=new Date(rateLimit.reset*1000);
  const pad=n=>String(n).padStart(2,'0');
  const time=d?`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`:'?';
  qsa('.rate-info').forEach(el=>{el.textContent=`API: ${rateLimit.remaining} req left (reset ${time})`});
}

/* ─── Load repo ─── */
async function loadRepo(input){
  input=input.trim().replace(/https?:\/\/github\.com\//,'').replace(/\/$/,'');
  const parts=input.split('/');
  if(parts.length<2){setStatus('Формат: owner/repo или ссылка на GitHub','error');return}
  const [owner,repoName]=parts;
  setStatus('Загрузка информации о репозитории…','loading');
  goBtn.disabled=true;
  try{
    const repo=await ghFetch(`${API}/repos/${owner}/${repoName}`);
    repoData=repo;
    state={owner,repo:repoName,branch:repo.default_branch,path:''};
    saveRecent(`${owner}/${repoName}`);
    setStatus('','');
    render();
  }catch(e){
    if(e.status===404)setStatus(`Репозиторий ${owner}/${repoName} не найден`,'error');
    else if(e.status===403)setStatus(`Лимит API: ${e.message}. Добавьте токен в localStorage: storage('token','ghp_...')`,'error');
    else setStatus(`Ошибка: ${e.message}`,'error');
  }finally{goBtn.disabled=false}
}

async function navigate(path){
  if(path===state.path)return;
  state.path=path;
  setStatus('Загрузка…','loading');
  try{render()}catch(e){setStatus(`Ошибка: ${e.message}`,'error')}
}

/* ─── Render ─── */
function render(){
  updateRateInfo();
  renderRepoHeader();
  renderBreadcrumb();
  renderContent();
}

function renderRepoHeader(){
  if(!repoData)return;
  const h=qs('#repo-header');
  if(!h)return;
  h.style.display='flex';
  const avatar=h.querySelector('.avatar');
  avatar.src=repoData.owner.avatar_url+'&s=80';
  avatar.alt=repoData.owner.login;
  h.querySelector('h2').innerHTML=`<a href="${repoData.html_url}" target="_blank">${repoData.full_name}</a>`;
  h.querySelector('p').textContent=repoData.description||'';
  h.querySelector('.stars').innerHTML=`${ICONS.star} <span class="num">${(repoData.stargazers_count||0).toLocaleString()}</span>`;
  h.querySelector('.forks').innerHTML=`${ICONS.fork} <span class="num">${(repoData.forks_count||0).toLocaleString()}</span>`;
}

function renderBreadcrumb(){
  const el=qs('#breadcrumb');
  if(!el)return;
  const parts=state.path?state.path.split('/'):[];
  let html=`<a data-path="">${state.repo}</a>`;
  let acc='';
  for(let i=0;i<parts.length;i++){
    acc+=(i? '/' :'')+parts[i];
    const name=parts[i];
    if(i===parts.length-1)html+=`<span class="sep">/</span><span class="current">${name}</span>`;
    else html+=`<span class="sep">/</span><a data-path="${acc}">${name}</a>`;
  }
  el.innerHTML=html;
  el.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navigate(a.dataset.path)));
}

async function renderContent(){
  const root=qs('#content');
  root.innerHTML='';
  if(!state.path){
    await renderTree(root,'');
    return;
  }
  const items=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/contents/${state.path}?ref=${state.branch}`);
  if(Array.isArray(items)){
    renderFolderActions(root,items);
    await renderTree(root,state.path,items);
  }else{
    renderFilePreview(root,items);
  }
}

async function renderTree(root,path,prefetched){
  const items=prefetched||await ghFetch(`${API}/repos/${state.owner}/${state.repo}/contents/${path}?ref=${state.branch}`);
  if(!Array.isArray(items))return;
  const tree=el('div',{class:'file-tree'});
  tree.innerHTML=`<div class="header"><span>Name</span><span class="size">Size</span><span class="dl"></span></div>`;
  const sorted=[...items].sort((a,b)=>{
    if(a.type!==b.type)return a.type==='dir'?-1:1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  for(const item of sorted){
    const row=el('div',{class:'file-item'});
    const icon=item.type==='dir'?ICONS.folder:fileIcon(item.name);
    const dl=item.type==='file'?`<a href="${item.download_url}" target="_blank" download>${ICONS.download}</a>`:'';
    const arrow=item.type==='dir'?'<span class="dir-arrow">›</span>':'';
    const itemPath=path?`${path}/${item.name}`:item.name;
    row.innerHTML=`<div class="name">${icon}<span>${item.name}</span>${arrow}</div><div class="size">${item.type==='file'?humanSize(item.size):'-'}</div><div class="dl">${dl}</div>`;
    if(item.type==='dir')row.addEventListener('click',()=>navigate(itemPath));
    else row.addEventListener('click',()=>openFile(itemPath));
    tree.append(row);
  }
  root.append(tree);
}

function renderFolderActions(root,items){
  const count=items.filter(i=>i.type==='file').length;
  const total=items.reduce((s,i)=>s+(i.size||0),0);
  const wrapper=el('div',{class:'folder-dl'});
  wrapper.innerHTML=`<div class="info"><strong>${items.length}</strong> items, <span class="count">${humanSize(total)} total</span></div><button id="dl-folder">${ICONS.download} Download ZIP</button>`;
  root.append(wrapper);
  const btn=wrapper.querySelector('button');
  btn.addEventListener('click',()=>downloadFolder(items,state.path));
}

async function openFile(path){
  setStatus('Загрузка файла…','loading');
  try{
    const item=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/contents/${path}?ref=${state.branch}`);
    renderFilePreview(qs('#content'),item);
    setStatus('','');
  }catch(e){setStatus(`Ошибка: ${e.message}`,'error')}
}

function renderFilePreview(root,item){
  root.innerHTML='';
  const preview=el('div',{class:'file-preview'});
  const ext=item.name.split('.').pop().toLowerCase();
  const binaryExts=['png','jpg','jpeg','gif','webp','bmp','ico','avif','heic','tiff','mp3','flac','ogg','wav','mp4','mkv','avi','mov','webm','zip','tar','gz','bz2','xz','7z','rar','pdf','exe','dll','so','dmg','iso','img'];
  const isBinary=binaryExts.includes(ext)||item.size>1024*1024;

  preview.innerHTML=`
    <div class="bar">
      ${fileIcon(item.name)}
      <span class="name">${item.name}</span>
      <span class="size">${humanSize(item.size)}</span>
      <a href="${item.download_url}" target="_blank" class="dl-btn" download>Download</a>
    </div>
  `;

  if(isBinary||ext==='svg'||ext==='woff'||ext==='woff2'||ext==='ttf'||ext==='eot'){
    const note=el('div',{class:'binary-note'});
    if(['png','jpg','jpeg','gif','webp','bmp','ico','svg'].includes(ext)){
      note.innerHTML=`<a href="${item.download_url}" target="_blank"><img src="${item.download_url}" alt="${item.name}" style="max-width:100%;max-height:500px;border-radius:4px"></a>`;
    }else{
      note.innerHTML='<p>Binary file &mdash; <a href="'+item.download_url+'" target="_blank">download</a> to view</p>';
    }
    preview.append(note);
  }else if(item.size>1024*512){
    const note=el('div',{class:'large-note'});
    note.innerHTML='<p>File too large to preview. <a href="'+item.download_url+'" target="_blank">Download</a> to view.</p>';
    preview.append(note);
  }else{
    const pre=el('pre');
    pre.textContent='Loading…';
    preview.append(pre);
    fetch(item.download_url).then(r=>r.text()).then(t=>{
      pre.textContent=t;
    }).catch(()=>{pre.textContent='[Error loading file content]'});
  }
  root.append(preview);
}

/* ─── Folder download ─── */
async function downloadFolder(items,path){
  const btn=qs('#dl-folder');
  if(!btn)return;
  btn.disabled=true;
  btn.textContent='Preparing…';
  try{
    if(typeof JSZip==='undefined'){
      // Load JSZip dynamically
      await new Promise((res,rej)=>{
        const s=document.createElement('script');
        s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        s.onload=res;s.onerror=rej;
        document.head.append(s);
      });
    }
    const zip=new JSZip();
    const folder=state.path?state.path.split('/').pop()||'root':'root';
    let count=0;

    async function addItems(items,folderPath,zipFolder){
      for(const item of items){
        if(item.type==='dir'){
          const sub=zipFolder.folder(item.name);
          try{
            const subItems=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/contents/${folderPath?folderPath+'/':''}${item.name}?ref=${state.branch}`);
            await addItems(subItems,`${folderPath?folderPath+'/':''}${item.name}`,sub);
          }catch(e){}
        }else{
          try{
            const r=await fetch(item.download_url);
            const blob=await r.blob();
            zipFolder.file(item.name,blob);
            count++;
          }catch(e){}
        }
      }
    }

    await addItems(items,state.path,zip.folder(folder));
    if(count===0){throw new Error('No files to download')}
    btn.textContent=`Zipping ${count} files…`;
    const blob=await zip.generateAsync({type:'blob'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=`${folder}.zip`;a.click();
    URL.revokeObjectURL(url);
    btn.textContent=`${ICONS.download} Download ZIP`;
  }catch(e){
    btn.textContent='Error';
    setTimeout(()=>{btn.textContent=`${ICONS.download} Download ZIP`;btn.disabled=false},3000);
    setStatus(`Download error: ${e.message}`,'error');
  }
  btn.disabled=false;
}

/* ─── Recent repos ─── */
function saveRecent(name){
  let list=storage('recent')||[];
  list=list.filter(r=>r!==name);
  list.unshift(name);
  if(list.length>8)list.pop();
  storage('recent',list);
  renderRecent();
}

function renderRecent(){
  const list=storage('recent')||[];
  const el=qs('#recent-tags');
  if(!el)return;
  if(!list.length){el.innerHTML='';return}
  el.innerHTML=list.map(r=>`<span class="tag">${r}</span>`).join('');
  el.querySelectorAll('.tag').forEach(t=>t.addEventListener('click',()=>{inp.value=t.textContent;loadRepo(t.textContent)}));
}

/* ─── Status ─── */
function setStatus(msg,type){
  statusEl.textContent=msg||'';
  statusEl.className='status'+(type?' '+type:'');
  if(!msg&&rateLimit.remaining<60)updateRateInfo();
  if(msg&&rateLimit.remaining<60){
    const info=document.createElement('span');
    info.className='rate-info';
    info.textContent=`API: ${rateLimit.remaining} left`;
    statusEl.append(info);
  }
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded',()=>{
  renderRecent();
  goBtn.addEventListener('click',()=>loadRepo(inp.value));
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')loadRepo(inp.value)});
  inp.focus();

  // Load from URL params
  const p=new URLSearchParams(location.search);
  if(p.get('repo'))loadRepo(p.get('repo'));
});
