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
  history:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  org:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  people:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  calendar:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
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

function extToLang(ext){
  const m={
    py:'python',js:'javascript',ts:'typescript',rs:'rust',go:'go',c:'c',cpp:'cpp',h:'c',hpp:'cpp',
    java:'java',rb:'ruby',php:'php',swift:'swift',kt:'kotlin',scala:'scala',m:'objectivec',mm:'objectivec',
    sh:'bash',bash:'bash',zsh:'bash',fish:'bash',pl:'perl',lua:'lua',r:'r',sql:'sql',
    css:'css',scss:'scss',less:'less',html:'xml',htm:'xml',xml:'xml',svg:'xml',
    yaml:'yaml',yml:'yaml',json:'json',toml:'ini',ini:'ini',cfg:'ini',conf:'ini',
    md:'markdown',rst:'rst',txt:'plaintext','':null,
    dockerfile:'dockerfile',makefile:'makefile','gitignore':'plaintext',env:'plaintext',
  };
  return m[ext]||null;
}

/* ─── Trending repos (curated) ─── */
const TRENDING=[
  {owner:'rust-lang',repo:'rust',desc:'Empowering everyone to build reliable and efficient software.',stars:'99k',lang:'Rust',color:'#dea584'},
  {owner:'denoland',repo:'deno',desc:'A modern runtime for JavaScript and TypeScript.',stars:'97k',lang:'Rust',color:'#dea584'},
  {owner:'oven-sh',repo:'bun',desc:'Incredibly fast JavaScript runtime, bundler, test runner, and package manager.',stars:'75k',lang:'Zig',color:'#ec915c'},
  {owner:'microsoft',repo:'vscode',desc:'Visual Studio Code — Open Source GUI editor.',stars:'165k',lang:'TypeScript',color:'#3178c6'},
  {owner:'neovim',repo:'neovim',desc:'Hyperextensible Vim-based text editor.',stars:'84k',lang:'Vim Script',color:'#199f4b'},
  {owner:'zed-industries',repo:'zed',desc:'High-performance, multiplayer code editor.',stars:'53k',lang:'Rust',color:'#dea584'},
  {owner:'astral-sh',repo:'ruff',desc:'An extremely fast Python linter and code formatter, written in Rust.',stars:'35k',lang:'Rust',color:'#dea584'},
  {owner:'astral-sh',repo:'uv',desc:'An extremely fast Python package and project manager.',stars:'40k',lang:'Rust',color:'#dea584'},
  {owner:'tensorflow',repo:'tensorflow',desc:'An Open Source Machine Learning Framework for everyone.',stars:'188k',lang:'Python',color:'#3572a5'},
  {owner:'facebook',repo:'react',desc:'A declarative, efficient, and flexible JavaScript library for building user interfaces.',stars:'232k',lang:'JavaScript',color:'#f1e05a'},
  {owner:'curl',repo:'curl',desc:'A command line tool and library for transferring data with URL syntax.',stars:'36k',lang:'C',color:'#555'},
  {owner:'yt-dlp',repo:'yt-dlp',desc:'A feature-rich command-line audio/video downloader.',stars:'95k',lang:'Python',color:'#3572a5'},
  {owner:'FFmpeg',repo:'FFmpeg',desc:'A complete solution to record, convert and stream audio and video.',stars:'47k',lang:'C',color:'#555'},
  {owner:'sharkdp',repo:'bat',desc:'A cat(1) clone with wings (syntax highlighting and Git integration).',stars:'51k',lang:'Rust',color:'#dea584'},
  {owner:'sharkdp',repo:'fd',desc:'A simple, fast alternative to find.',stars:'35k',lang:'Rust',color:'#dea584'},
  {owner:'BurntSushi',repo:'ripgrep',desc:'ripgrep is a line-oriented search tool that recursively searches your current directory.',stars:'50k',lang:'Rust',color:'#dea584'},
  {owner:'nushell',repo:'nushell',desc:'A new type of shell for the 21st century in Rust.',stars:'34k',lang:'Rust',color:'#dea584'},
  {owner:'fish-shell',repo:'fish-shell',desc:'The user-friendly command line shell.',stars:'27k',lang:'Rust',color:'#dea584'},
  {owner:'zellij-org',repo:'zellij',desc:'A terminal workspace with batteries included.',stars:'22k',lang:'Rust',color:'#dea584'},
  {owner:'sxyazi',repo:'yazi',desc:'Blazing fast terminal file manager written in Rust.',stars:'18k',lang:'Rust',color:'#dea584'},
  {owner:'jgraph',repo:'drawio',desc:'draw.io is a JavaScript client-side editor for general diagramming.',stars:'42k',lang:'JavaScript',color:'#f1e05a'},
  {owner:'typst',repo:'typst',desc:'A new markup-based typesetting system that is powerful and easy to learn.',stars:'36k',lang:'Rust',color:'#dea584'},
  {owner:'LazyVim',repo:'LazyVim',desc:'Neovim setup for lazy and power users.',stars:'17k',lang:'Lua',color:'#000080'},
  {owner:'helix-editor',repo:'helix',desc:'A post-modern modal text editor in Rust.',stars:'35k',lang:'Rust',color:'#dea584'},
  {owner:'lapce',repo:'lapce',desc:'Lightning-fast and Powerful Code Editor written in Rust.',stars:'34k',lang:'Rust',color:'#dea584'},
  {owner:'nixos',repo:'nixpkgs',desc:'NixOS — the purely functional Linux distribution.',stars:'19k',lang:'Nix',color:'#7eb7da'},
  {owner:'git',repo:'git',desc:'Distributed version control system.',stars:'53k',lang:'C',color:'#555'},
  {owner:'org-rs',repo:'org-rs',desc:'Org mode parser for Rust.',stars:'1k',lang:'Rust',color:'#dea584'},
  {owner:'emacs-mirror',repo:'emacs',desc:'GNU Emacs — extensible, customizable, self-documenting.',stars:'4.8k',lang:'Emacs Lisp',color:'#c065db'},
];

/* ─── Language colors (GitHub-style) ─── */
const LANG_COLORS={
  'Python':'#3572a5','JavaScript':'#f1e05a','TypeScript':'#3178c6','Rust':'#dea584',
  'Go':'#00add8','Java':'#b07219','C':'#555','C++':'#f34b7d','C#':'#178600',
  'Ruby':'#701516','PHP':'#4f5d95','Shell':'#89e051','Lua':'#000080','Zig':'#ec915c',
  'Vim Script':'#199f4b','Nix':'#7eb7da','Emacs Lisp':'#c065db',
};

/* ─── State ─── */
let state={owner:'',repo:'',branch:'',path:''};
let repoData=null;

/* ─── DOM refs ─── */
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
  const parts=input.split('/');
  if(parts.length===1){
    await loadUserRepos(parts[0]);
    return;
  }
  const [owner,repoName]=parts;
  setStatus('Fetching repository…','loading');
  goBtn.disabled=true;
  try{
    const repo=await ghFetch(`${API}/repos/${owner}/${repoName}`);
    repoData=repo;
    state={owner,repo:repoName,branch:repo.default_branch,path:''};
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
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;font-size:11px;color:var(--dim)">
        <span>${ICONS.people} <strong style="color:var(--fg2)">${(user.followers||0).toLocaleString()}</strong> followers</span>
        <span>${ICONS.people} <strong style="color:var(--fg2)">${(user.following||0).toLocaleString()}</strong> following</span>
        <span>${ICONS.repo} <strong style="color:var(--fg2)">${user.public_repos}</strong> repos</span>
        <span>${ICONS.star} <strong style="color:var(--fg2)">${totalStars.toLocaleString()}</strong> stars</span>
        <span>${ICONS.calendar} <strong style="color:var(--fg2)">${years}y</strong> on GitHub</span>
        ${topLang.length?`<span>${ICONS.code} <strong style="color:var(--fg2)">${topLang.join(', ')}</strong></span>`:''}
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

/* ─── Render ─── */
function render(){
  updateRateInfo();
  const sugEl=qs('#suggestions');
  const recEl=qs('#recent');
  if(sugEl)sugEl.style.display='none';
  if(recEl)recEl.style.display='none';
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
    row.innerHTML=`<div class="name">${icon}<span>${item.name}</span></div><div class="size">${item.type==='file'?humanSize(item.size):'-'}</div><div class="dl">${dl}</div>`;
    if(item.type==='dir')row.addEventListener('click',()=>navigate(itemPath));
    else row.addEventListener('click',()=>openFile(itemPath));
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
  if(!list.length){el.innerHTML='';return}
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

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded',()=>{
  renderRecent();
  renderSuggestions();
  goBtn.addEventListener('click',()=>loadRepo(inp.value));
  inp.focus();

  // Autocomplete + Enter handling
  const acEl=qs('#ac-list');
  let acIdx=-1;
  inp.addEventListener('input',()=>{
    const v=inp.value.trim().toLowerCase();
    if(!v){acEl.classList.remove('open');acEl.innerHTML='';return}
    const recent=storage('recent')||[];
    const all=[...recent.map(r=>({label:r,type:'recent'})),...TRENDING.map(r=>({label:`${r.owner}/${r.repo}`,type:'trending'}))];
    const unique=[];
    const seen=new Set();
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

  // Load from URL params
  const p=new URLSearchParams(location.search);
  if(p.get('repo'))loadRepo(p.get('repo'));
});
