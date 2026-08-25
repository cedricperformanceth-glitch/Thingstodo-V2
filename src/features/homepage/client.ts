import { HOME_COUNTRIES, HOME_SCENE_ASSETS, type HomeCountryConfig, type HomeCountrySlug } from './countries';

type Target = Element | Element[] | string;
type Vars = Record<string, unknown>;
interface Timeline {
  to(target: Target, vars: Vars, at?: number | string): Timeline;
  fromTo(target: Target, from: Vars, to: Vars, at?: number | string): Timeline;
  set(target: Target, vars: Vars, at?: number | string): Timeline;
  call(fn: () => void, params?: unknown[], at?: number | string): Timeline;
  kill(): void;
}
interface Gsap { timeline(config?: Vars): Timeline; set(target: Target, vars: Vars): void; killTweensOf(target: Target): void; }
declare global { interface Window { gsap?: Gsap; } }

const W = 1448;
const TABLEAU_WIDTH_RATIO = 0.8;
const FRAME_OVERHANG = 32;
const MODE = { IDLE:'idle', SELECTING:'selecting', SELECTED:'selected', OPENING:'opening', OPEN:'open', SWITCHING:'switching', RETURNING:'returning', NAVIGATING:'navigating' } as const;
type Mode = (typeof MODE)[keyof typeof MODE];

const countries = new Map<HomeCountrySlug, HomeCountryConfig>(HOME_COUNTRIES.map((country) => [country.slug, country]));
const $ = <T extends Element>(root: ParentNode, selector: string): T => {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Missing Atlas homepage element: ${selector}`);
  return node;
};

const preload = async (): Promise<void> => {
  const urls = new Set<string>(Object.values(HOME_SCENE_ASSETS));
  HOME_COUNTRIES.forEach((country) => {
    urls.add(country.assets.shelfSpine);
    urls.add(country.assets.shelfExtracted);
    urls.add(country.assets.closed);
    country.assets.openingFrames.forEach((src) => urls.add(src));
    if (country.assets.open) urls.add(country.assets.open);
  });
  await Promise.all([...urls].map((src) => new Promise<void>((resolve) => {
    const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = src;
  })));
};

export const initAtlasHomepage = (): void => {
  const root = document.querySelector<HTMLElement>('[data-atlas-home]');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';
  const gsap = window.gsap;
  if (!gsap) { root.dataset.ready = 'true'; root.setAttribute('aria-busy', 'false'); return; }

  const tableau = $<HTMLElement>(root, '[data-atlas-tableau]');
  const bgOn = $<HTMLImageElement>(root, '[data-background-on]');
  const bgOff = $<HTMLImageElement>(root, '[data-background-off]');
  const lamp = $<HTMLButtonElement>(root, '[data-lamp-pull]');
  const extracted = $<HTMLButtonElement>(root, '[data-country-extracted]');
  const extractedImage = $<HTMLImageElement>(root, '[data-country-extracted-image]');
  const desk = $<HTMLButtonElement>(root, '[data-desk-book]');
  const neutral = $<HTMLImageElement>(root, '[data-desk-neutral]');
  const closed = [$<HTMLImageElement>(root, '[data-desk-closed-a]'), $<HTMLImageElement>(root, '[data-desk-closed-b]')] as const;
  const opening1 = $<HTMLImageElement>(root, '[data-desk-opening-1]');
  const opening2 = $<HTMLImageElement>(root, '[data-desk-opening-2]');
  const open = $<HTMLImageElement>(root, '[data-desk-open]');
  const globe = $<HTMLElement>(root, '[data-globe]');
  const globeAsia = $<HTMLImageElement>(root, '[data-globe-asia]');
  const globeEurope = $<HTMLImageElement>(root, '[data-globe-europe]');
  const triggers = new Map<HomeCountrySlug, HTMLButtonElement>();
  root.querySelectorAll<HTMLButtonElement>('[data-country-trigger]').forEach((button) => {
    const slug = button.dataset.countryTrigger as HomeCountrySlug | undefined;
    if (slug && countries.has(slug)) triggers.set(slug, button);
  });

  let mode: Mode = MODE.IDLE;
  let selected: HomeCountrySlug | null = null;
  let lampOn = true;
  let bookTl: Timeline | null = null;
  let lampTl: Timeline | null = null;
  let globeTl: Timeline | null = null;
  let activeClosed = 0;
  let visibleDesk: HTMLImageElement = neutral;

  const country = (slug: HomeCountrySlug): HomeCountryConfig => {
    const value = countries.get(slug); if (!value) throw new Error(`Unknown country: ${slug}`); return value;
  };
  const trigger = (slug: HomeCountrySlug): HTMLButtonElement => {
    const value = triggers.get(slug); if (!value) throw new Error(`Missing trigger: ${slug}`); return value;
  };
  const setMode = (value: Mode): void => { mode = value; root.dataset.mode = value; };
  const fit = (): void => {
    const scale = (window.innerWidth * TABLEAU_WIDTH_RATIO) / (W + FRAME_OVERHANG * 2);
    tableau.style.setProperty('--atlas-scale', String(scale));
  };
  const stop = (timeline: Timeline | null): void => timeline?.kill();
  const allDesk = [neutral, ...closed, opening1, opening2, open];

  const resetGlobe = (): void => {
    gsap.set(globeAsia, { opacity:1 });
    gsap.set(globeEurope, { clearProps:'transform,filter', opacity:0 });
  };
  const globeCue = (): void => {
    stop(globeTl); resetGlobe();
    globeTl = gsap.timeline({ onComplete:() => { resetGlobe(); globeTl = null; } })
      .fromTo(
        globeEurope,
        { opacity:0, xPercent:8, scaleX:0.82, filter:'blur(0.75px)' },
        { opacity:0.92, xPercent:0, scaleX:1, filter:'blur(0.08px)', duration:0.52, ease:'power2.out' },
        0.04,
      )
      .to(globeEurope, { opacity:0.92, duration:0.18, ease:'sine.inOut' }, 0.52)
      .to(
        globeEurope,
        { opacity:0, xPercent:-8, scaleX:0.82, filter:'blur(0.75px)', duration:0.52, ease:'sine.inOut' },
        0.70,
      );
  };

  const resetDesk = (): void => {
    gsap.set([closed[0], closed[1], opening1, opening2, open], { opacity:0, visibility:'hidden', clearProps:'transform' });
    gsap.set(neutral, { opacity:1, visibility:'visible', clearProps:'scale,yPercent' });
    activeClosed = 0; visibleDesk = neutral;
  };
  const clearShelf = (slug: HomeCountrySlug): void => {
    const button = trigger(slug); button.classList.remove('is-selected');
    gsap.set($<HTMLImageElement>(button, 'img'), { clearProps:'opacity,transform' });
  };
  const configureExtracted = (c: HomeCountryConfig): void => {
    extractedImage.src = c.assets.shelfExtracted;
    extracted.style.setProperty('--extract-left', `${c.extractedLeft}%`);
    extracted.style.setProperty('--extract-top', `${c.extractedTop}%`);
    extracted.setAttribute('aria-label', `Open ${c.name} notebook`);
  };
  const configureClosed = (c: HomeCountryConfig, layer: HTMLImageElement): void => {
    layer.src = c.assets.closed; desk.setAttribute('aria-label', `${c.name} notebook on desk`);
  };
  const configureOpening = (c: HomeCountryConfig): void => {
    opening1.src = c.assets.openingFrames[0]; opening2.src = c.assets.openingFrames[1];
    if (c.assets.open) open.src = c.assets.open; else open.removeAttribute('src');
  };

  const interactive = (): void => {
    const ready = root.dataset.ready === 'true';
    const c = selected ? country(selected) : null;
    lamp.disabled = !ready || !!bookTl || !!lampTl;
    triggers.forEach((button, slug) => button.disabled = !ready || !!bookTl || selected === slug);
    extracted.disabled = !ready || !!bookTl || mode !== MODE.SELECTED;
    desk.disabled = !ready || !!bookTl || (mode !== MODE.SELECTED && !(mode === MODE.OPEN && !!c?.destination && !!c.assets.open));
  };
  const finish = (next: Mode): void => { bookTl = null; setMode(next); interactive(); };

  const extractOut = (tl: Timeline, c: HomeCountryConfig, at: number): void => {
    const button = trigger(c.slug); const spine = $<HTMLImageElement>(button, 'img'); button.classList.add('is-selected');
    tl.to(spine, { yPercent:12, duration:0.18, ease:'power2.out' }, at)
      .to(spine, { opacity:0, duration:0.16 }, at + 0.14)
      .set(extracted, { opacity:1, visibility:'visible' }, at + 0.12)
      .to(extracted, { scale:c.motion.selectedScale, rotation:c.motion.selectedRotation, xPercent:c.motion.selectedXPercent, yPercent:c.motion.selectedYPercent, duration:0.7, ease:'power3.out' }, at + 0.12);
  };
  const extractBack = (tl: Timeline, c: HomeCountryConfig, at: number): void => {
    const spine = $<HTMLImageElement>(trigger(c.slug), 'img');
    tl.set(extracted, { opacity:1, visibility:'visible' }, at)
      .to(extracted, { scale:0.22, rotation:5, xPercent:0, yPercent:0, duration:0.48, ease:'power3.inOut' }, at)
      .to(extracted, { opacity:0, visibility:'hidden', duration:0.12 }, at + 0.36)
      .fromTo(spine, { opacity:0, yPercent:8 }, { opacity:1, yPercent:0, duration:0.26, ease:'power2.out' }, at + 0.3);
  };

  const selectFirst = (c: HomeCountryConfig): void => {
    setMode(MODE.SELECTING); selected = c.slug; interactive(); configureExtracted(c);
    const next = closed[1 - activeClosed]; configureClosed(c, next);
    bookTl = gsap.timeline({ onComplete:() => { activeClosed = 1 - activeClosed; visibleDesk = next; finish(MODE.SELECTED); } });
    extractOut(bookTl, c, 0);
    bookTl.to(neutral, { opacity:0, visibility:'hidden', scale:0.97, duration:0.22 }, 0.12)
      .fromTo(next, { opacity:0, visibility:'hidden', scale:0.94, yPercent:3 }, { opacity:1, visibility:'visible', scale:1, yPercent:0, duration:0.42, ease:'power3.out' }, 0.2);
  };

  const switchTo = (nextCountry: HomeCountryConfig): void => {
    if (!selected) return; const previous = country(selected); setMode(MODE.SWITCHING); interactive();
    const next = closed[1 - activeClosed]; configureClosed(nextCountry, next);
    bookTl = gsap.timeline({ onComplete:() => { clearShelf(previous.slug); selected = nextCountry.slug; activeClosed = 1 - activeClosed; visibleDesk = next; finish(MODE.SELECTED); } });
    extractBack(bookTl, previous, 0);
    bookTl.to([visibleDesk, opening1, opening2, open], { opacity:0, visibility:'hidden', duration:0.22, ease:'power2.in' }, 0)
      .fromTo(next, { opacity:0, visibility:'hidden', scale:0.96 }, { opacity:1, visibility:'visible', scale:1, duration:0.34 }, 0.42)
      .call(() => configureExtracted(nextCountry), [], 0.54).set(extracted, { clearProps:'transform' }, 0.54);
    extractOut(bookTl, nextCountry, 0.56);
  };

  const selectCountry = (slug: HomeCountrySlug): void => {
    if (bookTl || mode === MODE.NAVIGATING || selected === slug) return;
    globeCue(); const c = country(slug); if (!selected) selectFirst(c); else switchTo(c);
  };

  const openCountry = (): void => {
    if (!selected || mode !== MODE.SELECTED || bookTl) return; const c = country(selected); configureOpening(c); setMode(MODE.OPENING); interactive();
    const currentClosed = closed[activeClosed];
    bookTl = gsap.timeline({ onComplete:() => { visibleDesk = c.assets.open ? open : opening2; finish(MODE.OPEN); } })
      .to(extracted, { opacity:0, visibility:'hidden', duration:0.18, ease:'power2.in' }, 0)
      .to(currentClosed, { opacity:0, visibility:'hidden', duration:0.14 }, 0)
      .fromTo(opening1, { opacity:0, visibility:'hidden', scale:0.95 }, { opacity:1, visibility:'visible', scale:1, duration:0.22 }, 0.08)
      .to(opening1, { opacity:0, visibility:'hidden', duration:0.14 }, 0.28)
      .fromTo(opening2, { opacity:0, visibility:'hidden', scale:0.95 }, { opacity:1, visibility:'visible', scale:1, duration:0.26 }, 0.25);
    if (c.assets.open) bookTl.to(opening2, { opacity:0, visibility:'hidden', duration:0.14 }, 0.5)
      .fromTo(open, { opacity:0, visibility:'hidden', scale:0.84, yPercent:0 }, { opacity:1, visibility:'visible', scale:1, yPercent:0, duration:0.56, ease:'power3.out' }, 0.44);
  };

  const navigate = (): void => {
    if (!selected || mode !== MODE.OPEN || bookTl) return; const c = country(selected); if (!c.destination || !c.assets.open) return;
    setMode(MODE.NAVIGATING); interactive();
    bookTl = gsap.timeline({ onComplete:() => window.location.assign(c.destination as string) }).to(open, { scale:1.02, duration:0.14 }, 0);
  };

  const returnIdle = (): void => {
    stop(bookTl); bookTl = null; gsap.killTweensOf([extracted, ...allDesk]);
    if (!selected) { resetDesk(); setMode(MODE.IDLE); interactive(); return; }
    const c = country(selected); const slug = selected; setMode(MODE.RETURNING); interactive();
    bookTl = gsap.timeline({ onComplete:() => { clearShelf(slug); gsap.set(extracted, { clearProps:'opacity,visibility,transform' }); resetDesk(); selected = null; finish(MODE.IDLE); } });
    extractBack(bookTl, c, 0);
    bookTl.to([closed[0], closed[1], opening1, opening2, open], { opacity:0, visibility:'hidden', duration:0.22 }, 0)
      .fromTo(neutral, { opacity:0, visibility:'hidden', scale:0.97 }, { opacity:1, visibility:'visible', scale:1, duration:0.3 }, 0.24);
  };

  const toggleLamp = (): void => {
    if (lampTl) return; const turningOn = !lampOn; if (!turningOn && selected) returnIdle(); lamp.disabled = true;
    lampTl = gsap.timeline({ onComplete:() => { lampOn = turningOn; lampTl = null; interactive(); } })
      .to(lamp, { yPercent:5.5, duration:0.13, ease:'power2.in' }, 0)
      .to(bgOn, { opacity:turningOn ? 1 : 0, duration:0.32, ease:'sine.inOut' }, 0.05)
      .to(bgOff, { opacity:turningOn ? 0 : 1, duration:0.32, ease:'sine.inOut' }, 0.05)
      .to(lamp, { yPercent:0, duration:0.22, ease:'sine.out' }, 0.15);
  };

  triggers.forEach((button, slug) => button.addEventListener('click', () => selectCountry(slug)));
  extracted.addEventListener('click', openCountry);
  desk.addEventListener('click', () => mode === MODE.SELECTED ? openCountry() : mode === MODE.OPEN ? navigate() : undefined);
  lamp.addEventListener('click', toggleLamp);
  const fitNow = (): void => fit(); window.addEventListener('resize', fitNow, { passive:true }); window.visualViewport?.addEventListener('resize', fitNow, { passive:true }); fit();

  void preload().then(() => requestAnimationFrame(() => {
    resetGlobe(); resetDesk(); root.dataset.ready = 'true'; root.setAttribute('aria-busy', 'false'); setMode(MODE.IDLE); interactive();
  }));
};