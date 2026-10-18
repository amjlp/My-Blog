/* 插画舞台：五张原素材可直接选择，动画只操作 transform / opacity。 */
(() => {
  if (window.alariceEntrance) return;
  window.alariceEntrance = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};
  function mount() {
    cleanup();
    const header = document.querySelector('#page-header.full_page');
    if (!header) return;
    const controller = new AbortController();
    let alive = true, request = 0, selected = -1;
    const works = [
      // [id, 中文名, 英文名, 纵向位置%, 背景缩放, 横向位置%]
      // 竖构图越窄（如 02 和服），越要把纵向位置调小、放大并右对齐，才能把头部留在画框左侧的可见区
      ['37135597', '绯红时刻', 'CRIMSON HOUR', 12, 1, 50],
      ['59365970', '蔷薇长眠', 'ROSE SLUMBER', 50, 1, 20],
      ['99540361', '温柔片刻', 'A QUIET MOMENT', 10, 1, 50],
      ['103441036', '盛夏花语', 'SUMMER BLOOM', 22, 1, 50],
      ['112682157', '时之刻印', 'THE TIMEKEEPER', 26, 1, 50]
    ];
    const stage = document.createElement('div');
    stage.id = 'illustration-stage';
    stage.innerHTML = `
      <div class="chronograph" aria-hidden="true">
        <div class="clock-arrival"><div class="clock-outer"></div><div class="clock-inner"></div>
        <span class="roman r12">Ⅻ</span><span class="roman r3">Ⅲ</span><span class="roman r6">Ⅵ</span><span class="roman r9">Ⅸ</span>
        <div class="clock-hand"></div></div>
      </div>
      <div class="art-arrival"><div class="art-frame"><img class="featured-art" alt="" width="835" height="1181" decoding="async"><div class="art-glint" aria-hidden="true"></div></div></div>
      <div class="stage-caption"><span class="stage-number">01 / 05</span><span class="stage-name"></span></div>
      <div class="stage-selector" role="group" aria-label="选择插画"></div>
      <div class="stage-beam" aria-hidden="true"></div>`;
    const img = stage.querySelector('.featured-art');
    const controls = stage.querySelector('.stage-selector');
    const imageURL = (id, small = innerWidth < 768) => `/img/hero/${id}_p0${small ? '-sm' : ''}.webp`;
    works.forEach(([id, title], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'art-choice';
      button.setAttribute('aria-label', `查看${title}`);
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = `<img src="${imageURL(id, true)}" alt="" width="48" height="64" loading="lazy" fetchpriority="low"><span>0${index + 1}</span>`;
      button.addEventListener('click', () => select(index), {signal:controller.signal});
      controls.append(button);
    });
    async function select(index) {
      if (index === selected) return;
      const token = ++request;
      const [id, title, english, heroY, heroZoom, heroX] = works[index];
      const preload = new Image();
      preload.src = imageURL(id);
      try { await preload.decode(); } catch { return; }
      if (!alive || token !== request) return;
      selected = index;
      img.src = preload.src;
      img.alt = `时崎狂三插画 · ${title}`;
      // 背景联动：选中的插画同时成为首页背景（淡出 → 换图 → 淡入，避免硬切）
      const heroURL = imageURL(id);
      header.classList.add('is-hero-swap');
      window.setTimeout(() => {
        const root = document.documentElement;
        root.style.setProperty('--hero', `url('${heroURL}')`);
        root.style.setProperty('--hero-pos', `${heroY == null ? 18 : heroY}%`);
        root.style.setProperty('--hero-zoom', String(heroZoom == null ? 1 : heroZoom));
        root.style.setProperty('--hero-x', `${heroX == null ? 50 : heroX}%`);
        window.requestAnimationFrame(() => header.classList.remove('is-hero-swap'));
      }, reduced.matches ? 0 : 180);
      stage.querySelector('.stage-number').textContent = `0${index + 1} / 05`;
      stage.querySelector('.stage-name').textContent = `${title} / ${english}`;
      [...controls.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      if (!reduced.matches) {
        img.getAnimations().forEach(animation => animation.cancel());
        img.animate([{opacity:.15,transform:'translateX(34px) scale(1.04)'},{opacity:1,transform:'translateX(0) scale(1)'}], {duration:750,easing:'cubic-bezier(.16,1,.3,1)'});
      }
    }
    header.append(stage);
    header.classList.add('has-illustration-stage');
    // ?hero=1~5：把第 N 张固定为背景（预览/调试用），并覆盖主题默认选择
    const heroParam = new URLSearchParams(location.search).get('hero');
    let heroOverride = heroParam ? parseInt(heroParam, 10) - 1 : NaN;
    if (!(heroOverride >= 0 && heroOverride < works.length)) heroOverride = NaN;
    const mode = () => select(Number.isNaN(heroOverride) ? (document.documentElement.dataset.theme === 'light' ? 3 : 0) : heroOverride);
    const observer = new MutationObserver(mode);
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    const motion = () => { if(reduced.matches) stage.getAnimations({subtree:true}).forEach(animation => animation.cancel()); };
    reduced.addEventListener('change',motion,{signal:controller.signal});
    const visibility = () => {document.documentElement.dataset.visualHidden=String(document.hidden);};
    document.addEventListener('visibilitychange',visibility,{signal:controller.signal});
    visibility();
    mode();
    cleanup = () => {alive=false;controller.abort();observer.disconnect();stage.remove();header.classList.remove('has-illustration-stage');};
  }
  document.addEventListener('pjax:send', () => cleanup());
  document.addEventListener('pjax:complete', mount);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
