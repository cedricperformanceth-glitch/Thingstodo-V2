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

interface Gsap {
  timeline(config?: Vars): Timeline;
  set(target: Target, vars: Vars): void;
  killTweensOf(target: Target): void;
}

declare global {
  interface Window { gsap?: Gsap; }
}

const STAGE_WIDTH = 1448;
const TABLEAU_WIDTH_RATIO = 0.9;
const FRAME_OVERHANG = 32;

const MODE = {
  IDLE: 'idle',
  SELECTING: 'selecting',
  SELECTED: 'selected',
  OPENING: 'opening',
  OPEN: 'open',
  SWITCHING: 'switching',
  RETURNING: 'returning',
  NAVIGATING: 'navigating',
} as const;

type Mode = (typeof MODE)[keyof typeof MODE];

const countries = new Map<HomeCountrySlug, HomeCountryConfig>(
  HOME_COUNTRIES.map((country) => [country.slug, country]),
);

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
    const image = new Image();
    image.onload = image.onerror = () => resolve();
    image.src = src;
  })));
};

export const initAtlasHomepage = (): void => {
  const root = document.querySelector<HTMLElement>('[data-atlas-home]');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const gsap = window.gsap;
  if (!gsap) {
    root.dataset.ready = 'true';
    root.setAttribute('aria-busy', 'false');
    return;
  }

  root.dataset.lamp = 'off';

  const tableau = $<HTMLElement>(root, '[data-atlas-tableau]');
  const bgOn = $<HTMLImageElement>(root, '[data-background-on]');
  const bgOff = $<HTMLImageElement>(root, '[data-background-off]');
  const lamp = $<HTMLButtonElement>(root, '[data-lamp-pull]');
  const extracted = $<HTMLButtonElement>(root, '[data-country-extracted]');
  const extractedImage = $<HTMLImageElement>(root, '[data-country-extracted-image]');
  const desk = $<HTMLButtonElement>(root, '[data-desk-book]');
  const neutral = $<HTMLImageElement>(root, '[data-desk-neutral]');
  const closed = [
    $<HTMLImageElement>(root, '[data-desk-closed-a]'),
    $<HTMLImageElement>(root, '[data-desk-closed-b]'),
  ] as const;
  const opening1 = $<HTMLImageElement>(root, '[data-desk-opening-1]');
  const opening2 = $<HTMLImageElement>(root, '[data-desk-opening-2]');
  const open = $<HTMLImageElement>(root, '[data-desk-open]');

  const triggers = new Map<HomeCountrySlug, HTMLButtonElement>();
  root.querySelectorAll<HTMLButtonElement>('[data-country-trigger]').forEach((button) => {
    const slug = button.dataset.countryTrigger as HomeCountrySlug | undefined;
    if (slug && countries.has(slug)) triggers.set(slug, button);
  });

  let mode: Mode = MODE.IDLE;
  let selected: HomeCountrySlug | null = null;
  let lampOn = false;
  let bookTl: Timeline | null = null;
  let lampTl: Timeline | null = null;
  let activeClosed = 0;
  let visibleDesk: HTMLImageElement = neutral;

  const deskCountryLayers = [closed[0], closed[1], opening1, opening2, open];

  const country = (slug: HomeCountrySlug): HomeCountryConfig => {
    const value = countries.get(slug);
    if (!value) throw new Error(`Unknown country: ${slug}`);
    return value;
  };

  const trigger = (slug: HomeCountrySlug): HTMLButtonElement => {
    const value = triggers.get(slug);
    if (!value) throw new Error(`Missing trigger: ${slug}`);
    return value;
  };

  const setMode = (value: Mode): void => {
    mode = value;
    root.dataset.mode = value;
  };

  const fit = (): void => {
    const scale = (window.innerWidth * TABLEAU_WIDTH_RATIO) / (STAGE_WIDTH + FRAME_OVERHANG * 2);
    tableau.style.setProperty('--atlas-scale', String(scale));
  };

  const isReady = (): boolean => root.dataset.ready === 'true';
  const isBusy = (): boolean => !!bookTl || !!lampTl;

  const interactive = (): void => {
    const locked = !isReady() || isBusy();
    const current = selected ? country(selected) : null;

    lamp.disabled = locked;
    triggers.forEach((button, slug) => {
      button.disabled = locked || selected === slug;
    });
    extracted.disabled = locked || mode !== MODE.SELECTED;
    desk.disabled = locked || (
      mode !== MODE.SELECTED
      && !(mode === MODE.OPEN && !!current?.destination && !!current.assets.open)
    );
  };

  const finishBook = (nextMode: Mode): void => {
    bookTl = null;
    setMode(nextMode);
    interactive();
  };

  const hideCountryDeskLayers = (except?: HTMLImageElement): void => {
    const targets = except ? deskCountryLayers.filter((layer) => layer !== except) : deskCountryLayers;
    gsap.set(targets, { opacity: 0, visibility: 'hidden', clearProps: 'transform' });
  };

  const resetDesk = (): void => {
    gsap.killTweensOf([extracted, neutral, ...deskCountryLayers]);
    hideCountryDeskLayers();
    gsap.set(neutral, { opacity: 1, visibility: 'visible', clearProps: 'transform' });
    gsap.set(extracted, { opacity: 0, visibility: 'hidden', clearProps: 'transform' });
    activeClosed = 0;
    visibleDesk = neutral;
  };

  const showCountryDeskLayer = (layer: HTMLImageElement): void => {
    hideCountryDeskLayers(layer);
    gsap.set(neutral, { opacity: 0, visibility: 'hidden', clearProps: 'transform' });
    gsap.set(layer, { opacity: 1, visibility: 'visible', clearProps: 'transform' });
    visibleDesk = layer;
  };

  const clearShelf = (slug: HomeCountrySlug): void => {
    const button = trigger(slug);
    button.classList.remove('is-selected');
    gsap.set($<HTMLImageElement>(button, 'img'), { clearProps: 'opacity,transform' });
  };

  const configureExtracted = (c: HomeCountryConfig): void => {
    extractedImage.src = c.assets.shelfExtracted;
    extracted.style.setProperty('--extract-left', `${c.extractedLeft}%`);
    extracted.style.setProperty('--extract-top', `${c.extractedTop}%`);
    extracted.setAttribute('aria-label', `Open ${c.name} notebook`);
  };

  const configureClosed = (c: HomeCountryConfig, layer: HTMLImageElement): void => {
    layer.src = c.assets.closed;
    desk.setAttribute('aria-label', `${c.name} notebook on desk`);
  };

  const configureOpening = (c: HomeCountryConfig): void => {
    opening1.src = c.assets.openingFrames[0];
    opening2.src = c.assets.openingFrames[1];
    if (c.assets.open) open.src = c.assets.open;
    else open.removeAttribute('src');
  };

  const extractOut = (tl: Timeline, c: HomeCountryConfig, at: number): void => {
    const button = trigger(c.slug);
    const spine = $<HTMLImageElement>(button, 'img');
    button.classList.add('is-selected');

    tl.to(spine, { yPercent: 12, duration: 0.18, ease: 'power2.out' }, at)
      .to(spine, { opacity: 0, duration: 0.16 }, at + 0.14)
      .set(extracted, { opacity: 1, visibility: 'visible' }, at + 0.12)
      .to(extracted, {
        scale: c.motion.selectedScale,
        rotation: c.motion.selectedRotation,
        xPercent: c.motion.selectedXPercent,
        yPercent: c.motion.selectedYPercent,
        duration: 0.7,
        ease: 'power3.out',
      }, at + 0.12);
  };

  const extractBack = (tl: Timeline, c: HomeCountryConfig, at: number): void => {
    const spine = $<HTMLImageElement>(trigger(c.slug), 'img');

    tl.set(extracted, { opacity: 1, visibility: 'visible' }, at)
      .to(extracted, {
        scale: 0.22,
        rotation: 5,
        xPercent: 0,
        yPercent: 0,
        duration: 0.48,
        ease: 'power3.inOut',
      }, at)
      .to(extracted, { opacity: 0, visibility: 'hidden', duration: 0.12 }, at + 0.36)
      .fromTo(
        spine,
        { opacity: 0, yPercent: 8 },
        { opacity: 1, yPercent: 0, duration: 0.26, ease: 'power2.out' },
        at + 0.3,
      );
  };

  const selectFirst = (c: HomeCountryConfig): void => {
    selected = c.slug;
    configureExtracted(c);

    const nextIndex = 1 - activeClosed;
    const next = closed[nextIndex];
    configureClosed(c, next);

    setMode(MODE.SELECTING);
    bookTl = gsap.timeline({
      onComplete: () => {
        activeClosed = nextIndex;
        showCountryDeskLayer(next);
        finishBook(MODE.SELECTED);
      },
    });
    interactive();

    extractOut(bookTl, c, 0);
    bookTl
      .to(neutral, { opacity: 0, visibility: 'hidden', duration: 0.22 }, 0.12)
      .fromTo(
        next,
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.42, ease: 'power3.out' },
        0.2,
      );
  };

  const switchTo = (nextCountry: HomeCountryConfig): void => {
    if (!selected) return;
    const previous = country(selected);
    const nextIndex = 1 - activeClosed;
    const next = closed[nextIndex];
    configureClosed(nextCountry, next);

    setMode(MODE.SWITCHING);
    bookTl = gsap.timeline({
      onComplete: () => {
        clearShelf(previous.slug);
        selected = nextCountry.slug;
        activeClosed = nextIndex;
        showCountryDeskLayer(next);
        finishBook(MODE.SELECTED);
      },
    });
    interactive();

    extractBack(bookTl, previous, 0);
    bookTl
      .to([visibleDesk, opening1, opening2, open], {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.22,
        ease: 'power2.in',
      }, 0)
      .fromTo(
        next,
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.34, ease: 'power2.out' },
        0.42,
      )
      .call(() => configureExtracted(nextCountry), [], 0.54)
      .set(extracted, { clearProps: 'transform' }, 0.54);
    extractOut(bookTl, nextCountry, 0.56);
  };

  const selectCountry = (slug: HomeCountrySlug): void => {
    if (!isReady() || isBusy() || selected === slug) return;
    const c = country(slug);
    if (selected) switchTo(c);
    else selectFirst(c);
  };

  const openCountry = (): void => {
    if (!isReady() || isBusy() || !selected || mode !== MODE.SELECTED) return;

    const c = country(selected);
    configureOpening(c);
    const currentClosed = closed[activeClosed];
    const finalLayer = c.assets.open ? open : opening2;

    setMode(MODE.OPENING);
    bookTl = gsap.timeline({
      onComplete: () => {
        showCountryDeskLayer(finalLayer);
        gsap.set(extracted, { opacity: 0, visibility: 'hidden' });
        finishBook(MODE.OPEN);
      },
    });
    interactive();

    bookTl
      .to(extracted, { opacity: 0, visibility: 'hidden', duration: 0.18, ease: 'power2.in' }, 0)
      .to(currentClosed, { opacity: 0, visibility: 'hidden', duration: 0.14 }, 0)
      .fromTo(
        opening1,
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.22 },
        0.08,
      )
      .to(opening1, { opacity: 0, visibility: 'hidden', duration: 0.14 }, 0.28)
      .fromTo(
        opening2,
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.26 },
        0.25,
      );

    if (c.assets.open) {
      bookTl
        .to(opening2, { opacity: 0, visibility: 'hidden', duration: 0.14 }, 0.5)
        .fromTo(
          open,
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', duration: 0.56, ease: 'power3.out' },
          0.44,
        );
    }
  };

  const navigate = (): void => {
    if (!isReady() || isBusy() || !selected || mode !== MODE.OPEN) return;
    const c = country(selected);
    if (!c.destination || !c.assets.open) return;

    setMode(MODE.NAVIGATING);
    bookTl = gsap.timeline({
      onComplete: () => window.location.assign(c.destination as string),
    });
    interactive();
    bookTl.to(open, { scale: 1.02, duration: 0.14 }, 0);
  };

  const returnIdle = (): void => {
    if (bookTl) return;

    if (!selected) {
      resetDesk();
      setMode(MODE.IDLE);
      interactive();
      return;
    }

    const c = country(selected);
    const slug = selected;

    setMode(MODE.RETURNING);
    bookTl = gsap.timeline({
      onComplete: () => {
        clearShelf(slug);
        resetDesk();
        selected = null;
        finishBook(MODE.IDLE);
      },
    });
    interactive();

    extractBack(bookTl, c, 0);
    bookTl
      .to(deskCountryLayers, { opacity: 0, visibility: 'hidden', duration: 0.22 }, 0)
      .fromTo(
        neutral,
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.3 },
        0.24,
      );
  };

  const toggleLamp = (): void => {
    if (!isReady() || isBusy()) return;

    const turningOn = !lampOn;
    if (!turningOn && selected) returnIdle();
    if (turningOn) root.dataset.lamp = 'on';

    lampTl = gsap.timeline({
      onComplete: () => {
        lampOn = turningOn;
        if (!turningOn) root.dataset.lamp = 'off';
        lampTl = null;
        interactive();
      },
    });
    interactive();

    lampTl
      .to(lamp, { yPercent: 5.5, duration: 0.13, ease: 'power2.in' }, 0)
      .to(bgOn, { opacity: turningOn ? 1 : 0, duration: 0.32, ease: 'sine.inOut' }, 0.05)
      .to(bgOff, { opacity: turningOn ? 0 : 1, duration: 0.32, ease: 'sine.inOut' }, 0.05)
      .to(lamp, { yPercent: 0, duration: 0.22, ease: 'sine.out' }, 0.15);
  };

  triggers.forEach((button, slug) => {
    button.addEventListener('click', () => selectCountry(slug));
  });
  extracted.addEventListener('click', openCountry);
  desk.addEventListener('click', () => {
    if (mode === MODE.SELECTED) openCountry();
    else if (mode === MODE.OPEN) navigate();
  });
  lamp.addEventListener('click', toggleLamp);

  const fitNow = (): void => fit();
  window.addEventListener('resize', fitNow, { passive: true });
  window.visualViewport?.addEventListener('resize', fitNow, { passive: true });
  fit();

  void preload().then(() => requestAnimationFrame(() => {
    gsap.set(bgOn, { opacity: 0 });
    gsap.set(bgOff, { opacity: 1 });
    resetDesk();
    root.dataset.ready = 'true';
    root.setAttribute('aria-busy', 'false');
    setMode(MODE.IDLE);
    interactive();
  }));
};
