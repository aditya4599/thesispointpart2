# ThesisPoint Research — website

Plain HTML, CSS and JavaScript. No install, no build step.

## Open it in Chrome

Unzip the folder and double-click `index.html`. That's it.
You need to be online for the fonts (Familjen Grotesk and Source Serif 4) to load; everything else works offline.

## Pages

- `index.html` — homepage: gap ruler with the latest three Recos, Longer reads, Subscribe, the team
- `research.html` — research library: search, filters, sort, the upside board with preview, full archive
- `about.html` — approach, how a report gets written, the team

## Changing the research

Until TPR Back-End is live, the research shown comes from `assets/data.js`.
Add, edit or remove entries there. A stock report needs `rating`, `price_at_publication`,
`target_price` and `reco_status` (`open`, `target_met` or `closed`).

## Connecting TPR Back-End

In `assets/data.js`, set:

```js
window.TPR_CONFIG = { apiBase: 'https://admin.thesispointresearch.com' };
```

The site will then load published research from the back-end and save Subscribe signups there.
Also uncomment the tracking `<script>` line in the `<head>` of each page to start counting traffic,
and add this site's address to `SITE_ORIGINS` in the back-end.

## Files

```
index.html, research.html, about.html
assets/styles.css    all styling (colours are at the top)
assets/data.js       research content and the back-end setting
assets/site.js       shared helpers and Subscribe forms
assets/home.js       homepage gap ruler and Longer reads
assets/research.js   research library logic
assets/logo.png      logo with transparent background
```
