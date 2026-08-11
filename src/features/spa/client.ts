const initializeSpa = (spa: HTMLElement) => {
  if (spa.dataset.spaReady === 'true') return;
  spa.dataset.spaReady = 'true';

  const tabs = [...spa.querySelectorAll<HTMLButtonElement>('[data-spa-tab]')];
  const panels = [...spa.querySelectorAll<HTMLElement>('[data-spa-panel]')];
  const available = new Set(tabs.map((tab) => tab.dataset.spaTab ?? ''));
  const defaultTab = spa.dataset.spaDefault || 'things-to-do';

  const activate = (panelName: string, updateUrl = true) => {
    const next = available.has(panelName) ? panelName : defaultTab;
    tabs.forEach((tab) => {
      const active = tab.dataset.spaTab === next;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.dataset.spaPanel === next;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    if (updateUrl && next) history.replaceState(null, '', `${location.pathname}${location.search}#${next}`);
    spa.dispatchEvent(new CustomEvent('atlas:spa-changed', { bubbles: true, detail: { slug: next } }));
  };

  const activateFromHash = () => {
    const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
    activate(available.has(hash) ? hash : defaultTab, false);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.spaTab ?? defaultTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next]?.focus();
      activate(tabs[next]?.dataset.spaTab ?? defaultTab);
    });
  });

  activateFromHash();
  window.addEventListener('hashchange', activateFromHash);
};

const setupSpas = () => document.querySelectorAll<HTMLElement>('[data-city-spa]').forEach(initializeSpa);
setupSpas();
document.addEventListener('astro:page-load', setupSpas);
