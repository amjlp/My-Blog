/* 原生 JS 渐进增强：PJAX 切页前统一清理，完成后重新初始化。 */
(() => {
  if (window.alariceVisual) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width:768px) and (hover:hover) and (pointer:fine)');
  let dispose = () => {};
  function init() {
    dispose();
    const abort = new AbortController(), clean = [], signal = abort.signal;
    const on = (el, name, fn, opts={}) => el.addEventListener(name, fn, {...opts,signal});
    const add = (tag,id,parent=document.body) => {const el=document.createElement(tag);el.id=id;el.setAttribute('aria-hidden','true');parent.append(el);clean.push(()=>el.remove());return el;};
    const header=document.querySelector('#page-header'), home=header?.classList.contains('full_page');
    const p=location.pathname;document.documentElement.dataset.visualPage=p.startsWith('/about')?'about':p.startsWith('/archives')?'archives':p.startsWith('/tags')?'tags':'other';
    const progress=add('div','visual-progress');
    const footer=document.querySelector('#footer .footer-other');
    const seal=footer?add('div','visual-seal',footer):null;
    if(seal){seal.className='visual-seal';seal.textContent='Ⅻ · A';}
    const toc=document.querySelector('#card-toc .toc-content');
    const marker=toc?add('i','visual-toc-marker',toc):null;if(marker)marker.className='toc-marker';
    function updateToc(){const active=toc?.querySelector('.toc-link.active');if(marker){marker.style.opacity=active?'1':'0';if(active)marker.style.transform=`translateY(${active.getBoundingClientRect().top-toc.getBoundingClientRect().top+toc.scrollTop}px)`;}}
    if(toc){const mo=new MutationObserver(updateToc);mo.observe(toc,{subtree:true,attributes:true,attributeFilter:['class']});clean.push(()=>mo.disconnect());on(toc,'scroll',updateToc,{passive:true});}
    let scrollFrame=0;
    function scroll(){scrollFrame=0;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;if(!reduce.matches){if(home&&desktop.matches)header.style.setProperty('--parallax',`${Math.min(40,scrollY*.07)}px`);if(seal)seal.style.setProperty('--seal-angle',`${scrollY*.025}deg`);}updateToc();}
    on(window,'scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(scroll)},{passive:true});on(window,'resize',scroll);scroll();clean.push(()=>cancelAnimationFrame(scrollFrame));
    // 只将首屏之外的内容隐藏，JS 失败和禁用时正文默认可见。
    if(!reduce.matches&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach((e,i)=>{if(e.isIntersecting){e.target.style.setProperty('--delay',`${Math.min(i,5)*80}ms`);e.target.classList.add('is-visible');io.unobserve(e.target);}}),{threshold:.05});document.querySelectorAll('.recent-post-item,#article-container>p,#article-container>h2').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('visual-reveal');io.observe(el);}});clean.push(()=>{io.disconnect();document.querySelectorAll('.visual-reveal').forEach(el=>el.classList.remove('visual-reveal','is-visible'));});}
    // 默认封面按模式切换，不改作者明确指定的封面。
    const covers=[...document.querySelectorAll('img')].filter(img=>/\/(?:37135597|99540361)_p0(?:-sm)?\.webp/.test(img.getAttribute('src')||''));
    function mode(){const light=document.documentElement.dataset.theme==='light';covers.forEach(img=>{img.src=`/img/hero/${light?'99540361':'37135597'}_p0${innerWidth<768?'-sm':''}.webp`;});}
    const modeObserver=new MutationObserver(mode);modeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});clean.push(()=>modeObserver.disconnect());mode();
    // 保留打字机体验；关闭主题的无减弱动效分支，改为可取消的原生实现。
    const subtitle=document.querySelector('#subtitle');let timer;
    if(subtitle&&!reduce.matches){const lines=['记录 · 思考 · 折腾','保持好奇，持续输入','长期主义的写作'];let line=0,n=lines[0].length,back=true;const tick=()=>{if(document.hidden){timer=setTimeout(tick,500);return;}n+=back?-1:1;subtitle.textContent=lines[line].slice(0,n);let delay=back?65:130;if(n===0){back=false;line=(line+1)%lines.length;delay=400;}if(n===lines[line].length&&!back){back=true;delay=2400;}timer=setTimeout(tick,delay);};timer=setTimeout(tick,3000);clean.push(()=>clearTimeout(timer));}else if(subtitle)subtitle.textContent='记录 · 思考 · 折腾';
    if(!reduce.matches&&desktop.matches){
      const glow=add('div','visual-glow');on(window,'pointermove',e=>{glow.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0)`;},{passive:true});
      document.querySelectorAll('.post_cover').forEach(cover=>{const img=cover.querySelector('img');if(!img)return;on(cover,'pointermove',e=>{const r=cover.getBoundingClientRect();img.style.transform=`rotateX(${(0.5-(e.clientY-r.top)/r.height)*12}deg) rotateY(${((e.clientX-r.left)/r.width-.5)*12}deg) scale(1.025)`;});on(cover,'pointerleave',()=>img.style.transform='');clean.push(()=>img.style.transform='');});
      if(home||document.querySelector('#post')){
        const canvas=add('canvas','visual-dust'),ctx=canvas.getContext('2d');let frame=0,last=0,w=0,h=0;
        const dots=Array.from({length:Math.min(18,Math.max(6,Math.floor(innerWidth/110)))},()=>({x:Math.random(),y:Math.random(),r:.7+Math.random()*1.4,v:.008+Math.random()*.012}));
        const size=()=>{w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);};size();on(window,'resize',size);
        const draw=t=>{const dt=Math.min((t-last)/1000,.05);last=t;ctx.clearRect(0,0,w,h);ctx.fillStyle='#D9A24A';dots.forEach(p=>{p.y=(p.y+dt*p.v)%1;ctx.beginPath();ctx.arc(p.x*w,p.y*h,p.r,0,Math.PI*2);ctx.fill();});frame=requestAnimationFrame(draw);};
        const visibility=()=>{cancelAnimationFrame(frame);if(!document.hidden){last=performance.now();frame=requestAnimationFrame(draw);}};on(document,'visibilitychange',visibility);visibility();clean.push(()=>cancelAnimationFrame(frame));
      }
    }
    dispose=()=>{abort.abort();clean.forEach(fn=>fn());header?.style.removeProperty('--parallax');};
  }
  window.alariceVisual={init};
  document.addEventListener('pjax:send',()=>dispose());
  document.addEventListener('pjax:complete',init);
  reduce.addEventListener('change',init);desktop.addEventListener('change',init);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
