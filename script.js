/* gh-browser — GitHub repository browser */
const API='https://api.github.com';
const RAW='https://raw.githubusercontent.com';

function qs(s){return document.querySelector(s)}
function qsa(s){return document.querySelectorAll(s)}
function el(t,a,...c){let e=document.createElement(t);for(let k in a)e.setAttribute(k,a[k]);c.forEach(ch=>e.append(ch));return e}

function humanSize(n){
  if(!n||n<0)n=0;n=+n;
  for(const u of['B','KB','MB','GB','TB']){if(n<1024)return u==='B'?`${n} B`:`${n.toFixed(1)} ${u}`;n/=1024}
  return `${n.toFixed(1)} TB`;
}

function storage(k,v){if(v!==void 0){localStorage.setItem('ghb_'+k,JSON.stringify(v));return}v=localStorage.getItem('ghb_'+k);try{return JSON.parse(v)}catch{return v||null}}

const ICONS={
  folder:`<svg viewBox="0 0 22 22" fill="none" stroke="#89a0c2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-7l-2-2H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1z"/></svg>`,
  file:`<svg viewBox="0 0 22 22" fill="none" stroke="#c0caf5" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z"/><path d="M13 2v5h5"/></svg>`,
  image:`<svg viewBox="0 0 22 22" fill="none" stroke="#bb9af7" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="2.5"/><path d="m2 16 5-4 3 3 5-5 5 5"/></svg>`,
  audio:`<svg viewBox="0 0 22 22" fill="none" stroke="#e0af68" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17V5l10-2v12"/><circle cx="6" cy="17" r="3"/><circle cx="17" cy="15" r="3"/></svg>`,
  video:`<svg viewBox="0 0 22 22" fill="none" stroke="#ff9e64" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="14" height="12" rx="2"/><path d="m16 9 4-2v8l-4-2"/></svg>`,
  archive:`<svg viewBox="0 0 22 22" fill="none" stroke="#7ecb8b" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h14v2H4z"/><rect x="4" y="6" width="14" height="12" rx="1"/><path d="M11 10v4M9 12h4"/></svg>`,
  pdf:`<svg viewBox="0 0 22 22" fill="none" stroke="#f7768e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z"/><path d="M13 2v5h5"/><path d="M7 12h8M7 16h5"/></svg>`,
  code:`<svg viewBox="0 0 22 22" fill="none" stroke="#b4f9f8" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 16 20 11 15 6"/><polyline points="7 6 2 11 7 16"/></svg>`,
  star:`<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 2 14 8 20 9 15.5 13.5 17 20 11 16.5 5 20 6.5 13.5 2 9 8 8 11 2"/></svg>`,
  fork:`<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="14"/><circle cx="6" cy="17" r="3"/><circle cx="16" cy="6" r="3"/><path d="M16 9a7 7 0 0 1-7 7"/></svg>`,
  repo:`<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="16" height="16" rx="2"/><line x1="8" y1="8" x2="14" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/><line x1="8" y1="16" x2="11" y2="16"/></svg>`,
  download:`<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3"/><polyline points="6 10 11 15 16 10"/><line x1="11" y1="15" x2="11" y2="3"/></svg>`,
  left:`<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="14 16 9 11 14 6"/></svg>`,
  people:`<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 19v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="5" r="4"/><path d="M23 19v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></svg>`,
  calendar:`<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="16" height="16" rx="2"/><line x1="15" y1="2" x2="15" y2="6"/><line x1="7" y1="2" x2="7" y2="6"/><line x1="3" y1="10" x2="19" y2="10"/></svg>`,
  gitBranch:`<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="14"/><circle cx="6" cy="17" r="3"/><circle cx="16" cy="6" r="3"/><path d="M16 9a7 7 0 0 1-7 7"/></svg>`,
  verify:`<svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" fill="#7ecb8b" opacity=".15" stroke="#7ecb8b" stroke-width="1.5"/><path d="M5.5 9l2.5 2.5 4.5-5" stroke="#7ecb8b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  info:`<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="7"/><line x1="9" y1="9" x2="9" y2="13"/><line x1="9" y1="6" x2="9" y2="6"/></svg>`,
};

function fileIcon(name){
  const ext=name.split('.').pop().toLowerCase();
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
let branchesCache=[];
let readmeRendered=false;

const inp=qs('#gh-input');
const goBtn=qs('#gh-go');
const statusEl=qs('#status');

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

/* ─── Load repo or user ─── */
async function loadRepo(input){
  input=input.trim().replace(/https?:\/\/github\.com\//,'').replace(/\/$/,'');
  const acEl=qs('#ac-list');
  if(acEl)acEl.classList.remove('open');
  if(input.startsWith('repo:')){input=input.slice(5);const p=input.split('/');if(p.length>=2){const [o,r]=p;return loadSpecificRepo(o,r)}}
  if(input.startsWith('user:')){return loadUserRepos(input.slice(5))}
  const parts=input.split('/');
  if(parts.length===1){await loadUserRepos(parts[0]);return}
  const [owner,repoName]=parts;
  loadSpecificRepo(owner,repoName);
}

async function loadSpecificRepo(owner,repoName){
  setStatus('Fetching repository…','loading');
  goBtn.disabled=true;
  try{
    const repo=await ghFetch(`${API}/repos/${owner}/${repoName}`);
    repoData=repo;
    state={owner,repo:repoName,branch:repo.default_branch,path:''};
    branchesCache=[];
    readmeRendered=false;
    saveRecent(`${owner}/${repoName}`);
    setStatus('','');
    render();
  }catch(e){
    if(e.status===404)setStatus(`Repository ${owner}/${repoName} not found`,'error');
    else if(e.status===403)setStatus(`API rate limit: ${e.message}. Add a token: storage("token","ghp_...")`,'error');
    else setStatus(`Error: ${e.message}`,'error');
  }finally{goBtn.disabled=false}
}

async function loadUserRepos(username){
  setStatus(`Fetching ${username}…`,'loading');
  goBtn.disabled=true;
  const el=qs('#recent');
  const sug=qs('#suggestions');
  if(el)el.style.display='none';
  if(sug)sug.style.display='none';
  try{
    const [user,repos]=await Promise.all([
      ghFetch(`${API}/users/${username}`),
      ghFetch(`${API}/users/${username}/repos?per_page=30&sort=updated`)
    ]);
    const totalStars=repos.reduce((s,r)=>s+(r.stargazers_count||0),0);
    const langCount={};
    repos.forEach(r=>{if(r.language)langCount[r.language]=(langCount[r.language]||0)+1});
    const topLang=Object.entries(langCount).sort((a,b)=>b[1]-a[1]).slice(0,3).map(e=>e[0]);
    const created=new Date(user.created_at);
    const years=Math.floor((Date.now()-created)/31557600000);
    const root=qs('#content');
    root.innerHTML=`
      <div class="repo-header" style="display:flex">
        <img class="avatar" src="${user.avatar_url}&s=80" alt="${username}" style="width:40px;height:40px;border-radius:8px">
        <div class="info">
          <h2 style="display:flex;align-items:center;gap:8px;font-size:15px">${user.name||username} <span style="font-size:12px;color:var(--dim);font-weight:400">@${username}</span></h2>
          <p>${user.bio||''}</p>
        </div>
      </div>
      <div class="user-stats">
        <span>${ICONS.people} <strong>${(user.followers||0).toLocaleString()}</strong> followers</span>
        <span>${ICONS.people} <strong>${(user.following||0).toLocaleString()}</strong> following</span>
        <span>${ICONS.repo} <strong>${user.public_repos}</strong> repos</span>
        <span>${ICONS.star} <strong>${totalStars.toLocaleString()}</strong> stars</span>
        <span>${ICONS.calendar} <strong>${years}y</strong> on GitHub</span>
        ${topLang.length?`<span>${ICONS.code} <strong>${topLang.join(', ')}</strong></span>`:''}
        ${user.location?`<span>📍 ${user.location}</span>`:''}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px">
        ${repos.map(r=>`
          <div class="sug-card" data-repo="${r.full_name}" style="cursor:pointer">
            <div class="top">
              <span class="name">${r.name}${r.fork?' <span style="color:var(--dim);font-size:10px">forked</span>':''}</span>
              <span class="stars">${ICONS.star} ${(r.stargazers_count||0).toLocaleString()}</span>
            </div>
            <div class="desc">${r.description||'No description'}</div>
            <div class="lang">${r.language?`<span class="dot" style="background:${LANG_COLORS[r.language]||'#888'}"></span>${r.language}`:'<span style="color:var(--dim)">—</span>'}</div>
          </div>
        `).join('')}
      </div>
    `;
    root.querySelectorAll('.sug-card').forEach(c=>c.addEventListener('click',()=>{
      inp.value=c.dataset.repo;
      loadRepo(c.dataset.repo);
    }));
    setStatus('','');
  }catch(e){
    setStatus(`Error: ${e.message}`,'error');
  }finally{goBtn.disabled=false}
}

async function navigate(path){
  if(path===state.path)return;
  state.path=path;
  setStatus('Loading…','loading');
  try{render()}catch(e){setStatus(`Error: ${e.message}`,'error')}
}

/* ─── Branch switcher ─── */
async function renderBranchSwitcher(){
  const bar=qs('#branch-bar');
  if(!bar||!repoData)return;
  if(!branchesCache.length){
    try{
      branchesCache=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/branches?per_page=100`);
    }catch(e){branchesCache=[{name:repoData.default_branch}]}
  }
  bar.style.display='flex';
  bar.innerHTML=`${ICONS.gitBranch} <span id="branch-label">${state.branch}</span>`;
  if(branchesCache.length>1){
    const sel=el('select',{id:'branch-select'});
    for(const b of branchesCache){
      const opt=el('option',{value:b.name});
      opt.textContent=b.name;
      if(b.name===state.branch)opt.selected=true;
      sel.append(opt);
    }
    bar.append(sel);
    sel.addEventListener('change',async()=>{
      state.branch=sel.value;
      state.path='';
      readmeRendered=false;
      setStatus('Switching branch…','loading');
      try{
        render();
        setStatus('','');
      }catch(e){setStatus(`Error: ${e.message}`,'error')}
    });
  }
}

/* ─── Render ─── */
function render(){
  updateRateInfo();
  const sugEl=qs('#suggestions');
  const recEl=qs('#recent');
  if(sugEl)sugEl.style.display='none';
  if(recEl)recEl.style.display='none';
  renderBranchSwitcher();
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
  const showBadge=repoData.stargazers_count>=5000||repoData.full_name==='neocrev/gh-browser';
  h.querySelector('h2').innerHTML=`<a href="${repoData.html_url}" target="_blank">${repoData.full_name}</a>${showBadge?` <span class="verified-badge" title="Verified repository">${ICONS.verify}</span>`:''}`;
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
    acc+=(i?'/':'')+parts[i];
    const name=parts[i];
    if(i===parts.length-1)html+=`<span class="sep">/</span><span class="current">${name}</span>`;
    else html+=`<span class="sep">/</span><a data-path="${acc}">${name}</a>`;
  }
  el.innerHTML=html;
  el.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navigate(a.dataset.path)));
}

/* ─── Content ─── */
async function renderContent(){
  const root=qs('#content');
  root.innerHTML='';
  if(!state.path){
    await renderTree(root,'');
    // Render README at repo root
    await renderReadme(root);
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

/* ─── README rendering ─── */
async function renderReadme(root){
  if(readmeRendered)return;
  // Try common README filenames
  const candidates=['README.md','README','Readme.md','readme.md','README.rst','README.txt'];
  let content=null;
  let name='';
  for(const c of candidates){
    try{
      const r=await fetch(`${RAW}/${state.owner}/${state.repo}/${state.branch}/${c}`);
      if(r.ok){content=await r.text();name=c;break}
    }catch(e){}
  }
  if(!content)return;
  readmeRendered=true;
  const wrapper=el('div',{class:'readme'});
  const ext=name.split('.').pop().toLowerCase();
  if(ext==='md'){
    if(typeof marked==='undefined'){
      try{
        await new Promise((res,rej)=>{
          const s=document.createElement('script');
          s.src='https://cdn.jsdelivr.net/npm/marked/marked.min.js';
          s.onload=res;s.onerror=rej;
          document.head.append(s);
        });
      }catch(e){
        wrapper.textContent=content.substring(0,2000);
        root.prepend(wrapper);
        return;
      }
    }
    try{
      wrapper.innerHTML=marked.parse(content);
      wrapper.querySelectorAll('a').forEach(a=>{if(!a.href.startsWith('#'))a.target='_blank'});
      wrapper.querySelectorAll('script,iframe,style').forEach(e=>e.remove());
    }catch(e){
      wrapper.textContent=content.substring(0,2000);
    }
  }else{
    wrapper.innerHTML=`<pre style="white-space:pre-wrap;font-size:12px">${content.substring(0,5000)}</pre>`;
  }
  // Collapse README if more than ~9 lines
  const lineCount=(content.match(/\n/g)||'').length+1;
  root.prepend(wrapper);
  if(lineCount>9){
    wrapper.classList.add('readme-collapsed');
    const toggleBtn=el('button',{class:'readme-toggle'});
    toggleBtn.textContent='Show more';
    toggleBtn.addEventListener('click',()=>{
      const collapsed=wrapper.classList.toggle('readme-collapsed');
      toggleBtn.textContent=collapsed?'Show more':'Show less';
    });
    wrapper.after(toggleBtn);
  }
}

/* ─── Tree ─── */
async function renderTree(root,path,prefetched){
  const items=prefetched||await ghFetch(`${API}/repos/${state.owner}/${state.repo}/contents/${path}?ref=${state.branch}`);
  if(!Array.isArray(items))return;
  const tree=el('div',{class:'file-tree'});
  const search=el('input',{class:'file-search',type:'text',placeholder:'Search files…'});
  tree.append(search);
  tree.innerHTML+=`<div class="header"><span>Name</span><span class="size">Size</span><span class="dl"></span></div>`;
  const body=el('div',{class:'file-body'});
  const sorted=[...items].sort((a,b)=>{
    if(a.type!==b.type)return a.type==='dir'?-1:1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  for(const item of sorted){
    const row=el('div',{class:'file-item',dataset:item.name.toLowerCase()});
    const icon=item.type==='dir'?ICONS.folder:fileIcon(item.name);
    const dl=item.type==='file'?`<a href="${item.download_url}" target="_blank" download>${ICONS.download}</a>`:'';
    const itemPath=path?`${path}/${item.name}`:item.name;
    const toggle=item.type==='dir'
      ?`<span class="toggle-dir">▶</span>`
      :'';
    row.innerHTML=`<div class="name">${toggle}${icon}<span>${item.name}</span></div><div class="size">${item.type==='file'?humanSize(item.size):'-'}</div><div class="dl">${dl}</div>`;
    if(item.type==='dir'){
      row.addEventListener('click',e=>{
        if(e.target.closest('.toggle-dir')){
          e.stopPropagation();
          toggleDir(row,itemPath);
        }else{
          navigate(itemPath);
        }
      });
    }else{
      row.addEventListener('click',()=>openFile(itemPath));
    }
    body.append(row);
  }
  tree.append(body);
  root.append(tree);

  search.addEventListener('input',()=>{
    const q=search.value.toLowerCase();
    body.querySelectorAll('.file-item').forEach(r=>{
      r.style.display=r.dataset.name.includes(q)?'':'none';
    });
  });
}

/* ─── Inline folder expand ─── */
async function toggleDir(row,itemPath){
  const toggle=row.querySelector('.toggle-dir');
  const existingSub=row.nextElementSibling;
  if(existingSub&&existingSub.classList.contains('file-subtree')){
    // Collapse
    existingSub.remove();
    if(toggle)toggle.classList.remove('open');
    return;
  }
  if(toggle)toggle.classList.add('open');
  setStatus('Loading…','loading');
  try{
    const items=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/contents/${itemPath}?ref=${state.branch}`);
    if(!Array.isArray(items)){setStatus('','');return}
    const subTree=el('div',{class:'file-subtree'});
    subTree.style.cssText='padding-left:18px;border-left:1px solid rgba(255,255,255,.05);margin-left:14px';
    const sorted=[...items].sort((a,b)=>{
      if(a.type!==b.type)return a.type==='dir'?-1:1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    for(const item of sorted){
      const r=el('div',{class:'file-item',dataset:item.name.toLowerCase()});
      const icon=item.type==='dir'?ICONS.folder:fileIcon(item.name);
      const dl=item.type==='file'?`<a href="${item.download_url}" target="_blank" download>${ICONS.download}</a>`:'';
      const subPath=`${itemPath}/${item.name}`;
      const toggleBtn=item.type==='dir'?'<span class="toggle-dir">▶</span>':'';
      r.innerHTML=`<div class="name">${toggleBtn}${icon}<span>${item.name}</span></div><div class="size">${item.type==='file'?humanSize(item.size):'-'}</div><div class="dl">${dl}</div>`;
      if(item.type==='dir'){
        r.addEventListener('click',e=>{
          if(e.target.closest('.toggle-dir')){e.stopPropagation();toggleDir(r,subPath)}
          else navigate(subPath);
        });
      }else{
        r.addEventListener('click',()=>openFile(subPath));
      }
      subTree.append(r);
    }
    row.after(subTree);
    setStatus('','');
  }catch(e){
    if(toggle)toggle.classList.remove('open');
    setStatus(`Error: ${e.message}`,'error');
  }
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
  setStatus('Loading file…','loading');
  try{
    const item=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/contents/${path}?ref=${state.branch}`);
    renderFilePreview(qs('#content'),item);
    setStatus('','');
  }catch(e){setStatus(`Error: ${e.message}`,'error')}
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
    const langClass=extToLang(ext);
    if(langClass)pre.className='language-'+langClass;
    pre.textContent='Loading…';
    preview.append(pre);
    fetch(item.download_url).then(r=>r.text()).then(t=>{
      pre.textContent=t;
      if(typeof hljs!=='undefined')try{hljs.highlightElement(pre)}catch(e){}
    }).catch(()=>{pre.textContent='[Error loading file content]'});
    if(typeof hljs==='undefined'){
      const link=document.createElement('link');
      link.rel='stylesheet';link.href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/tokyo-night-dark.min.css';
      document.head.append(link);
      const script=document.createElement('script');
      script.src='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/highlight.min.js';
      script.onload=()=>{pre.textContent&&hljs.highlightElement(pre)};
      document.head.append(script);
    }
  }
  root.append(preview);
}

/* ─── License notice ─── */
function showLicenseNotice(){
  const existing=qs('#license-notice');
  if(existing)existing.remove();
  if(!repoData||!repoData.license)return;
  const lic=repoData.license;
  const notice=el('div',{id:'license-notice',class:'license-notice'});
  notice.innerHTML=`
    <span class="lic-icon">${ICONS.info}</span>
    <span class="lic-text">Licensed under <strong>${lic.spdx_id||lic.name}</strong></span>
    <button class="lic-close">&times;</button>
  `;
  const root=qs('#content');
  if(root)root.prepend(notice);
  notice.querySelector('.lic-close').addEventListener('click',()=>notice.remove());
}

/* ─── Folder download ─── */
async function downloadFolder(items,path){
  showLicenseNotice();
  const btn=qs('#dl-folder');
  if(!btn)return;
  btn.disabled=true;
  btn.textContent='Preparing…';
  try{
    if(typeof JSZip==='undefined'){
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

const SAD_RABBIT=`<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="60" cy="80" rx="38" ry="16" fill="#1c1d2b" stroke="#262840" stroke-width="1.5"/>
  <ellipse cx="60" cy="62" rx="24" ry="22" fill="#1f2233" stroke="#24283b" stroke-width="1.5"/>
  <ellipse cx="60" cy="50" rx="18" ry="14" fill="#24283b" stroke="#262840" stroke-width="1"/>
  <ellipse cx="43" cy="32" rx="10" ry="18" fill="#1f2233" stroke="#24283b" stroke-width="1.5" transform="rotate(-15,43,32)"/>
  <ellipse cx="77" cy="32" rx="10" ry="18" fill="#1f2233" stroke="#24283b" stroke-width="1.5" transform="rotate(15,77,32)"/>
  <ellipse cx="41" cy="26" rx="6" ry="12" fill="#1c1d2b" stroke="#262840" stroke-width="1" transform="rotate(-10,41,26)"/>
  <ellipse cx="79" cy="26" rx="6" ry="12" fill="#1c1d2b" stroke="#262840" stroke-width="1" transform="rotate(10,79,26)"/>
  <circle cx="46" cy="48" r="3" fill="#c0caf5" opacity=".8"/>
  <circle cx="74" cy="48" r="3" fill="#c0caf5" opacity=".8"/>
  <circle cx="46" cy="48" r="1.5" fill="#1f2233"/>
  <circle cx="74" cy="48" r="1.5" fill="#1f2233"/>
  <ellipse cx="53" cy="55" rx="2.5" ry="1.2" fill="#f7768e" opacity=".5"/>
  <ellipse cx="67" cy="55" rx="2.5" ry="1.2" fill="#f7768e" opacity=".5"/>
  <path d="M57 57 Q60 59 63 57" stroke="#51587a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <circle cx="28" cy="52" r="2" fill="#7ecb8b" opacity=".4"/>
  <circle cx="92" cy="52" r="2" fill="#7ecb8b" opacity=".4"/>
  <circle cx="25" cy="50" r="1" fill="#7aa2f7" opacity=".3"/>
  <circle cx="95" cy="50" r="1" fill="#7aa2f7" opacity=".3"/>
</svg>`;

function saveRecent(name){
  let list=storage('recent')||[];
  list=list.filter(r=>r!==name);
  list.unshift(name);
  if(list.length>8)list.pop();
  storage('recent',list);
  renderRecent();
}

function removeRecent(name){
  let list=storage('recent')||[];
  list=list.filter(r=>r!==name);
  storage('recent',list);
  renderRecent();
}

function renderRecent(){
  const list=storage('recent')||[];
  const el=qs('#recent-tags');
  if(!el)return;
  if(!list.length){
    el.innerHTML=`
      <div class="empty-recent">
        ${SAD_RABBIT}
        <p>Nothing here yet.</p>
      </div>
    `;
    return;
  }
  el.innerHTML=list.map(r=>`<span class="tag"><span class="rm" data-name="${r}">✕</span>${r}</span>`).join('');
  el.querySelectorAll('.tag').forEach(t=>{
    t.addEventListener('click',e=>{
      if(e.target.classList.contains('rm'))return;
      inp.value=t.textContent.replace('✕','').trim();
      loadRepo(inp.value);
    });
  });
  el.querySelectorAll('.rm').forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();
    removeRecent(b.dataset.name);
  }));
}

/* ─── Trending suggestions ─── */
function renderSuggestions(){
  const el=qs('#suggestions');
  const grid=qs('#suggestions-grid');
  if(!el||!grid)return;
  el.style.display='block';
  grid.innerHTML=TRENDING.map(r=>`
    <div class="sug-card" data-repo="${r.owner}/${r.repo}">
      <div class="top">
        <span class="name">${r.owner}/${r.repo}</span>
        <span class="stars">★ ${r.stars}</span>
      </div>
      <div class="desc">${r.desc}</div>
      <div class="lang"><span class="dot" style="background:${r.color}"></span>${r.lang}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.sug-card').forEach(c=>c.addEventListener('click',()=>{
    inp.value=c.dataset.repo;
    loadRepo(c.dataset.repo);
  }));
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

/* ─── Keyboard shortcuts ─── */
function showShortcuts(){
  const existing=qs('.shortcuts-overlay');
  if(existing){existing.remove();return}
  const overlay=el('div',{class:'shortcuts-overlay'});
  overlay.innerHTML=`
    <div class="shortcuts-box">
      <h3>Keyboard Shortcuts</h3>
      <div class="row"><span class="key">?</span> <span class="desc">Toggle this help</span></div>
      <div class="row"><span class="key">g</span> <span class="desc">Return to repo root / home</span></div>
      <div class="row"><span class="key">t</span> <span class="desc">Focus file search</span></div>
      <div class="row"><span class="key">/</span> <span class="desc">Focus repo input</span></div>
      <div class="row"><span class="key">Esc</span> <span class="desc">Close help / blur input</span></div>
      <button class="close-btn">Close</button>
    </div>
  `;
  document.body.append(overlay);
  overlay.querySelector('.close-btn').addEventListener('click',()=>overlay.remove());
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded',()=>{
  renderRecent();
  renderSuggestions();
  goBtn.addEventListener('click',()=>loadRepo(inp.value));
  inp.focus();

  /* Autocomplete */
  const acEl=qs('#ac-list');
  let acIdx=-1;
  inp.addEventListener('input',()=>{
    const v=inp.value.trim().toLowerCase();
    if(!v){acEl.classList.remove('open');acEl.innerHTML='';return}
    const recent=storage('recent')||[];
    const all=[...recent.map(r=>({label:r,type:'recent'})),...TRENDING.map(r=>({label:`${r.owner}/${r.repo}`,type:'trending'}))];
    const unique=[];const seen=new Set();
    for(const item of all){if(!seen.has(item.label)){seen.add(item.label);unique.push(item)}}
    const matches=unique.filter(x=>x.label.toLowerCase().includes(v)).slice(0,8);
    if(!matches.length){acEl.classList.remove('open');acEl.innerHTML='';return}
    acIdx=-1;
    acEl.innerHTML=matches.map((m,i)=>`<div class="ac-item" data-idx="${i}"><span class="ac-label">${m.label}</span><span class="ac-type">${m.type}</span></div>`).join('');
    acEl.classList.add('open');
    acEl.querySelectorAll('.ac-item').forEach(el=>el.addEventListener('click',()=>{
      inp.value=el.querySelector('.ac-label').textContent;
      acEl.classList.remove('open');
      loadRepo(inp.value);
    }));
  });
  inp.addEventListener('keydown',e=>{
    const items=acEl.querySelectorAll('.ac-item');
    if(e.key==='ArrowDown'){e.preventDefault();acIdx=Math.min(acIdx+1,items.length-1);highlightAc(items)}
    else if(e.key==='ArrowUp'){e.preventDefault();acIdx=Math.max(acIdx-1,0);highlightAc(items)}
    else if(e.key==='Enter'){
      if(acIdx>=0&&items.length){e.preventDefault();items[acIdx].click()}
      else{acEl.classList.remove('open');loadRepo(inp.value)}
    }
  });
  function highlightAc(items){
    items.forEach((el,i)=>el.classList.toggle('hl',i===acIdx));
    if(acIdx>=0)items[acIdx].scrollIntoView({block:'nearest'});
  }
  document.addEventListener('click',e=>{if(!e.target.closest('.ac-wrap')&&!e.target.closest('#gh-input'))acEl.classList.remove('open')});

  /* Keyboard shortcuts (global) */
  let gPressed=false;
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'){
      // Allow Esc to blur inputs
      if(e.key==='Escape'){e.target.blur();acEl.classList.remove('open')}
      return;
    }
    if(e.key==='?'){
      e.preventDefault();
      showShortcuts();
      return;
    }
    if(e.key==='g'&&!gPressed){gPressed=true;return}
    // Single key shortcuts
    if(e.key==='t'){
      const fs=qs('.file-search');
      if(fs){e.preventDefault();fs.focus()}
    }
    if(e.key==='/'){
      e.preventDefault();
      inp.focus();
    }
  });
  document.addEventListener('keyup',e=>{
    if(e.key==='g'){
      if(gPressed){
        // Navigate to root
        if(repoData&&state.path!=='')navigate('');
        else if(!repoData)inp.focus();
        gPressed=false;
      }
    }else{
      gPressed=false;
    }
  });

  /* Load from URL params */
  const p=new URLSearchParams(location.search);
  if(p.get('repo'))loadRepo(p.get('repo'));
});
