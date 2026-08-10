const initializeSpa = (spa: HTMLElement) => {
  const tabs = [...spa.querySelectorAll<HTMLButtonElement>('[data-spa-tab]')];
  const panels = [...spa.querySelectorAll<HTMLElement>('[data-spa-panel]')];
  const activate = (panelName: string) => {
    tabs.forEach((tab) => { const active = tab.dataset.spaTab === panelName; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    panels.forEach((panel) => { panel.hidden = panel.dataset.spaPanel !== panelName; });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.spaTab ?? 'favorites'));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault(); const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus(); activate(tabs[next].dataset.spaTab ?? 'favorites');
    });
  });
  const defaultTab = tabs.find((tab) => tab.dataset.spaTab === 'things-to-do') ?? tabs.find((tab) => tab.dataset.spaTab !== 'favorites') ?? tabs[0];
  activate(defaultTab?.dataset.spaTab ?? 'favorites');
};
document.querySelectorAll<HTMLElement>('[data-city-spa]').forEach(initializeSpa);
