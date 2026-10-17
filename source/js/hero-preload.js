/* 在首屏样式前按 Butterfly 已选择的模式预加载，避免两种横幅同时下载。 */
(() => {
  // Butterfly 5.7.0 在 effect:false + PJAX 时仍引用全局 typed。
  // 提供空实例使其原生销毁回调安全短路，不修改主题文件。
  window.typed = window.typed || null;
  document.documentElement.dataset.visualPage = location.pathname.startsWith('/about') ? 'about' : 'other';
  const home = location.pathname === '/' || location.pathname === '/index.html';
  if (!home) return;
  const dark = document.documentElement.dataset.theme !== 'light';
  const id = dark ? '37135597' : '103441036';
  const link = document.createElement('link');
  link.rel = 'preload'; link.as = 'image'; link.type = 'image/webp';
  link.href = `/img/hero/${id}_p0${matchMedia('(max-width: 767px)').matches ? '-sm' : ''}.webp`;
  link.fetchPriority = 'high'; document.head.append(link);
})();
