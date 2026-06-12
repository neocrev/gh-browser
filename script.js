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

/* ─── Tab state ─── */
let activeTab='files';
let tabInit={};

function switchTab(tab){
  if(tab===activeTab)return;
  activeTab=tab;
  qsa('#tab-bar .tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  const content=qs('#content');
  if(tab==='files'){
    content.style.display='block';
    ['commits','prs','issues','releases','search'].forEach(t=>{
      const p=qs(`#tab-${t}`);
      if(p)p.classList.remove('active');
    });
  }else{
    content.style.display='none';
    ['commits','prs','issues','releases','search'].forEach(t=>{
      const p=qs(`#tab-${t}`);
      if(p)p.classList.toggle('active',t===tab);
    });
    if(!tabInit[tab]){tabInit[tab]=true;renderTabContent(tab)}
  }
}

async function renderTabContent(tab){
  const pane=qs(`#tab-${tab}`);
  if(!pane)return;
  if(tab==='files')return;
  pane.innerHTML='<div class="list-loading"><span class="spinner"></span>Loading&hellip;</div>';
  try{
    if(tab==='commits')await renderCommits(pane);
    else if(tab==='prs')await renderPRs(pane);
    else if(tab==='issues')await renderIssues(pane);
    else if(tab==='releases')await renderReleases(pane);
    else if(tab==='search')renderSearchPane(pane);
  }catch(e){
    pane.innerHTML=`<div class="list-empty">Error: ${e.message}</div>`;
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
  renderTabs();
  renderContent();
}

function renderTabs(){
  const tb=qs('#tab-bar');
  if(!tb)return;
  tb.style.display='flex';
  // Create panes for non-files tabs
  const content=qs('#content');
  ['commits','prs','issues','releases','search'].forEach(t=>{
    if(!qs(`#tab-${t}`)){
      const pane=document.createElement('div');
      pane.id=`tab-${t}`;
      pane.className='tab-content';
      content.after(pane);
    }
  });
  if(!tb._wired){
    tb._wired=true;
    tb.querySelectorAll('.tab').forEach(b=>{
      b.addEventListener('click',()=>switchTab(b.dataset.tab));
    });
  }
  // Apply active state
  tb.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));
  ['commits','prs','issues','releases','search'].forEach(t=>{
    const p=qs(`#tab-${t}`);
    if(p)p.classList.toggle('active',activeTab===t);
  });
  // Files tab = show #content directly, hide it for other tabs
  content.style.display=activeTab==='files'?'block':'none';
  tabInit={};
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
    await renderReadme(root);
    renderActivity(root);
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

/* ─── Commits tab ─── */
async function renderCommits(pane){
  const data=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/commits?sha=${state.branch}&per_page=30`);
  if(!data.length){pane.innerHTML='<div class="list-empty">No commits found.</div>';return}
  const list=document.createElement('div');
  list.className='commit-list';
  for(const c of data){
    const item=document.createElement('div');
    item.className='commit-item';
    const avatar=c.committer&&c.committer.avatar_url?`<img class="commit-avatar" src="${c.committer.avatar_url}&s=40" alt="">`:'<div class="commit-avatar" style="background:var(--bg4);border-radius:50%"></div>';
    const msg=c.commit.message.split('\n')[0];
    const hash=c.sha.substring(0,7);
    const date=c.commit.author?timeAgo(c.commit.author.date):'';
    const author=c.commit.author?c.commit.author.name:'unknown';
    item.innerHTML=`
      ${avatar}
      <div class="commit-body">
        <div class="commit-msg"><a href="${c.html_url}" target="_blank">${escHtml(msg)}</a></div>
        <div class="commit-meta"><strong>${escHtml(author)}</strong> committed ${date} · <span class="commit-hash">${hash}</span></div>
      </div>
      <span class="commit-expand">▶</span>
    `;
    const detail=document.createElement('div');
    detail.className='commit-detail';
    detail.style.display='none';
    item.addEventListener('click',async(e)=>{
      if(e.target.closest('a'))return;
      const expanded=detail.style.display!=='none';
      if(expanded){detail.style.display='none';item.querySelector('.commit-expand').textContent='▶';return}
      if(!detail._loaded){
        detail.innerHTML='<div class="list-loading"><span class="spinner"></span>Loading diff…</div>';
        try{
          const commit=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/commits/${c.sha}`);
          detail._loaded=true;
          let html='<div class="commit-detail-body">';
          if(commit.commit.message.includes('\n')){
            const body=commit.commit.message.substring(commit.commit.message.indexOf('\n')+1).trim();
            if(body)html+=`<div class="commit-desc">${escHtml(body.substring(0,2000))}</div>`;
          }
          const stats=commit.stats;
          if(stats)html+=`<div class="commit-stats"><span class="stat-add">+${stats.additions}</span> <span class="stat-del">-${stats.deletions}</span> <span class="stat-total">${stats.total} lines</span></div>`;
          html+='<div class="commit-files">';
          for(const f of (commit.files||[])){
            let statusClass='file-modified',statusLabel='M';
            if(f.status==='added'){statusClass='file-added';statusLabel='A'}
            else if(f.status==='removed'){statusClass='file-removed';statusLabel='D'}
            else if(f.status==='renamed'){statusClass='file-renamed';statusLabel='R'}
            html+=`<div class="commit-file">
              <span class="file-status ${statusClass}">${statusLabel}</span>
              <span class="file-path">${escHtml(f.filename)}</span>
              <span class="file-stats">+${f.additions}/-${f.deletions}</span>
            </div>`;
          }
          html+='</div></div>';
          detail.innerHTML=html;
        }catch(e){detail.innerHTML=`<div class="list-empty">Error: ${e.message}</div>`}
      }
      detail.style.display='block';
      item.querySelector('.commit-expand').textContent='▼';
    });
    item.append(detail);
    list.append(item);
  }
  pane.innerHTML='';
  pane.append(list);
}

/* ─── PRs tab ─── */
async function renderPRs(pane){
  const data=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/pulls?state=all&per_page=30&sort=updated`);
  if(!data.length){pane.innerHTML='<div class="list-empty">No pull requests found.</div>';return}
  const list=document.createElement('div');
  list.className='pr-list';
  for(const pr of data){
    const item=document.createElement('div');
    item.className='pr-item';
    let stateClass='open',stateLabel='Open';
    if(pr.merged_at){stateClass='merged';stateLabel='Merged'}
    else if(pr.state==='closed'){stateClass='closed';stateLabel='Closed'}
    item.innerHTML=`
      <span class="pr-icon">${ICONS.code}</span>
      <div class="pr-body">
        <div class="pr-title">${escHtml(pr.title)} <span class="pr-state ${stateClass}">${stateLabel}</span></div>
        <div class="pr-meta">#${pr.number} by <strong>${escHtml(pr.user.login)}</strong> ${timeAgo(pr.created_at)}</div>
      </div>
      <span class="pr-number">#${pr.number}</span>
      <span class="commit-expand">▶</span>
    `;
    const detail=document.createElement('div');
    detail.className='pr-detail';
    detail.style.display='none';
    item.addEventListener('click',async(e)=>{
      if(e.target.closest('a'))return;
      const expanded=detail.style.display!=='none';
      if(expanded){detail.style.display='none';item.querySelector('.commit-expand').textContent='▶';return}
      if(!detail._loaded){
        detail.innerHTML='<div class="list-loading"><span class="spinner"></span>Loading PR details…</div>';
        try{
          const [prDetail, files] = await Promise.all([
            ghFetch(`${API}/repos/${state.owner}/${state.repo}/pulls/${pr.number}`),
            ghFetch(`${API}/repos/${state.owner}/${state.repo}/pulls/${pr.number}/files?per_page=50`)
          ]);
          detail._loaded=true;
          let html='<div class="commit-detail-body">';
          if(prDetail.body)html+=`<div class="commit-desc">${escHtml(prDetail.body.substring(0,3000))}</div>`;
          const stats=prDetail.additions!=null?`<div class="commit-stats"><span class="stat-add">+${prDetail.additions}</span> <span class="stat-del">-${prDetail.deletions}</span> <span class="stat-total">${prDetail.changed_files} files</span></div>`:'';
          if(stats)html+=stats;
          html+='<div class="commit-files">';
          for(const f of (files||[])){
            let statusClass='file-modified',statusLabel='M';
            if(f.status==='added'){statusClass='file-added';statusLabel='A'}
            else if(f.status==='removed'){statusClass='file-removed';statusLabel='D'}
            else if(f.status==='renamed'){statusClass='file-renamed';statusLabel='R'}
            html+=`<div class="commit-file">
              <span class="file-status ${statusClass}">${statusLabel}</span>
              <span class="file-path">${escHtml(f.filename)}</span>
              <span class="file-stats">+${f.additions}/-${f.deletions}</span>
            </div>`;
          }
          html+='</div></div>';
          detail.innerHTML=html;
        }catch(e){detail.innerHTML=`<div class="list-empty">Error: ${e.message}</div>`}
      }
      detail.style.display='block';
      item.querySelector('.commit-expand').textContent='▼';
    });
    item.append(detail);
    list.append(item);
  }
  pane.innerHTML='';
  pane.append(list);
}

/* ─── Issues tab ─── */
async function renderIssues(pane){
  const data=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/issues?state=all&per_page=30&sort=updated&filter=all`);
  if(!data.length){pane.innerHTML='<div class="list-empty">No issues found.</div>';return}
  const list=document.createElement('div');
  list.className='issue-list';
  for(const issue of data){
    if(issue.pull_request)continue;
    const item=document.createElement('div');
    item.className='issue-item';
    const stateClass=issue.state==='open'?'open':'closed';
    const stateLabel=issue.state==='open'?'Open':'Closed';
    item.innerHTML=`
      <span class="issue-icon" style="color:${issue.state==='open'?'var(--green)':'var(--dim)'}">${ICONS.repo}</span>
      <div class="issue-body">
        <div class="issue-title">${escHtml(issue.title)} <span class="issue-state ${stateClass}">${stateLabel}</span></div>
        <div class="issue-meta">#${issue.number} by <strong>${escHtml(issue.user.login)}</strong> ${timeAgo(issue.created_at)}${issue.comments?` · ${issue.comments} comments`:''}</div>
      </div>
      <span class="commit-expand">▶</span>
    `;
    const detail=document.createElement('div');
    detail.className='issue-detail';
    detail.style.display='none';
    item.addEventListener('click',async(e)=>{
      if(e.target.closest('a'))return;
      const expanded=detail.style.display!=='none';
      if(expanded){detail.style.display='none';item.querySelector('.commit-expand').textContent='▶';return}
      if(!detail._loaded){
        detail.innerHTML='<div class="list-loading"><span class="spinner"></span>Loading issue…</div>';
        try{
          const [issueDetail, comments] = await Promise.all([
            ghFetch(`${API}/repos/${state.owner}/${state.repo}/issues/${issue.number}`),
            ghFetch(`${API}/repos/${state.owner}/${state.repo}/issues/${issue.number}/comments?per_page=20`)
          ]);
          detail._loaded=true;
          let html='<div class="commit-detail-body">';
          if(issueDetail.body)html+=`<div class="commit-desc">${escHtml(issueDetail.body.substring(0,5000))}</div>`;
          if(issueDetail.labels && issueDetail.labels.length){
            html+='<div class="issue-labels">';
            for(const lbl of issueDetail.labels){
              const bg=lbl.color?'#'+lbl.color:'var(--bg4)';
              html+=`<span class="issue-label" style="background:${bg}20;color:${bg};border-color:${bg}40">${escHtml(lbl.name)}</span>`;
            }
            html+='</div>';
          }
          if(comments.length){
            html+='<div class="issue-comments"><div class="comments-header">Comments ('+comments.length+')</div>';
            for(const cm of comments){
              const avatar=cm.user?.avatar_url?`<img class="commit-avatar" src="${cm.user.avatar_url}&s=40" alt="">`:'<div class="commit-avatar" style="background:var(--bg4);border-radius:50%"></div>';
              html+=`<div class="comment-item">
                ${avatar}
                <div class="comment-body">
                  <div class="comment-meta"><strong>${escHtml(cm.user.login)}</strong> commented ${timeAgo(cm.created_at)}</div>
                  <div class="comment-text">${escHtml(cm.body.substring(0,2000))}</div>
                </div>
              </div>`;
            }
            html+='</div>';
          }
          html+='</div>';
          detail.innerHTML=html;
        }catch(e){detail.innerHTML=`<div class="list-empty">Error: ${e.message}</div>`}
      }
      detail.style.display='block';
      item.querySelector('.commit-expand').textContent='▼';
    });
    item.append(detail);
    list.append(item);
  }
  pane.innerHTML='';
  pane.append(list);
}

/* ─── Releases tab ─── */
async function renderReleases(pane){
  const data=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/releases?per_page=30`);
  if(!data.length){pane.innerHTML='<div class="list-empty">No releases found.</div>';return}
  const list=document.createElement('div');
  list.className='issue-list';
  for(const r of data){
    const item=document.createElement('div');
    item.className='issue-item';
    const isPrerelease=r.prerelease?'<span class="pr-state merged" style="margin-left:6px">Pre-release</span>':'';
    item.innerHTML=`
      <span class="issue-icon" style="color:var(--purple)">${ICONS.download}</span>
      <div class="issue-body">
        <div class="issue-title">${escHtml(r.tag_name)} ${isPrerelease}</div>
        <div class="issue-meta"><strong>${escHtml(r.author.login)}</strong> released ${timeAgo(r.created_at)}${r.name?` · ${escHtml(r.name)}`:''}</div>
      </div>
      <span class="commit-expand">▶</span>
    `;
    const detail=document.createElement('div');
    detail.className='issue-detail';
    detail.style.display='none';
    item.addEventListener('click',async(e)=>{
      if(e.target.closest('a'))return;
      const expanded=detail.style.display!=='none';
      if(expanded){detail.style.display='none';item.querySelector('.commit-expand').textContent='▶';return}
      if(!detail._loaded){
        detail._loaded=true;
        let html='<div class="commit-detail-body">';
        if(r.body)html+=`<div class="commit-desc">${escHtml(r.body.substring(0,5000))}</div>`;
        if(r.assets && r.assets.length){
          html+='<div class="commit-files">';
          for(const a of r.assets){
            html+=`<div class="commit-file">
              <span class="file-status file-added">ZIP</span>
              <span class="file-path">${escHtml(a.name)}</span>
              <span class="file-stats">${humanSize(a.size)}</span>
              <a href="${a.browser_download_url}" target="_blank" style="color:var(--blue);text-decoration:none;font-size:10px;flex-shrink:0">Download</a>
            </div>`;
          }
          html+='</div>';
        }
        html+='</div>';
        detail.innerHTML=html;
      }
      detail.style.display='block';
      item.querySelector('.commit-expand').textContent='▼';
    });
    item.append(detail);
    list.append(item);
  }
  pane.innerHTML='';
  pane.append(list);
}

/* ─── Search tab ─── */
function renderSearchPane(pane){
  pane.innerHTML=`
    <div class="search-container" style="padding:16px;height:100%;display:flex;flex-direction:column">
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <input type="text" id="searchQuery" placeholder="Search code in ${escHtml(state.repo)}..." style="flex:1;background:#0f0f1a;border:1px solid #24253a;border-radius:6px;color:#c0caf5;padding:10px 14px;font-size:14px" autofocus>
        <select id="searchLang" style="background:#0f0f1a;border:1px solid #24253a;border-radius:6px;color:#c0caf5;padding:8px;font-size:13px">
          <option value="">All languages</option>
          <option>JavaScript</option><option>TypeScript</option><option>Python</option><option>Go</option>
          <option>Rust</option><option>Ruby</option><option>Java</option><option>C</option><option>C++</option>
          <option>CSS</option><option>HTML</option><option>Shell</option><option>Markdown</option>
          <option>JSON</option><option>YAML</option><option>Dockerfile</option><option>Makefile</option>
        </select>
        <button class="btn btn-primary" onclick="doSearch()">Search</button>
      </div>
      <div id="searchMeta" style="font-size:12px;color:#565f89;margin-bottom:8px"></div>
      <div id="searchResults" style="flex:1;overflow-y:auto"></div>
    </div>
  `;
  pane.querySelector('#searchQuery').addEventListener('keydown', e => { if(e.key==='Enter') doSearch(); });
}

async function doSearch(){
  const q=document.getElementById('searchQuery')?.value?.trim();
  if(!q)return;
  const lang=document.getElementById('searchLang')?.value||'';
  const results=document.getElementById('searchResults');
  const meta=document.getElementById('searchMeta');
  if(!results)return;
  results.innerHTML='<div class="list-loading"><span class="spinner"></span>Searching&hellip;</div>';
  if(meta)meta.textContent='';
  let query=`${q}+repo:${state.owner}/${state.repo}`;
  if(lang)query+=`+language:${lang}`;
  try{
    const data=await ghFetch(`${API}/search/code?q=${encodeURIComponent(query)}&per_page=30`);
    if(!data.items||!data.items.length){
      results.innerHTML='<div class="list-empty">No results found.</div>';
      if(meta)meta.textContent='0 results';
      return;
    }
    if(meta)meta.textContent=`${data.total_count} result${data.total_count!==1?'s':''}`;
    const list=document.createElement('div');
    list.className='issue-list';
    for(const item of data.items){
      const div=document.createElement('div');
      div.className='issue-item';
      const icon=fileIcon(item.name);
      const pathHtml=item.path.split('/').map((p,i,a)=>i<a.length-1?`<span style="color:#565f89">${escHtml(p)}</span>`:`<strong>${escHtml(p)}</strong>`).join('<span style="color:#414868">/</span>');
      div.innerHTML=`
        <span class="issue-icon" style="color:var(--blue)">${icon}</span>
        <div class="issue-body">
          <div class="issue-title">${pathHtml}</div>
          <div class="issue-meta"><a href="${item.html_url}" target="_blank">${escHtml(item.path)}</a></div>
        </div>
      `;
      div.addEventListener('click',()=>viewSearchFile(item));
      list.append(div);
    }
    results.innerHTML='';
    results.append(list);
  }catch(e){
    results.innerHTML=`<div class="list-empty">Error: ${e.message}</div>`;
    if(meta)meta.textContent='';
  }
}

async function viewSearchFile(item){
  state.path=item.path;
  state.branch=state.branch||repoData.default_branch;
  switchTab('files');
  render();
}

function escHtml(s){
  const d=document.createElement('div');
  d.textContent=s;
  return d.innerHTML;
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

/* ─── Activity ─── */
function renderActivity(root){
  const wrapper=el('div',{class:'activity-wrapper'});
  wrapper.innerHTML=`
    <button class="activity-toggle">
      <span class="activity-icon">${ICONS.calendar}</span>
      Recent Activity
      <span class="activity-arrow">▶</span>
    </button>
    <div class="activity-body" style="display:none"></div>
  `;
  root.append(wrapper);
  const btn=wrapper.querySelector('.activity-toggle');
  const body=wrapper.querySelector('.activity-body');
  let loaded=false;
  btn.addEventListener('click',async()=>{
    if(body.style.display!=='none'){
      body.style.display='none';
      btn.querySelector('.activity-arrow').textContent='▶';
      return;
    }
    body.style.display='block';
    btn.querySelector('.activity-arrow').textContent='▼';
    if(loaded)return;
    loaded=true;
    body.innerHTML='<div class="activity-loading">Loading…</div>';
    try{
      const events=await ghFetch(`${API}/repos/${state.owner}/${state.repo}/events?per_page=15`);
      if(!events.length){body.innerHTML='<div class="activity-empty">No recent activity.</div>';return}
      body.innerHTML='';
      for(const e of events){
        const item=el('div',{class:'activity-item'});
        const type=e.type.replace('Event','');
        const login=e.actor.login;
        const time=timeAgo(e.created_at);
        let desc='';
        if(type==='Push'){
          const ref=e.payload.ref.replace('refs/heads/','');
          const commits=e.payload.commits||[];
          const msgs=commits.slice(0,3).map(c=>c.message.split('\n')[0]).join('; ');
          desc=`Pushed to <strong>${ref}</strong>${msgs?`: ${msgs}`:''}${commits.length>3?` (+${commits.length-3} more)`:''}`;
        }else if(type==='Create'){
          desc=`Created <strong>${e.payload.ref_type}</strong> ${e.payload.ref||''}`;
        }else if(type==='Delete'){
          desc=`Deleted <strong>${e.payload.ref_type}</strong> ${e.payload.ref||''}`;
        }else if(type==='Issues'){
          const action=e.payload.action;
          desc=`${action} issue <strong>#${e.payload.issue.number}</strong>: ${e.payload.issue.title}`;
        }else if(type==='IssueComment'){
          desc=`commented on issue <strong>#${e.payload.issue.number}</strong>`;
        }else if(type==='PullRequest'){
          const action=e.payload.action;
          desc=`${action} PR <strong>#${e.payload.pull_request.number}</strong>: ${e.payload.pull_request.title}`;
        }else if(type==='Release'){
          desc=`published release <strong>${e.payload.release.tag_name}</strong>`;
        }else if(type==='Fork'){
          desc=`forked this repo to <strong>${e.payload.forkee.full_name}</strong>`;
        }else if(type==='Watch'){
          desc=`starred this repo`;
        }else if(type==='Member'){
          desc=`added <strong>${e.payload.member.login}</strong> as collaborator`;
        }else{
          desc=e.type;
        }
        if(type==='Push')item.innerHTML=`<span class="act-type act-push">${ICONS.left}</span>`;
        else if(type==='Issues'||type==='IssueComment')item.innerHTML=`<span class="act-type act-issue">${ICONS.repo}</span>`;
        else if(type==='PullRequest')item.innerHTML=`<span class="act-type act-pr">${ICONS.code}</span>`;
        else if(type==='Release')item.innerHTML=`<span class="act-type act-release">${ICONS.download}</span>`;
        else if(type==='Watch')item.innerHTML=`<span class="act-type act-star">${ICONS.star}</span>`;
        else if(type==='Create'||type==='Delete')item.innerHTML=`<span class="act-type act-branch">${ICONS.gitBranch}</span>`;
        else if(type==='Fork')item.innerHTML=`<span class="act-type act-fork">${ICONS.fork}</span>`;
        else item.innerHTML=`<span class="act-type">${ICONS.calendar}</span>`;
        const info=document.createElement('div');
        info.className='act-info';
        info.innerHTML=`<span class="act-desc">${desc}</span><span class="act-meta"><strong>${login}</strong> · ${time}</span>`;
        item.append(info);
        body.append(item);
      }
    }catch(e){
      body.innerHTML=`<div class="activity-empty">Failed to load activity: ${e.message}</div>`;
    }
  });
}

function timeAgo(dateStr){
  const diff=Date.now()-new Date(dateStr).getTime();
  const mins=Math.floor(diff/60000);
  if(mins<1)return 'just now';
  if(mins<60)return `${mins}m ago`;
  const hrs=Math.floor(mins/60);
  if(hrs<24)return `${hrs}h ago`;
  const days=Math.floor(hrs/24);
  if(days<30)return `${days}d ago`;
  const months=Math.floor(days/30);
  if(months<12)return `${months}mo ago`;
  return `${Math.floor(months/12)}y ago`;
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

function parseCSV(text){
  const lines=[];
  let cur='',q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"'){q=!q;continue}
    if(c==='\n'&&!q){lines.push(cur);cur='';continue}
    cur+=c;
  }
  if(cur)lines.push(cur);
  return lines.filter(l=>l.trim()).map(l=>{
    const row=[];let f='',qt=false;
    for(let i=0;i<l.length;i++){
      const c=l[i];
      if(c==='"'){qt=!qt;continue}
      if(c===','&&!qt){row.push(f.trim());f='';continue}
      f+=c;
    }
    row.push(f.trim());
    return row;
  });
}

function renderFilePreview(root,item){
  root.innerHTML='';
  const preview=el('div',{class:'file-preview'});
  const ext=item.name.split('.').pop().toLowerCase();
  const binaryExts=['png','jpg','jpeg','gif','webp','bmp','ico','avif','heic','tiff','mp3','flac','ogg','wav','mp4','mkv','avi','mov','webm','zip','tar','gz','bz2','xz','7z','rar','pdf','exe','dll','so','dmg','iso','img'];
  const isBinary=binaryExts.includes(ext)||item.size>1024*1024;

  const ghUrl=`https://github.com/${state.owner}/${state.repo}/blob/${state.branch}/${item.path}`;
  preview.innerHTML=`
    <div class="bar">
      ${fileIcon(item.name)}
      <span class="name">${item.name}</span>
      <span class="size">${humanSize(item.size)}</span>
      <a href="${ghUrl}" target="_blank" class="dl-btn" title="Open on GitHub">GitHub</a>
      <a href="${item.download_url}" target="_blank" class="dl-btn" download>Download</a>
      <button class="dl-btn" id="copyContentBtn" title="Copy file content">Copy</button>
      <button class="dl-btn" id="wrapBtn" title="Toggle word wrap">Wrap</button>
    </div>
  `;
  preview.querySelector('#copyContentBtn').addEventListener('click', async () => {
    try {
      const r = await fetch(item.download_url);
      const text = await r.text();
      await navigator.clipboard.writeText(text);
      const btn = preview.querySelector('#copyContentBtn');
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    } catch(e) {
      setStatus('Failed to copy: ' + e.message, 'error');
    }
  });

  let wrapped = false;
  preview.querySelector('#wrapBtn')?.addEventListener('click', () => {
    wrapped = !wrapped;
    const ctEls = lnWrap?.querySelectorAll('.ct') || [];
    const btn = preview.querySelector('#wrapBtn');
    if (btn) btn.style.background = wrapped ? '#32345a' : '';
    ctEls.forEach(el => {
      el.style.whiteSpace = wrapped ? 'pre-wrap' : 'pre';
      el.style.overflowX = wrapped ? 'hidden' : 'auto';
      el.style.wordBreak = wrapped ? 'break-all' : '';
    });
  });

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
  }else if(['csv','tsv'].includes(ext)&&item.size<512*1024){
    fetch(item.download_url).then(r=>r.text()).then(t=>{
      const rows=parseCSV(t);
      if(rows.length<2){preview.innerHTML+='<p style="padding:16px;color:#565f89">Empty or unreadable CSV</p>';return}
      const table=document.createElement('table');
      table.style.cssText='width:100%;border-collapse:collapse;font-size:13px;margin:8px 0';
      const headers=rows[0];
      const thead=document.createElement('thead');
      const tr=document.createElement('tr');
      headers.forEach(h=>{
        const th=document.createElement('th');
        th.textContent=h;
        th.style.cssText='padding:8px 12px;text-align:left;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#565f89;background:#1a1b2e;border-bottom:2px solid #24253a;position:sticky;top:0';
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);
      const tbody=document.createElement('tbody');
      rows.slice(1).forEach(row=>{
        const tr2=document.createElement('tr');
        headers.forEach((_,i)=>{
          const td=document.createElement('td');
          td.textContent=row[i]||'';
          td.style.cssText='padding:6px 12px;border-bottom:1px solid #1a1b2e;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
          const n=parseFloat(row[i]);if(!isNaN(n)){td.style.textAlign='right';td.style.fontVariantNumeric='tabular-nums'}
          tr2.appendChild(td);
        });
        tbody.appendChild(tr2);
      });
      table.appendChild(tbody);
      preview.append(table);
      const info=el('div');
      info.textContent=`${rows.length-1} rows, ${headers.length} columns`;
      info.style.cssText='padding:8px 12px;font-size:12px;color:#565f89;border-top:1px solid #24253a';
      preview.append(info);
    }).catch(()=>{preview.innerHTML+='<p style="padding:16px;color:#f7768e">Error loading CSV</p>'});
  }else if(['md','markdown'].includes(ext)&&item.size<512*1024){
    const note=el('div',{class:'markdown-body'});
    note.style.cssText='padding:20px;max-width:900px;line-height:1.7';
    note.innerHTML='<p style="color:#565f89">Rendering markdown…</p>';
    preview.append(note);
    const mdUrl=item.download_url;
    const renderMd=(marked)=>{
      fetch(mdUrl).then(r=>r.text()).then(t=>{
        note.innerHTML=marked.parse(t);
        note.querySelectorAll('a').forEach(a=>{a.target='_blank';a.rel='noopener'});
      }).catch(()=>{note.innerHTML='<p style="color:#f7768e">Error loading markdown</p>'});
    };
    if(typeof marked==='undefined'){
      const link=document.createElement('link');
      link.rel='stylesheet';link.href='https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown-dark.min.css';
      document.head.append(link);
      const script=document.createElement('script');
      script.src='https://cdn.jsdelivr.net/npm/marked@15/marked.min.js';
      script.onload=()=>renderMd(marked);
      document.head.append(script);
    }else{
      renderMd(marked);
    }
  }else{
    const langClass=item.name?fileToLang(item.name):'';
    const lnWrap=el('div',{class:'code-wrap'});
    const pre=el('pre');
    const code=el('code');
    if(langClass)code.className='language-'+langClass;
    code.textContent='Loading…';
    pre.append(code);
    lnWrap.append(pre);
    preview.append(lnWrap);
    let hljsLoaded=false;
    const renderWithLines=(text)=>{
      const lines=text.split('\n');
      const pad=String(lines.length).length;
      lnWrap.innerHTML=lines.map((l,i)=>{
        const num=String(i+1).padStart(pad);
        const esc=l.replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return `<div class="code-line"><span class="ln">${num}</span><span class="ct">${esc||' '}</span></div>`;
      }).join('');
    };
    const highlightAndRender=()=>{
      if(typeof hljs!=='undefined'&&hljsLoaded){
        renderWithLines(code.textContent);
        lnWrap.querySelectorAll('.ct').forEach(el=>{
          try{hljs.highlightElement(el)}catch(e){}
        });
      }
    };
    fetch(item.download_url).then(r=>r.text()).then(t=>{
      code.textContent=t;
      if(hljsLoaded)highlightAndRender();
      else renderWithLines(t);
    }).catch(()=>{code.textContent='[Error loading file content]'});
    if(typeof hljs==='undefined'){
      const link=document.createElement('link');
      link.rel='stylesheet';link.href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/styles/tokyo-night-dark.min.css';
      document.head.append(link);
      const script=document.createElement('script');
      script.src='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/highlight.min.js';
      script.onload=()=>{hljsLoaded=true;if(code.textContent!=='Loading…')highlightAndRender()};
      document.head.append(script);
    }else{
      hljsLoaded=true;
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

/* ─── Go to File (CMD+K / Ctrl+P) ─── */
let allFilesCache = {};
let goToFileAbort = null;

async function fetchAllFiles(owner, repo, branch) {
  const key = `${owner}/${repo}/${branch}`;
  if (allFilesCache[key]) return allFilesCache[key];
  try {
    const ref = await ghFetch(`${API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    const files = [];
    for (const item of ref.tree || []) {
      if (item.type === 'blob') files.push(item.path);
    }
    allFilesCache[key] = files;
    return files;
  } catch (e) {
    return [];
  }
}

function showGoToFile() {
  const existing = qs('.goto-overlay');
  if (existing) { existing.remove(); return; }

  const overlay = el('div', { class: 'goto-overlay' });
  overlay.innerHTML = `
    <div class="goto-box">
      <div class="goto-header">
        <span class="goto-icon">${ICONS.code}</span>
        <input type="text" class="goto-input" placeholder="Go to file in ${state.repo}..." autofocus autocomplete="off">
        <span class="goto-hint">Esc to close</span>
      </div>
      <div class="goto-status">Type to search files…</div>
      <div class="goto-results"></div>
    </div>
  `;
  document.body.append(overlay);

  const input = overlay.querySelector('.goto-input');
  const results = overlay.querySelector('.goto-results');
  const status = overlay.querySelector('.goto-status');
  let idx = -1;
  let fileList = [];

  input.focus();

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  fetchAllFiles(state.owner, state.repo, state.branch).then(files => {
    if (!document.body.contains(overlay)) return;
    fileList = files;
    status.textContent = `${files.length} files`;
  });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    idx = -1;
    if (!q || !fileList.length) {
      results.innerHTML = '';
      if (!q) status.textContent = fileList.length ? `${fileList.length} files` : 'Type to search files…';
      else status.textContent = 'No results';
      return;
    }
    const matches = fileList.filter(f => f.toLowerCase().includes(q)).slice(0, 80);
    if (!matches.length) {
      results.innerHTML = '';
      status.textContent = 'No results';
      return;
    }
    status.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
    results.innerHTML = matches.map((f, i) => {
      const icon = fileIcon(f.split('/').pop());
      const parts = f.split('/');
      const name = parts.pop();
      const dir = parts.join('/');
      return `<div class="goto-item" data-idx="${i}">
        <span class="goto-item-icon">${icon}</span>
        <span class="goto-item-name">${escHtml(name)}</span>
        <span class="goto-item-dir">${dir ? escHtml(dir) : '/'}</span>
      </div>`;
    }).join('');
    results.querySelectorAll('.goto-item').forEach(el => {
      el.addEventListener('click', () => selectGoToFile(matches[+el.dataset.idx]));
    });
  });

  input.addEventListener('keydown', e => {
    const items = results.querySelectorAll('.goto-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      idx = Math.min(idx + 1, items.length - 1);
      highlightGoToItems(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      idx = Math.max(idx - 1, 0);
      highlightGoToItems(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (idx >= 0 && items.length) {
        const match = fileList.filter(f => f.toLowerCase().includes(input.value.toLowerCase().trim()))[idx];
        if (match) selectGoToFile(match);
      }
    } else if (e.key === 'Escape') {
      overlay.remove();
    }
  });

  function highlightGoToItems(items) {
    items.forEach((el, i) => el.classList.toggle('hl', i === idx));
    if (idx >= 0) items[idx].scrollIntoView({ block: 'nearest' });
  }
}

function selectGoToFile(path) {
  const overlay = qs('.goto-overlay');
  if (overlay) overlay.remove();
  state.path = path;
  switchTab('files');
  render();
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
      <div class="row"><span class="key">Ctrl+K</span> <span class="desc">Go to file</span></div>
      <div class="row"><span class="key">t</span> <span class="desc">Focus file search</span></div>
      <div class="row"><span class="key">/</span> <span class="desc">Focus repo input</span></div>
      <div class="row"><span class="key">1-6</span> <span class="desc">Switch tabs (Files, Commits, PRs, Issues, Releases, Search)</span></div>
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
    if((e.metaKey||e.ctrlKey)&&e.key==='k'){
      e.preventDefault();
      if(repoData)showGoToFile();
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
    // Tab switching: 1=Files, 2=Commits, 3=PRs, 4=Issues, 5=Releases, 6=Search
    if(e.key>='1'&&e.key<='6'&&repoData){
      const tabs=['files','commits','prs','issues','releases','search'];
      const idx=parseInt(e.key)-1;
      if(idx<tabs.length&&qs(`.tab[data-tab="${tabs[idx]}"]`)){
        e.preventDefault();
        switchTab(tabs[idx]);
      }
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
