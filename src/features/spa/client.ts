const initializeSpa = (spa: HTMLElement) => {
  const tabs = [...spa.querySelectorAll<HTMLButtonElement>('[data-spa-tab]')];
  const panels = [...spa.querySelectorAll<HTMLElement>('[data-spa-panel]')];
  const activate = (panelName: string) => {
    tabs.forEach((tab) => { const active = tab.dataset.spaTab === panelName; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    panels.forEach((panel) => { panel.hidden = panel.dataset.spaPanel !== panelName; });
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => activate(tab.dataset.spaTab ?? 'favorites')));
  activate('favorites');
};
document.querySelectorAll<HTMLElement>('[data-city-spa]').forEach(initializeSpa);
