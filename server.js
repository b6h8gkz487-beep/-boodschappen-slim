/* ============================================================
   Kruimel server — statische bestanden + recept-import.
   Geen dependencies: alleen Node.js ingebouwde modules.

   Start:  node server.js   (standaard op http://localhost:3000)
   ============================================================ */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
};

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
}

/* ---------- Recept-import (schema.org Recipe JSON-LD) ---------- */
function collectRecipeNodes(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n) => collectRecipeNodes(n, out)); return out; }
  const types = node['@type'];
  const typeList = Array.isArray(types) ? types : [types];
  if (typeList && typeList.some((t) => typeof t === 'string' && t.toLowerCase() === 'recipe')) out.push(node);
  Object.values(node).forEach((v) => { if (typeof v === 'object') collectRecipeNodes(v, out); });
  return out;
}

function textOf(v) {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (v && typeof v === 'object') {
    if (typeof v.name === 'string') return v.name;
    if (typeof v.text === 'string') return v.text;
    if (typeof v['@value'] === 'string') return v['@value'];
  }
  if (Array.isArray(v)) return v.map(textOf).filter(Boolean).join(' ');
  return '';
}

function stripTags(s) {
  return String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function recipeFromJsonLd(node) {
  const ingredients = [].concat(node.recipeIngredient || node.ingredients || [])
    .map(textOf).map(stripTags).filter(Boolean);

  let steps = [];
  const rawSteps = node.recipeInstructions;
  const walk = (s) => {
    if (typeof s === 'string') { const t = stripTags(s); if (t) steps.push(t); }
    else if (Array.isArray(s)) s.forEach(walk);
    else if (s && typeof s === 'object') {
      if (s.itemListElement) walk(s.itemListElement);
      else { const t = stripTags(textOf(s)); if (t) steps.push(t); }
    }
  };
  walk(rawSteps);

  let image = '';
  const img = node.image;
  if (typeof img === 'string') image = img;
  else if (Array.isArray(img) && img.length) image = typeof img[0] === 'string' ? img[0] : textOf(img[0] && img[0].url) || '';
  else if (img && typeof img === 'object') image = textOf(img.url) || '';

  let time = 0;
  const dur = textOf(node.totalTime);
  const h = /(\d+)\s*H/i.exec(dur);
  const mi = /(\d+)\s*M(?!\d)/i.exec(dur);
  if (h || mi) time = (parseInt((h || [])[1] || 0, 10) * 60) + parseInt((mi || [])[1] || 0, 10);

  const yieldTxt = textOf(node.recipeYield);
  const ym = /(\d+)/.exec(yieldTxt);

  return {
    title: stripTags(textOf(node.name)) || 'Geïmporteerd recept',
    emoji: '',
    image,
    servings: ym ? parseInt(ym[1], 10) : 2,
    time: time || 30,
    tags: (node.keywords ? textOf(node.keywords).split(',').map((t) => stripTags(t).toLowerCase()).filter(Boolean) : []).slice(0, 6),
    ingredients: ingredients.map((line) => {
      const mm = /^([^a-zA-Z]{0,12}\d+(?:[.,]\d+)?\s*(?:kg|g|gr|ml|l|el|tl|stuk|stuks|tenen|teen|blik|blikken|pak|zak|handvol|snuf(?:je)?|naar smaak)?\s+)(.+)$/i.exec(line);
      return mm ? { amount: mm[1].trim(), name: mm[2].trim() } : { amount: '', name: line };
    }),
    steps,
  };
}

async function handleImport(req, res, url) {
  const target = url.searchParams.get('url');
  if (!target || !/^https?:\/\//i.test(target)) {
    return send(res, 400, JSON.stringify({ error: 'Geef een geldige http(s)-URL op.' }));
  }
  let host;
  try { host = new URL(target).hostname; } catch { return send(res, 400, JSON.stringify({ error: 'Ongeldige URL.' })); }
  if (/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[::1\])/i.test(host)) {
    return send(res, 400, JSON.stringify({ error: 'Lokale adressen kunnen niet geïmporteerd worden.' }));
  }

  try {
    const resp = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Kruimel/1.0)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return send(res, 502, JSON.stringify({ error: `Site gaf status ${resp.status}.` }));
    const html = await resp.text();

    const nodes = [];
    const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = re.exec(html)) !== null) {
      const raw = match[1].replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, '').trim();
      try { collectRecipeNodes(JSON.parse(raw), nodes); } catch { /* geen geldige JSON in dit blok */ }
    }
    if (!nodes.length) {
      return send(res, 422, JSON.stringify({ error: 'Geen recept gevonden op deze pagina (geen schema.org Recipe-data).' }));
    }

    const recipe = recipeFromJsonLd(nodes[0]);
    if (!recipe.ingredients.length && !recipe.steps.length) {
      return send(res, 422, JSON.stringify({ error: 'Recept gevonden, maar zonder ingrediënten of stappen.' }));
    }
    send(res, 200, JSON.stringify({ recipe }));
  } catch (err) {
    send(res, 502, JSON.stringify({ error: 'Kon de pagina niet ophalen: ' + err.message }));
  }
}

/* ---------- Server ---------- */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/import') {
    if (req.method !== 'GET' && req.method !== 'POST') return send(res, 405, JSON.stringify({ error: 'Methode niet toegestaan.' }));
    return handleImport(req, res, url);
  }

  let file = url.pathname === '/' ? '/index.html' : url.pathname;
  file = path.normalize(file).replace(/^(\.\.[/\\])+/, '');
  const full = path.join(ROOT, file);
  if (!full.startsWith(ROOT)) return send(res, 403, 'Verboden', 'text/plain');

  fs.readFile(full, (err, data) => {
    if (err) return send(res, 404, 'Niet gevonden', 'text/plain');
    send(res, 200, data, MIME[path.extname(full)] || 'application/octet-stream');
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🥘 Kruimel draait op http://localhost:${PORT}`);
});

if (require.main !== module) {
  module.exports = { recipeFromJsonLd, collectRecipeNodes, stripTags, textOf };
}
