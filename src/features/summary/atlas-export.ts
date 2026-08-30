import { MY_ATLAS_EVENT, MY_ATLAS_STORAGE_KEY, readTripStore } from '../trip/store';
import { createGoogleSheet } from './atlas-export-google';
import { buildPdf } from './atlas-export-pdf';
import { buildPrintablePdf } from './atlas-export-print-pdf';
import { atlasBaseName, PDF_MIME, XLSX_MIME, type ExportKind, type GeneratedExport } from './atlas-export-shared';
import { buildXlsx } from './atlas-export-xlsx';

const exportDialogMarkup = `
  <button class="atlas-export__close" type="button" aria-label="Close export options" data-atlas-export-close>×</button>
  <section class="atlas-export__view" data-atlas-export-view="selection">
    <header class="atlas-export__heading">
      <div class="atlas-export__heading-line">
        <p class="atlas-export__eyebrow">TAKE IT WITH YOU</p>
        <p class="atlas-export__registry" aria-hidden="true">ATLAS / EXPORT 01</p>
      </div>
      <h2 class="atlas-export__title" id="atlas-export-title">Choose how to carry your Atlas.</h2>
      <p class="atlas-export__copy" id="atlas-export-description" data-atlas-export-count>Save a place to prepare your Atlas.</p>
    </header>

    <div class="atlas-export__cards" aria-label="Atlas export formats">
      <article class="atlas-export__card atlas-export__card--google">
        <span class="atlas-export__marker" aria-hidden="true"></span>
        <div class="atlas-export__card-copy">
          <div class="atlas-export__format-line">
            <h3 class="atlas-export__format">Google Sheets</h3>
            <span class="atlas-export__badge">recommended ↙</span>
          </div>
          <p class="atlas-export__format-meta">Editable copy · Google Drive</p>
          <p class="atlas-export__description">Create an editable copy of your saved Atlas directly in your Google Drive.</p>
          <p class="atlas-export__permission"><strong>Google sign-in required.</strong> Google will ask you to choose an account and allow Atlas to create this Sheet.</p>
        </div>
        <button class="atlas-export__card-action" type="button" data-atlas-export-kind="google"><span>Create</span><span aria-hidden="true">↗</span></button>
      </article>

      <article class="atlas-export__card">
        <span class="atlas-export__marker" aria-hidden="true"></span>
        <div class="atlas-export__card-copy">
          <h3 class="atlas-export__format">Travel PDF</h3>
          <p class="atlas-export__format-meta">Pocket Atlas · Offline</p>
          <p class="atlas-export__description">A polished travel document organised by country, city and category, with clickable Google Maps links.</p>
        </div>
        <button class="atlas-export__card-action" type="button" data-atlas-export-kind="pdf"><span>Create PDF</span><span aria-hidden="true">↓</span></button>
      </article>

      <article class="atlas-export__card atlas-export__card--print">
        <span class="atlas-export__marker" aria-hidden="true"></span>
        <div class="atlas-export__card-copy">
          <div class="atlas-export__format-line">
            <h3 class="atlas-export__format">Printable PDF</h3>
            <span class="atlas-export__badge">ink-friendly</span>
          </div>
          <p class="atlas-export__format-meta">A4 · Black &amp; white · Compact</p>
          <p class="atlas-export__description">A dense field copy without cover, contents or maps. Cities follow the order in which you built your Atlas.</p>
        </div>
        <button class="atlas-export__card-action" type="button" data-atlas-export-kind="print-pdf"><span>Create print PDF</span><span aria-hidden="true">↓</span></button>
      </article>

      <article class="atlas-export__card">
        <span class="atlas-export__marker" aria-hidden="true"></span>
        <div class="atlas-export__card-copy">
          <h3 class="atlas-export__format">Excel (.xlsx)</h3>
          <p class="atlas-export__format-meta">Editable travel planner</p>
          <p class="atlas-export__description">A structured spreadsheet with your places, categories, Google Maps links and space for personal notes.</p>
        </div>
        <button class="atlas-export__card-action" type="button" data-atlas-export-kind="xlsx"><span>Create Excel</span><span aria-hidden="true">↓</span></button>
      </article>
    </div>

    <footer class="atlas-export__dispatch-footer" aria-hidden="true">
      <span>YOUR SAVED ATLAS</span>
      <span>FIELD COPY · READY TO CARRY</span>
    </footer>
    <p class="atlas-export__error" data-atlas-export-error hidden></p>
  </section>

  <section class="atlas-export__view atlas-export__view--progress" data-atlas-export-view="progress" hidden>
    <div class="atlas-export__process">
      <div class="atlas-export__heading-line">
        <p class="atlas-export__eyebrow">PREPARING YOUR ATLAS</p>
        <p class="atlas-export__registry" aria-hidden="true">ATLAS / WORK ORDER</p>
      </div>
      <h2 class="atlas-export__title" data-atlas-export-progress-title>Building your Atlas…</h2>
      <p class="atlas-export__copy" data-atlas-export-progress-copy>Organising your saved places.</p>
      <ol class="atlas-export__checklist" aria-hidden="true">
        <li class="is-done"><span>✓</span> Gathering saved places</li>
        <li class="is-done"><span>✓</span> Organising countries &amp; cities</li>
        <li class="is-active"><span>→</span> Preparing links &amp; field notes</li>
        <li><span>○</span> Finishing your travel file</li>
      </ol>
      <p class="atlas-export__process-note">Please keep this page open.</p>
    </div>
  </section>

  <section class="atlas-export__view atlas-export__view--file" data-atlas-export-view="file" hidden>
    <div class="atlas-export__ready-card">
      <div class="atlas-export__ready-topline">
        <p class="atlas-export__ready-label" data-atlas-export-file-kind>Your file</p>
        <span class="atlas-export__ready-stamp" aria-hidden="true">READY ✓</span>
      </div>
      <p class="atlas-export__registry" aria-hidden="true">FILE No. 001</p>
      <h2 class="atlas-export__ready-name" data-atlas-export-file-name>My-Atlas.pdf</h2>
      <p class="atlas-export__ready-copy">Your Atlas is ready to keep on your device or send through any compatible sharing app.</p>
      <div class="atlas-export__actions">
        <button class="atlas-export__button" type="button" data-atlas-export-share><span>Share</span><span aria-hidden="true">↗</span></button>
        <a class="atlas-export__button atlas-export__button--secondary" href="#" data-atlas-export-download><span>Keep file</span><span aria-hidden="true">↓</span></a>
      </div>
      <p class="atlas-export__share-help" data-atlas-export-share-help></p>
      <button class="atlas-export__text-button" type="button" data-atlas-export-back>Choose another format</button>
    </div>
  </section>

  <section class="atlas-export__view atlas-export__view--sheet" data-atlas-export-view="sheet" hidden>
    <div class="atlas-export__ready-card">
      <div class="atlas-export__ready-topline">
        <p class="atlas-export__ready-label">Google Sheets</p>
        <span class="atlas-export__ready-stamp" aria-hidden="true">READY ✓</span>
      </div>
      <p class="atlas-export__registry" aria-hidden="true">FILE No. 001</p>
      <h2 class="atlas-export__ready-name">Your Google Sheet is ready.</h2>
      <p class="atlas-export__ready-copy">It was created in the Google account you authorised and is ready to edit or share.</p>
      <div class="atlas-export__actions atlas-export__actions--single">
        <a class="atlas-export__button" href="#" target="_blank" rel="noopener noreferrer" data-atlas-export-sheet-link><span>Open Google Sheet</span><span aria-hidden="true">↗</span></a>
      </div>
      <button class="atlas-export__text-button" type="button" data-atlas-export-back>Choose another format</button>
    </div>
  </section>
`;

const makeExport = async (kind: ExportKind): Promise<GeneratedExport> => {
  const entries = readTripStore().entries;
  const base = atlasBaseName(entries);
  if (kind === 'pdf') return { kind, blob: await buildPdf(entries), fileName: `${base}.pdf`, mimeType: PDF_MIME };
  if (kind === 'print-pdf') {
    return { kind, blob: await buildPrintablePdf(entries), fileName: `${base}-Print.pdf`, mimeType: PDF_MIME };
  }
  return { kind, blob: buildXlsx(entries), fileName: `${base}.xlsx`, mimeType: XLSX_MIME };
};

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const initAtlasExport = () => {
  const root = document.querySelector<HTMLElement>('[data-trip-summary]');
  if (!root || root.dataset.atlasExportReady === 'true') return;
  root.dataset.atlasExportReady = 'true';
  const openButton = root.querySelector<HTMLButtonElement>('[data-summary-share-open]');
  const modal = root.querySelector<HTMLElement>('[data-summary-share-modal]');
  const dialog = root.querySelector<HTMLElement>('[data-summary-share-dialog]');
  if (!openButton || !modal || !dialog) return;

  modal.className = 'atlas-export';
  dialog.className = 'atlas-export__dialog';
  dialog.setAttribute('aria-labelledby', 'atlas-export-title');
  dialog.setAttribute('aria-describedby', 'atlas-export-description');
  dialog.innerHTML = exportDialogMarkup;

  const q = <T extends Element>(selector: string) => dialog.querySelector<T>(selector);
  const closeButton = q<HTMLButtonElement>('[data-atlas-export-close]');
  const count = q<HTMLElement>('[data-atlas-export-count]');
  const selectionView = q<HTMLElement>('[data-atlas-export-view="selection"]');
  const progressView = q<HTMLElement>('[data-atlas-export-view="progress"]');
  const fileView = q<HTMLElement>('[data-atlas-export-view="file"]');
  const sheetView = q<HTMLElement>('[data-atlas-export-view="sheet"]');
  const progressTitle = q<HTMLElement>('[data-atlas-export-progress-title]');
  const progressCopy = q<HTMLElement>('[data-atlas-export-progress-copy]');
  const fileNameLabel = q<HTMLElement>('[data-atlas-export-file-name]');
  const fileKindLabel = q<HTMLElement>('[data-atlas-export-file-kind]');
  const shareButton = q<HTMLButtonElement>('[data-atlas-export-share]');
  const downloadLink = q<HTMLAnchorElement>('[data-atlas-export-download]');
  const shareHelp = q<HTMLElement>('[data-atlas-export-share-help]');
  const sheetLink = q<HTMLAnchorElement>('[data-atlas-export-sheet-link]');
  const sheetError = q<HTMLElement>('[data-atlas-export-error]');
  const backButtons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-atlas-export-back]'));
  const formatButtons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-atlas-export-kind]'));
  if (!closeButton || !count || !selectionView || !progressView || !fileView || !sheetView || !progressTitle || !progressCopy || !fileNameLabel || !fileKindLabel || !shareButton || !downloadLink || !shareHelp || !sheetLink || !sheetError) return;

  const views = [selectionView, progressView, fileView, sheetView];
  let generatedFile: File | null = null;
  let objectUrl = '';
  let returnFocus: HTMLElement | null = null;

  const revokeObjectUrl = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = '';
    generatedFile = null;
  };
  const showView = (target: HTMLElement) => {
    views.forEach((view) => { view.hidden = view !== target; });
    sheetError.hidden = true;
  };
  const refresh = () => {
    const entries = readTripStore().entries;
    const hasEntries = entries.length > 0;
    openButton.disabled = !hasEntries;
    openButton.setAttribute('aria-label', hasEntries ? `Take my Atlas with me. Export ${entries.length} saved ${entries.length === 1 ? 'place' : 'places'}.` : 'Take my Atlas with me. Save a place first.');
    count.textContent = hasEntries ? `${entries.length} saved ${entries.length === 1 ? 'place' : 'places'}, ready to take with you.` : 'Save a place to prepare your Atlas.';
    return entries;
  };
  const closeModal = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('summary-export-is-open');
    revokeObjectUrl();
    showView(selectionView);
    returnFocus?.focus();
  };
  const openModal = () => {
    if (!refresh().length) return;
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : openButton;
    modal.hidden = false;
    document.body.classList.add('summary-export-is-open');
    showView(selectionView);
    requestAnimationFrame(() => dialog.focus());
  };

  const prepareFile = async (kind: ExportKind) => {
    if (!readTripStore().entries.length) return;
    revokeObjectUrl();
    if (kind === 'pdf') {
      progressTitle.textContent = 'Building your travel PDF…';
      progressCopy.textContent = 'Organising your saved places, links and field notes.';
    } else if (kind === 'print-pdf') {
      progressTitle.textContent = 'Building your printable Atlas…';
      progressCopy.textContent = 'Compressing your saved places into a black-and-white A4 field copy.';
    } else {
      progressTitle.textContent = 'Building your Excel file…';
      progressCopy.textContent = 'Organising your saved places, links and field notes.';
    }
    showView(progressView);
    await nextFrame();
    try {
      const exported = await makeExport(kind);
      generatedFile = new File([exported.blob], exported.fileName, { type: exported.mimeType });
      objectUrl = URL.createObjectURL(exported.blob);
      downloadLink.href = objectUrl;
      downloadLink.download = exported.fileName;
      fileNameLabel.textContent = exported.fileName;
      fileKindLabel.textContent = kind === 'pdf'
        ? 'Travel PDF'
        : kind === 'print-pdf'
          ? 'Printable PDF'
          : 'Excel spreadsheet';
      const shareData = { files: [generatedFile], title: 'My Atlas', text: 'My travel Atlas from Things To Do Atlas.' };
      const canShare = typeof navigator.share === 'function' && (typeof navigator.canShare !== 'function' || navigator.canShare(shareData));
      shareButton.disabled = !canShare;
      shareHelp.textContent = canShare ? 'Your device will show the apps that can accept this file.' : 'File sharing is not available in this browser. Download it and share it from your device.';
      showView(fileView);
      requestAnimationFrame(() => (canShare ? shareButton : downloadLink).focus());
    } catch (error) {
      progressTitle.textContent = 'We could not build this export.';
      progressCopy.textContent = error instanceof Error ? error.message : 'Please try again.';
    }
  };

  const prepareGoogleSheet = async () => {
    const entries = readTripStore().entries;
    if (!entries.length) return;
    progressTitle.textContent = 'Connecting to Google…';
    progressCopy.textContent = 'Choose your Google account and allow Atlas to create this one Sheet.';
    showView(progressView);
    await nextFrame();
    try {
      sheetLink.href = await createGoogleSheet(entries);
      showView(sheetView);
      requestAnimationFrame(() => sheetLink.focus());
    } catch (error) {
      showView(selectionView);
      sheetError.textContent = error instanceof Error ? error.message : 'Google Sheets export could not be completed.';
      sheetError.hidden = false;
      requestAnimationFrame(() => formatButtons[0]?.focus());
    }
  };

  openButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  backButtons.forEach((button) => button.addEventListener('click', () => { revokeObjectUrl(); showView(selectionView); requestAnimationFrame(() => formatButtons[0]?.focus()); }));
  formatButtons.forEach((button) => button.addEventListener('click', () => {
    const kind = button.dataset.atlasExportKind;
    if (kind === 'google') void prepareGoogleSheet();
    else if (kind === 'pdf' || kind === 'print-pdf' || kind === 'xlsx') void prepareFile(kind);
  }));
  shareButton.addEventListener('click', async () => {
    if (!generatedFile || typeof navigator.share !== 'function') return;
    try {
      await navigator.share({ title: 'My Atlas', text: 'My travel Atlas from Things To Do Atlas.', files: [generatedFile] });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      shareHelp.textContent = 'Sharing did not open. You can still download the file below.';
    }
  });
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]:not([aria-disabled="true"])')).filter((element) => !element.hidden && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener(MY_ATLAS_EVENT, refresh);
  window.addEventListener('storage', (event) => { if (event.key === MY_ATLAS_STORAGE_KEY || event.key === null) refresh(); });
  refresh();
};

initAtlasExport();
document.addEventListener('astro:page-load', initAtlasExport);
