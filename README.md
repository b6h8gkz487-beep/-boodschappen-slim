# 🥘 Kruimel

Een recepten-app in de geest van [Crouton](https://crouton.app): je recepten mooi op één plek, met kookmodus, boodschappenlijst en weekmenu. Gebouwd met vanilla HTML/CSS/JS — geen build-stap, geen dependencies.

## Starten

```bash
node server.js
# daarna openen: http://localhost:3000
```

Zonder server werkt de app ook: open `index.html` direct in de browser (alleen de website-import werkt dan niet, omdat browsers cross-origin-verzoeken blokkeren).

## Functies

- **Receptenbibliotheek** — kaarten met foto/emoji, tijd, porties en tags; zoeken op naam, ingrediënt of tag; sorteren.
- **Recept van website importeren** — plak een URL van een receptpagina; de server leest de schema.org `Recipe`-data (JSON-LD) uit, zoals Crouton doet.
- **Handmatig toevoegen/bewerken** — ingrediënten en stappen, tags, emoji of foto-URL.
- **Porties schalen** — hoeveelheden worden automatisch meegeschaald.
- **Kookmodus** — volledig scherm, één stap per keer, met automatische timerdetectie ("laat 30 minuten indikken" → startbare countdown + belsignaal).
- **Boodschappenlijst** — ingrediënten van recepten (met schaalfactor) of losse items; afvinken, groeperen per recept.
- **Weekmenu** — per dag recepten toewijzen en met één klik de hele week op de boodschappenlijst zetten.
- **Donkere modus** — wissel bovenin de zijbalk.

## Techniek

| Bestand | Doel |
|---|---|
| `index.html` | layout, zijbalk, modal- en toast-wortels |
| `styles.css` | thema via CSS-variabelen (licht/donker), responsive |
| `app.js` | hash-router, alle weergaven, localStorage als database |
| `server.js` | statische bestanden + `GET /api/import?url=…` (JSON-LD-parser) |

Data blijft lokaal in je browser (localStorage, sleutel `kruimel.v1`). Bij de eerste start worden vier voorbeeldrecepten geladen; verwijder ze gewoon als je ze niet wilt.

## Beveiligingsnotities

- De import-endpoint blokkeert lokale/netwerkadressen (SSRF-bescherming) en volgt alleen http(s).
- Alle gebruikersinvoer wordt ge-HTML-escape'd vóór renderen.
- De server luistert standaard alleen op `127.0.0.1`.
