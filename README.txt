# K-Potassium Tracker — Python-free version

## Run the app
1. Download and extract `k_potassium_tracker_no_python.zip`.
2. Open the extracted folder.
3. Double-click `index.html`.
4. Choose Chrome, Edge, Firefox or another modern browser if asked.

No Python, Flask, database server, internet connection or installation is required.

## Files
- `index.html`: app screens
- `style.css`: responsive mobile-friendly design
- `app.js`: food list, calculations, diary, reports and backup/restore

## How calculation works
Each listed food has an estimated potassium value for one standard serving.
Estimated potassium = quantity selected × estimated potassium per serving.

Example: 2 medium bananas × 422 mg = 844 mg (estimate).

## Saving data
Entries are stored in the browser's localStorage on the current device and browser. They remain after closing and reopening the browser, but clearing browser site data may remove them. They do not automatically sync to another device. Use Reports > Export diary regularly to save a backup. Use Import diary to restore it.

For local-file use, browser storage is normally tied to the browser's local file origin. If a browser behaves inconsistently with file:// storage, open the folder with a simple static web server or host the three files on a static hosting service; no Python backend is needed.

## Food data note
Food and recipe values in this starter database are approximate educational estimates, not authoritative clinical measurements. The value for prepared recipes varies by ingredients, recipe and portion size. For a more accurate clinical or research app, replace estimates with verified values from a named food composition database and document serving weights and recipes. Do not use this tool to set a medical potassium target or change a prescribed diet.


## Install on Android as an app (PWA)
This project now includes a web app manifest, app icons and a service worker for offline use.
Important: Android Chrome requires the app to be served from HTTPS (or localhost). Opening index.html directly from a ZIP/file manager is not enough to install it as a PWA.

1. Publish the contents of this folder to a static HTTPS host, such as GitHub Pages or Netlify.
2. Open the published HTTPS address in Google Chrome on Android.
3. Tap Chrome's three-dot menu.
4. Choose "Install app" or "Add to Home screen" (the wording varies by Chrome version).
5. Confirm. The K-Potassium Tracker icon will appear on the home screen/app list.
6. Open it once while online so the service worker can cache the app. It can then load offline.

The app data is stored in browser local storage on that Android device/browser. Do not clear Chrome site data if you want to retain the diary. Use Reports > Export diary for backups.

### GitHub Pages quick publishing
1. Sign in to GitHub and create a new repository.
2. Upload all files and folders from this project (index.html, app.js, style.css, manifest.webmanifest, service-worker.js, icons/).
3. In repository Settings > Pages, choose deploy from the main branch and root folder.
4. Wait for GitHub Pages to publish, then open the HTTPS Pages address on Android Chrome.

BP & BLOOD SUGAR TRACKER
Manual BP: systolic/diastolic in mmHg, optional pulse in bpm, date/time.
Manual glucose: value, mg/dL or mmol/L, fasting/pre-meal/post-meal/random/bedtime context, date/time.
Readings can be deleted individually. Export/import includes food and health records.
This is a record-keeping feature only and does not interpret results or provide medical advice.

FLUID BALANCE TRACKER
Manually record fluid intake (water, milk, tea, coffee, juice, coconut water and other drinks) in ml.
Manually record measured output (urine or other measured fluid output) in ml.
Daily net balance = recorded intake minus recorded output.
Fluid records are included in export/import backups. This is a simple log, not a clinical fluid-balance assessment; it excludes unmeasured losses and fluid in foods.

DATA MANAGEMENT (Version 5)
- Add custom foods with serving description, unit and estimated potassium per serving.
- Edit or delete custom foods. Deleting a custom food does not erase historical diary entries.
- View counts of stored food, BP, sugar, fluid and custom-food records, plus approximate localStorage size.
- Export a complete JSON backup and restore from a previously exported backup.
- Delete individual records from their history lists, clear selected record groups, or reset all app data.
- Data is held in this browser's localStorage. It is not cloud storage or a secure medical record system. Export backups regularly.


VERSION 6 — SUPABASE CLOUD BACKUP
- Sign in or create an account from Data Management > Account & cloud synchronisation.
- Email confirmation may be required depending on Supabase Auth settings.
- Upload saves the complete current browser backup to the signed-in user's cloud row.
- Download replaces the current browser records with that user's cloud backup. Export locally before downloading.
- Sync is manual; changes are not automatically synchronised. Upload again after making changes.
- Supabase URL and publishable key are included in app.js. A publishable key is intended for browser use; never put a secret/service-role key in this file.
- The tracker_backups table must have RLS enabled and policies restricting each row to auth.uid() = user_id.
- Cloud backup includes all records, including BP, blood sugar and fluid records. Use only with appropriate adult/guardian guidance and do not treat this as a secure medical-record service.
