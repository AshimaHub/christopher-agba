# Christopher Agba

Local client-acquisition website for Christopher Agba, enterprise software engineer and business systems consultant.

The live site is https://christopher-agba.onrender.com. Render builds it as a static site from `render.yaml`.

## Preview

```powershell
cd "H:\New folder\New Rocad\christopher-agba"
npm install
npm run dev
```

Open http://localhost:5173/

## Edit the content

Change Christopher's projects, services, biography, and contact links in `src/content/site.ts`.

Change the Robes business pages in `src/content/robes.ts`.

## Robes logo

The approved logo files were not in the project. Add them, without renaming, to `public/brand/`:

- `robes-logo-green.png`
- `robes-logo-black.png`
- `robes-logo-white.png`
- `robes-mark.png` if you have a compact symbol

Until then, the site shows a text lockup. It does not draw a substitute logo. The green used in the interface can be adjusted in `src/index.css` (`--robes` and `--robes-fill`) so it matches the logo.

- Leave LinkedIn or GitHub as an empty string until you have a real profile URL.
- Set `published: false` on a case study to hide it.
- Set `siteUrl` when you choose a public domain, so canonical and social metadata are emitted.
- Set `resumeUrl` after you place a résumé file in `public/`.
- Replace `public/images/christopher-agba.png` if you want a different portrait.

## Checks

```powershell
npm run lint
npm run build
```

`npm run preview` serves the production build locally.
