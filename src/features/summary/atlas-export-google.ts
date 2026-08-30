import type { TripEntry } from '../trip/store';
import { atlasBaseName, fileRows } from './atlas-export-shared';

const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const GOOGLE_CLIENT_ID = String((import.meta as ImportMeta & { env: { PUBLIC_GOOGLE_CLIENT_ID?: string } }).env.PUBLIC_GOOGLE_CLIENT_ID ?? '').trim();

interface GoogleTokenResponse { access_token?: string; error?: string; error_description?: string; }
interface GoogleTokenClient { requestAccessToken(options?: { prompt?: string }): void; }
interface GoogleOauthApi {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
    error_callback?: (error: { type?: string; message?: string }) => void;
  }): GoogleTokenClient;
}
interface GoogleIdentityWindow extends Window { google?: { accounts?: { oauth2?: GoogleOauthApi } } }

const loadGoogleIdentity = () => new Promise<GoogleOauthApi>((resolve, reject) => {
  const googleWindow = window as GoogleIdentityWindow;
  const ready = googleWindow.google?.accounts?.oauth2;
  if (ready) { resolve(ready); return; }
  const existing = document.querySelector<HTMLScriptElement>('script[data-atlas-google-identity]');
  const onReady = () => {
    const oauth2 = googleWindow.google?.accounts?.oauth2;
    if (oauth2) resolve(oauth2);
    else reject(new Error('Google Identity Services did not initialize.'));
  };
  if (existing) {
    existing.addEventListener('load', onReady, { once: true });
    existing.addEventListener('error', () => reject(new Error('Unable to load Google sign-in.')), { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.dataset.atlasGoogleIdentity = 'true';
  script.addEventListener('load', onReady, { once: true });
  script.addEventListener('error', () => reject(new Error('Unable to load Google sign-in.')), { once: true });
  document.head.appendChild(script);
});

const requestGoogleToken = async () => {
  if (!GOOGLE_CLIENT_ID) throw new Error('Google Sheets export is not configured yet. Add PUBLIC_GOOGLE_CLIENT_ID for the production domain.');
  const oauth2 = await loadGoogleIdentity();
  return new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPE,
      callback: (response) => {
        if (response.access_token) resolve(response.access_token);
        else reject(new Error(response.error_description || response.error || 'Google authorization was not completed.'));
      },
      error_callback: (error) => reject(new Error(error.message || error.type || 'Google authorization was interrupted.')),
    });
    client.requestAccessToken();
  });
};

const googleApiError = async (response: Response) => {
  try {
    const payload = await response.json() as { error?: { message?: string } };
    return payload.error?.message || `Google API request failed (${response.status}).`;
  } catch {
    return `Google API request failed (${response.status}).`;
  }
};

export const createGoogleSheet = async (entries: TripEntry[]) => {
  const token = await requestGoogleToken();
  const title = `${atlasBaseName(entries).replace(/-/g, ' ')} - Things To Do Atlas`;
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets?fields=spreadsheetId,spreadsheetUrl', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: { title },
      sheets: [{ properties: { sheetId: 0, title: 'My Atlas', gridProperties: { frozenRowCount: 1 } } }],
    }),
  });
  if (!createResponse.ok) throw new Error(await googleApiError(createResponse));
  const created = await createResponse.json() as { spreadsheetId: string; spreadsheetUrl?: string };

  const values = fileRows(entries).map((row, rowIndex) => row.map((value, columnIndex) => {
    if (rowIndex === 0) return value;
    if (columnIndex === 4) return `=HYPERLINK("${value.replace(/"/g, '""')}","Google Maps")`;
    if (columnIndex === 5) return `=HYPERLINK("${value.replace(/"/g, '""')}","Atlas Page")`;
    return value;
  }));
  const range = encodeURIComponent(`'My Atlas'!A1:G${values.length}`);
  const valuesResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${created.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values }),
  });
  if (!valuesResponse.ok) throw new Error(await googleApiError(valuesResponse));

  const requests = [
    {
      repeatCell: {
        range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 7 },
        cell: { userEnteredFormat: { backgroundColor: { red: 0.192, green: 0.333, blue: 0.271 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true }, verticalAlignment: 'MIDDLE' } },
        fields: 'userEnteredFormat(backgroundColor,textFormat,verticalAlignment)',
      },
    },
    ...[
      [0, 1, 125], [1, 2, 145], [2, 3, 155], [3, 4, 260], [4, 6, 125], [6, 7, 220],
    ].map(([startIndex, endIndex, pixelSize]) => ({
      updateDimensionProperties: {
        range: { sheetId: 0, dimension: 'COLUMNS', startIndex, endIndex },
        properties: { pixelSize }, fields: 'pixelSize',
      },
    })),
  ];
  const formatResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${created.spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests }),
  });
  if (!formatResponse.ok) throw new Error(await googleApiError(formatResponse));
  return created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${created.spreadsheetId}/edit`;
};
