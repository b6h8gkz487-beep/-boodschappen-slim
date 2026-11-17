/* ============================================================
   Kruimel — recepten-app (Crouton-stijl)
   Vanilla JS, data in localStorage.
   ============================================================ */
'use strict';

/* ---------- Opslag ---------- */
const STORE_KEY = 'kruimel.v1';

const SEED = [
  {
    id: 'r-carbonara',
    title: 'Spaghetti Carbonara',
    emoji: '🍝',
    image: '',
    servings: 2,
    time: 25,
    tags: ['pasta', 'italiaans', 'snel'],
    ingredients: [
      { amount: '200 g', name: 'spaghetti' },
      { amount: '100 g', name: 'guanciale of spekjes' },
      { amount: '2', name: 'eieren' },
      { amount: '50 g', name: 'pecorino romano, geraspt' },
      { amount: '1 tl', name: 'zwarte peper, versgemalen' },
      { amount: '1 snuf', name: 'zout' },
    ],
    steps: [
      'Kook de spaghetti al dente in ruim gezouten water (ca. 9 minuten).',
      'Bak ondertussen de guanciale op middelhoog vuur krokant in ca. 5 minuten. Neem de pan van het vuur.',
      'Klop de eieren los met de pecorino en flink wat zwarte peper.',
      'Giet de pasta af, bewaar een kopje kookvocht. Meng de pasta door het spekvet.',
      'Haal de pan van het vuur en roer het eimengsel erdoor. Voeg indien nodig een scheut kookvocht toe tot een zijdezachte saus. Serveer direct met extra pecorino en peper.',
    ],
  },
  {
    id: 'r-shakshuka',
    title: 'Shakshuka',
    emoji: '🍳',
    image: '',
    servings: 4,
    time: 35,
    tags: ['ontbijt', 'vegetarisch', 'pan'],
    ingredients: [
      { amount: '2 el', name: 'olijfolie' },
      { amount: '1', name: 'ui, gesnipperd' },
      { amount: '2', name: 'paprika’s in reepjes' },
      { amount: '3 tenen', name: 'knoflook' },
      { amount: '2 blikken', name: 'tomatenblokjes (400 g)' },
      { amount: '2 tl', name: 'komijn' },
      { amount: '1 tl', name: 'paprikapoeder' },
      { amount: '4-6', name: 'eieren' },
      { amount: 'handvol', name: 'verse koriander of peterselie' },
      { amount: 'naar smaak', name: 'zout en peper' },
    ],
    steps: [
      'Verwarm de olijfolie in een grote pan en fruit de ui 5 minuten glazig.',
      'Voeg paprika en knoflook toe en bak 5 minuten mee.',
      'Roer de tomaten, komijn en paprikapoeder erdoor. Laat 15 minuten op laag vuur indikken. Breng op smaak met zout en peper.',
      'Maak kuiltjes in de saus en breek hier de eieren in. Dek af en laat de eieren in 6-8 minuten stollen.',
      'Bestrooi met kruiden en serveer met brood om te dippen.',
    ],
  },
  {
    id: 'r-appeltaart',
    title: 'Appeltaart van oma',
    emoji: '🥧',
    image: '',
    servings: 10,
    time: 90,
    tags: ['gebak', 'zoet', 'klassieker'],
    ingredients: [
      { amount: '300 g', name: 'bloem' },
      { amount: '200 g', name: 'koude boter in blokjes' },
      { amount: '150 g', name: 'kristalsuiker' },
      { amount: '1', name: 'ei + 1 eierdooier' },
      { amount: '1 kg', name: 'zoete appels' },
      { amount: '3 el', name: 'suiker voor het beslag' },
      { amount: '2 tl', name: 'kaneel' },
      { amount: 'handvol', name: 'rozijnen (optioneel)' },
      { amount: 'snufje', name: 'zout' },
    ],
    steps: [
      'Kneed bloem, boter, 150 g suiker, ei, dooier en zout tot een deeg. Verwikkel in folie en laat 30 minuten rusten in de koelkast.',
      'Schil de appels, snijd ze in blokjes en meng met 3 el suiker, kaneel en eventueel rozijnen.',
      'Verwarm de oven voor op 170 °C. Vet een springvorm van 24 cm in.',
      'Rol 2/3 van het deeg uit en bekleed de bodem en rand. Vul met het appelmengsel.',
      'Rol de rest uit, snijd repen en leg een raster op de taart. Bak in 60 minuten goudbruin.',
      'Laat de taart minstens 1 uur afkoelen voordat je hem aansnijdt.',
    ],
  },
  {
    id: 'r-wraps',
    title: 'Kipwraps met yoghurtsaus',
    emoji: '🌯',
    image: '',
    servings: 4,
    time: 20,
    tags: ['snel', 'lunch', 'kindvriendelijk'],
    ingredients: [
      { amount: '400 g', name: 'kipfilet in reepjes' },
      { amount: '8', name: 'wraps' },
      { amount: '200 g', name: 'yoghurt' },
      { amount: '1 el', name: 'mayonaise' },
      { amount: '1', name: 'komkommer in dunne plakjes' },
      { amount: '2', name: 'tomaten in partjes' },
      { amount: '1 krop', name: 'sla, gescheurd' },
      { amount: '2 tl', name: 'paprikapoeder' },
      { amount: '1 el', name: 'olijfolie' },
      { amount: 'naar smaak', name: 'zout en peper' },
    ],
    steps: [
      'Bak de kipreepjes in de olijfolie met paprikapoeder, zout en peper in 6-8 minuten gaar.',
      'Roer de yoghurt en mayonaise door elkaar met een snufje zout en peper.',
      'Verwarm de wraps volgens de aanwijzingen op de verpakking.',
      'Beleg de wraps met sla, kip, komkommer en tomaat. Schep de yoghurtsaus erover.',
      'Rol de wraps stevig op en serveer.',
    ],
  },
];

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.recipes)) return migrate(s);
    }
  } catch (e) { /* beschadigde data -> opnieuw seeden */ }
  return migrate({ recipes: SEED, shopping: [], plan: {}, theme: 'light' });
}

function migrate(s) {
  s.shopping = Array.isArray(s.shopping) ? s.shopping : [];
  s.plan = s.plan && typeof s.plan === 'object' ? s.plan : {};
  s.theme = s.theme === 'dark' ? 'dark' : 'light';
  return s;
}

let store = loadStore();
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const DAYS = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
const DAY_KEYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

function uid() { return 'r-' + Math.random().toString(36).slice(2, 9); }
function recipe(id) { return store.recipes.find((r) => r.id === id); }
function allTags() {
  const set = new Set();
  store.recipes.forEach((r) => (r.tags || []).forEach((t) => set.add(t)));
  return [...set].sort((a, b) => a.localeCompare(b, 'nl'));
}
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  $('#toast-root').appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
function cardBg(r) {
  return r.image ? `background-image:url('${esc(r.image)}')` : '';
}
function emojiOf(r) { return r.emoji || '🍽️'; }

/* Timer-notatie in stappen: "5 minuten", "30 min", "1 uur", "90 sec" */
function parseSeconds(text) {
  const m = /(\d+)\s*(uur|uren|minuten|min|seconden|sec)/i.exec(text);
  if (!m) return 0;
  const n = parseInt(m[1], 10);
  if (/uur/i.test(m[2])) return n * 3600;
  if (/sec/i.test(m[2])) return n;
  return n * 60;
}
function fmtTime(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.32);
    });
  } catch (e) { /* geen audio beschikbaar */ }
}

/* ---------- Router ---------- */
const routes = {
  '': viewList,
  'nieuw': viewForm,
  'bewerk': viewForm,
  'recept': viewDetail,
  'boodschappen': viewShopping,
  'weekmenu': viewWeek,
};

function navigate() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [name, arg] = hash.split('/');
  window.scrollTo(0, 0);
  stopTimers();
  (routes[name] || viewList)(arg);
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', (a.dataset.nav || '') === (name || ''));
  });
}
window.addEventListener('hashchange', navigate);

/* ---------- Weergave: receptenlijst ---------- */
let activeTag = null;
let query = '';

function viewList() {
  const main = $('#main');
  main.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Recepten</h1>
        <div class="sub">${store.recipes.length} recepten bewaard</div>
      </div>
      <button class="btn ghost" id="import-btn">🌐 Importeren</button>
      <a class="btn" href="#/nieuw">＋ Nieuw recept</a>
    </div>
    <div class="toolbar">
      <input id="q" class="search" placeholder="Zoek op naam, ingrediënt of tag…" value="${esc(query)}" />
      <select id="sort" class="search">
        <option value="nieuw">Nieuwste eerst</option>
        <option value="naam">Naam (A–Z)</option>
        <option value="tijd">Kortste bereiding</option>
      </select>
    </div>
    <div id="grid" class="grid"></div>
  `;

  const renderGrid = () => {
    let list = store.recipes.filter((r) => {
      const hay = [r.title, ...(r.tags || []), ...(r.ingredients || []).map((i) => i.name)]
        .join(' ').toLowerCase();
      if (query && !hay.includes(query.toLowerCase())) return false;
      if (activeTag && !(r.tags || []).includes(activeTag)) return false;
      return true;
    });
    const sort = $('#sort').value;
    if (sort === 'naam') list.sort((a, b) => a.title.localeCompare(b.title, 'nl'));
    else if (sort === 'tijd') list.sort((a, b) => (a.time || 999) - (b.time || 999));
    else list = [...list].reverse();

    const grid = $('#grid');
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1">
        <div class="big">🥄</div><p>Geen recepten gevonden.</p>
        <p style="margin-top:12px"><a class="btn ghost" href="#/nieuw">Voeg je eerste recept toe</a></p></div>`;
      return;
    }
    grid.innerHTML = list.map((r) => `
      <div class="card" data-id="${r.id}">
        <div class="card-img" style="${cardBg(r)}">${r.image ? '' : emojiOf(r)}</div>
        <div class="card-body">
          <div class="card-title">${esc(r.title)}</div>
          <div class="card-meta">
            <span>⏱ ${r.time || '?'} min</span>
            <span>🍽 ${r.servings || '?'} pers.</span>
          </div>
          <div class="card-tags">${(r.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');
    grid.querySelectorAll('.card').forEach((c) =>
      c.addEventListener('click', () => location.hash = `#/recept/${c.dataset.id}`));
  };

  $('#import-btn').addEventListener('click', importModal);
  $('#q').addEventListener('input', (e) => { query = e.target.value; renderGrid(); });
  $('#sort').addEventListener('change', renderGrid);
  renderTagCloud();
  renderGrid();
}

function renderTagCloud() {
  const cloud = $('#tag-cloud');
  const tags = allTags();
  cloud.innerHTML = tags.length
    ? tags.map((t) => `<span class="tag ${t === activeTag ? 'on' : ''}" data-tag="${esc(t)}">${esc(t)}</span>`).join('')
    : '<span style="color:var(--text-soft);font-size:13px">Nog geen tags</span>';
  cloud.querySelectorAll('.tag').forEach((el) =>
    el.addEventListener('click', () => {
      activeTag = activeTag === el.dataset.tag ? null : el.dataset.tag;
      if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
      else navigate();
    }));
}

/* ---------- Weergave: receptdetail ---------- */
let detailScale = 1;

function viewDetail(id) {
  const r = recipe(id);
  const main = $('#main');
  if (!r) { main.innerHTML = '<div class="empty"><div class="big">🤷</div><p>Recept niet gevonden.</p></div>'; return; }
  detailScale = 1;

  const render = () => {
    main.innerHTML = `
      <div class="detail-hero" style="${cardBg(r)}">${r.image ? '' : emojiOf(r)}</div>
      <div class="detail-head">
        <h1>${esc(r.title)}</h1>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" id="cook">🔥 Kookmodus</button>
          <button class="btn ghost" id="to-shop">🛒 Naar boodschappenlijst</button>
          <a class="btn ghost" href="#/bewerk/${r.id}">✏️ Bewerken</a>
          <button class="btn ghost danger" id="del">🗑</button>
        </div>
      </div>
      <div class="meta-row">
        <span>⏱ ${r.time || '?'} minuten</span>
        <span>🍽 ${r.servings || '?'} personen</span>
        <span>${(r.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join(' ')}</span>
      </div>
      <div class="cols">
        <div class="panel">
          <h2>Ingrediënten</h2>
          <div class="servings">
            <button id="minus">−</button>
            <span id="serv-label">${Math.max(1, Math.round((r.servings || 1) * detailScale))} personen</span>
            <button id="plus">＋</button>
          </div>
          <div id="ings"></div>
        </div>
        <div class="panel">
          <h2>Bereiding</h2>
          <div id="steps">
            ${(r.steps || []).map((s, i) => `
              <div class="step"><div class="step-num">${i + 1}</div><div>${esc(s)}</div></div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const renderIngs = () => {
      $('#serv-label').textContent = `${Math.max(1, Math.round((r.servings || 1) * detailScale))} personen`;
      $('#ings').innerHTML = (r.ingredients || []).map((ing, i) => `
        <label class="ing-row" data-i="${i}">
          <input type="checkbox" />
          <span>${esc(scaleAmount(ing.amount, detailScale))} ${esc(ing.name)}</span>
        </label>
      `).join('');
      $('#ings').querySelectorAll('.ing-row').forEach((row) =>
        row.querySelector('input').addEventListener('change', (e) =>
          row.classList.toggle('done', e.target.checked)));
    };

    $('#minus').addEventListener('click', () => { detailScale = Math.max(0.25, detailScale - 0.5) ; renderIngs(); });
    $('#plus').addEventListener('click', () => { detailScale = Math.min(6, detailScale + 0.5); renderIngs(); });
    $('#cook').addEventListener('click', () => openCook(r));
    $('#del').addEventListener('click', () => confirmModal(`“${r.title}” verwijderen?`, () => {
      store.recipes = store.recipes.filter((x) => x.id !== r.id);
      save(); toast('Recept verwijderd'); location.hash = '#/';
    }));
    $('#to-shop').addEventListener('click', () => {
      addRecipeToShopping(r, detailScale);
      toast('Ingrediënten toegevoegd aan je boodschappenlijst');
      if (confirm('Naar de boodschappenlijst gaan?')) location.hash = '#/boodschappen';
    });
    renderIngs();
  };
  render();
}

/* Schaalt eenvoudige hoeveelheden: "200 g" -> "300 g" bij 1.5x */
function scaleAmount(amount, scale) {
  if (!amount || scale === 1) return amount || '';
  return amount.replace(/(\d+(?:[.,]\d+)?)/g, (m) => {
    const v = parseFloat(m.replace(',', '.')) * scale;
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10).replace('.', ',');
  });
}

/* ---------- Kookmodus ---------- */
let cookTimers = [];

function stopTimers() {
  cookTimers.forEach(clearInterval);
  cookTimers = [];
}

function openCook(r) {
  const steps = r.steps || [];
  if (!steps.length) { toast('Dit recept heeft geen stappen'); return; }
  let idx = 0;
  let timer = { left: 0, running: false };

  const root = document.createElement('div');
  root.className = 'cook';
  document.body.appendChild(root);

  const render = () => {
    const stepSeconds = parseSeconds(steps[idx]);
    const pct = ((idx + 1) / steps.length) * 100;
    root.innerHTML = `
      <div class="cook-top">
        <button class="btn ghost small" id="exit">✕ Sluiten</button>
        <h2>${esc(r.title)}</h2>
        <span style="color:var(--text-soft);font-size:14px">stap ${idx + 1} van ${steps.length}</span>
      </div>
      <div class="cook-progress"><div style="width:${pct}%"></div></div>
      <div class="cook-body">
        <div class="cook-step-num">Stap ${idx + 1}</div>
        <div class="cook-text">${esc(steps[idx])}</div>
        ${stepSeconds ? `
          <div>
            <div class="cook-timer" id="timer">${fmtTime(stepSeconds)}</div>
            <button class="btn" id="start-timer">▶ Timer starten (${Math.round(stepSeconds / 60)} min)</button>
          </div>` : ''}
      </div>
      <div class="cook-nav">
        <button class="btn ghost" id="prev" ${idx === 0 ? 'disabled' : ''}>← Vorige</button>
        ${idx < steps.length - 1
          ? '<button class="btn" id="next">Volgende →</button>'
          : '<button class="btn" id="finish">🍽 Klaar!</button>'}
      </div>
    `;

    $('#exit', root).addEventListener('click', () => { stopTimers(); root.remove(); });
    $('#prev', root).addEventListener('click', () => { stopTimers(); idx--; render(); });
    const next = $('#next', root) || $('#finish', root);
    next.addEventListener('click', () => {
      stopTimers();
      if (idx < steps.length - 1) { idx++; render(); }
      else { root.remove(); toast('Eet smakelijk! 🍽'); }
    });

    const startBtn = $('#start-timer', root);
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        stopTimers();
        timer = { left: stepSeconds, running: true };
        const el = $('#timer', root);
        startBtn.disabled = true;
        cookTimers.push(setInterval(() => {
          timer.left--;
          if (timer.left <= 0) {
            stopTimers();
            el.textContent = 'Klaar! 🔔';
            el.classList.add('done');
            beep();
            return;
          }
          el.textContent = fmtTime(timer.left);
        }, 1000));
      });
    }
  };
  render();
}

/* ---------- Import van website ---------- */
function importModal() {
  const root = $('#modal-root');
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <h3>🌐 Recept van website importeren</h3>
        <p style="color:var(--text-soft);font-size:14px;margin-bottom:12px">
          Plak de link van een receptpagina (bijv. van een foodblog). Kruimel leest de
          receptgegevens automatisch uit.
        </p>
        <input id="m-url" class="search" style="width:100%" placeholder="https://…" />
        <div id="m-err" style="color:#c0392b;font-size:13px;margin-top:8px"></div>
        <div class="actions">
          <button class="btn ghost" id="m-no">Annuleren</button>
          <button class="btn" id="m-ok">Ophalen</button>
        </div>
      </div>
    </div>`;
  const input = $('#m-url', root);
  input.focus();
  const close = () => root.innerHTML = '';
  $('#m-no', root).addEventListener('click', close);
  const go = async () => {
    const u = input.value.trim();
    if (!u) return;
    const btn = $('#m-ok', root);
    btn.disabled = true; btn.textContent = 'Ophalen…';
    try {
      const resp = await fetch(`/api/import?url=${encodeURIComponent(u)}`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Import mislukt');
      close();
      pendingImport = data.recipe;
      toast('Recept gevonden! Controleer en sla op.');
      location.hash = '#/nieuw';
    } catch (err) {
      $('#m-err', root).textContent = err.message;
      btn.disabled = false; btn.textContent = 'Ophalen';
    }
  };
  $('#m-ok', root).addEventListener('click', go);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
}

let pendingImport = null;

/* ---------- Weergave: formulier (nieuw/bewerk) ---------- */
function viewForm(id) {
  const r = id ? recipe(id) : null;
  const main = $('#main');
  const data = r || (pendingImport ? (() => { const d = pendingImport; pendingImport = null; return d; })() : { title: '', emoji: '', image: '', servings: 2, time: 30, tags: [], ingredients: [{ amount: '', name: '' }], steps: [''] });

  main.innerHTML = `
    <div class="page-head"><h1>${r ? 'Recept bewerken' : 'Nieuw recept'}</h1></div>
    <form id="form" style="max-width:760px">
      <div class="row2">
        <div class="field"><label>Naam</label><input name="title" required value="${esc(data.title)}" placeholder="bijv. Oma’s appeltaart" /></div>
        <div class="field"><label>Emoji (voor als er geen foto is)</label><input name="emoji" value="${esc(data.emoji || '')}" placeholder="🥧" maxlength="4" /></div>
      </div>
      <div class="row2">
        <div class="field"><label>Foto-URL (optioneel)</label><input name="image" value="${esc(data.image || '')}" placeholder="https://…" /></div>
        <div class="field"><label>Tags (kommagescheiden)</label><input name="tags" value="${esc((data.tags || []).join(', '))}" placeholder="pasta, snel, vegetarisch" /></div>
      </div>
      <div class="row2">
        <div class="field"><label>Personen</label><input name="servings" type="number" min="1" value="${data.servings || 2}" /></div>
        <div class="field"><label>Bereidingstijd (minuten)</label><input name="time" type="number" min="1" value="${data.time || 30}" /></div>
      </div>
      <div class="field list-editor">
        <label>Ingrediënten</label>
        <div id="ing-lines"></div>
        <button type="button" class="btn ghost small" id="add-ing">＋ Ingrediënt</button>
      </div>
      <div class="field list-editor">
        <label>Bereidingsstappen</label>
        <div id="step-lines"></div>
        <button type="button" class="btn ghost small" id="add-step">＋ Stap</button>
      </div>
      <div style="display:flex;gap:10px;margin-top:20px">
        <button class="btn" type="submit">💾 Opslaan</button>
        <a class="btn ghost" href="${r ? `#/recept/${r.id}` : '#/'}">Annuleren</a>
      </div>
    </form>
  `;

  const line = (placeholder, value) =>
    `<div class="line"><input placeholder="${esc(placeholder)}" value="${esc(value)}" /><button type="button" class="icon-btn" title="verwijderen">✕</button></div>`;

  const ingBox = $('#ing-lines');
  const stepBox = $('#step-lines');
  const bind = (box) => box.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-btn')) {
      const lines = box.querySelectorAll('.line');
      if (lines.length > 1) e.target.closest('.line').remove();
    }
  });
  bind(ingBox); bind(stepBox);

  const refresh = (box, values, ph) => {
    box.innerHTML = values.map((v) => line(ph, v)).join('');
  };
  const ingVals = data.ingredients.map((i) => `${i.amount ? i.amount + ' ' : ''}${i.name}`).filter((v) => v.trim());
  refresh(ingBox, ingVals.length ? ingVals : [''], '200 g spaghetti');
  const stepVals = data.steps.filter((s) => s && s.trim());
  refresh(stepBox, stepVals.length ? stepVals : [''], 'Beschrijf deze stap…');

  $('#add-ing').addEventListener('click', () => ingBox.insertAdjacentHTML('beforeend', line('200 g spaghetti', '')));
  $('#add-step').addEventListener('click', () => stepBox.insertAdjacentHTML('beforeend', line('Beschrijf deze stap…', '')));

  $('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const ingredients = [...ingBox.querySelectorAll('input')].map((inp) => inp.value.trim()).filter(Boolean)
      .map((raw) => {
        const m = /^((?:\d+(?:[.,]\d+)?\s*(?:kg|g|ml|l|el|tl|stuk|stuks|tenen|teen|blik|blikken|pak|zak|handvol|snuf(?:je)?|naar smaak)?\s*|½|¼)\s+)?(.+)$/i.exec(raw);
        return m ? { amount: (m[1] || '').trim(), name: m[2].trim() } : { amount: '', name: raw };
      });
    const steps = [...stepBox.querySelectorAll('input')].map((inp) => inp.value.trim()).filter(Boolean);
    const rec = {
      id: r ? r.id : uid(),
      title: f.elements.namedItem('title').value.trim() || 'Naamloos recept',
      emoji: f.elements.namedItem('emoji').value.trim(),
      image: f.elements.namedItem('image').value.trim(),
      servings: Math.max(1, parseInt(f.elements.namedItem('servings').value, 10) || 1),
      time: Math.max(1, parseInt(f.elements.namedItem('time').value, 10) || 1),
      tags: f.elements.namedItem('tags').value.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      ingredients,
      steps,
    };
    if (r) Object.assign(r, rec);
    else store.recipes.push(rec);
    save();
    toast(r ? 'Recept bijgewerkt' : 'Recept opgeslagen');
    location.hash = `#/recept/${rec.id}`;
  });
}

/* ---------- Boodschappenlijst ---------- */
function addRecipeToShopping(r, scale = 1) {
  (r.ingredients || []).forEach((ing) => {
    const label = `${scaleAmount(ing.amount, scale) ? scaleAmount(ing.amount, scale) + ' ' : ''}${ing.name}`.trim();
    const existing = store.shopping.find((s) => s.label === label);
    if (existing) existing.qty = (existing.qty || 1) + 1;
    else store.shopping.push({ label, done: false, from: r.title, qty: 1 });
  });
  save();
  updateBadge();
}

function viewShopping() {
  const main = $('#main');
  const groups = {};
  store.shopping.forEach((s) => {
    const g = s.from || 'Losse items';
    (groups[g] = groups[g] || []).push(s);
  });
  const openCount = store.shopping.filter((s) => !s.done).length;
  updateBadge();

  main.innerHTML = `
    <div class="page-head">
      <div><h1>Boodschappenlijst</h1>
      <div class="sub">${openCount} dingen nog te halen</div></div>
      <div style="display:flex;gap:8px">
        <button class="btn ghost" id="add-item">＋ Los item</button>
        <button class="btn ghost danger" id="clear-done">Vinkjes wissen</button>
        <button class="btn danger" id="clear-all">Lijst leegmaken</button>
      </div>
    </div>
    ${store.shopping.length === 0 ? `
      <div class="empty"><div class="big">🛒</div>
      <p>Je lijst is leeg. Open een recept en tik op “Naar boodschappenlijst”.</p></div>` : ''}
    ${Object.entries(groups).map(([from, items]) => `
      <div class="shop-group">
        <h3 style="margin-bottom:10px;color:var(--text-soft);font-size:14px">${esc(from)}</h3>
        ${items.map((s, i) => `
          <div class="shop-item ${s.done ? 'done' : ''}" data-i="${store.shopping.indexOf(s)}">
            <input type="checkbox" ${s.done ? 'checked' : ''} />
            <span>${esc(s.label)}${s.qty > 1 ? ` <small style="color:var(--text-soft)">×${s.qty}</small>` : ''}</span>
            <button class="btn ghost small rm">✕</button>
          </div>
        `).join('')}
      </div>
    `).join('')}
  `;

  main.querySelectorAll('.shop-item').forEach((row) => {
    const i = parseInt(row.dataset.i, 10);
    row.querySelector('input').addEventListener('change', (e) => {
      store.shopping[i].done = e.target.checked;
      save(); viewShopping();
    });
    row.querySelector('.rm').addEventListener('click', () => {
      store.shopping.splice(i, 1); save(); viewShopping();
    });
  });
  $('#clear-done')?.addEventListener('click', () => { store.shopping = store.shopping.filter((s) => !s.done); save(); viewShopping(); });
  $('#clear-all')?.addEventListener('click', () => confirmModal('De hele lijst leegmaken?', () => { store.shopping = []; save(); viewShopping(); }));
  $('#add-item')?.addEventListener('click', () => promptModal('Nieuw boodschapitem', (val) => {
    if (val && val.trim()) { store.shopping.push({ label: val.trim(), done: false, from: 'Losse items', qty: 1 }); save(); viewShopping(); }
  }));
}

function updateBadge() {
  const n = store.shopping.filter((s) => !s.done).length;
  const b = $('#badge-boodschappen');
  b.hidden = n === 0;
  b.textContent = n;
}

/* ---------- Weekmenu ---------- */
function viewWeek() {
  const main = $('#main');
  main.innerHTML = `
    <div class="page-head">
      <div><h1>Weekmenu</h1><div class="sub">Plan je week en zet alles op één boodschappenlijst</div></div>
      <button class="btn" id="plan-shop">🛒 Alles naar boodschappenlijst</button>
    </div>
    <div class="week">
      ${DAY_KEYS.map((k, i) => `
        <div class="day" data-day="${k}">
          <h4>${DAYS[i]}</h4>
          <div class="meals"></div>
          <button class="add-meal">＋ recept</button>
        </div>
      `).join('')}
    </div>
  `;

  const renderDay = (dayEl, k) => {
    const ids = store.plan[k] || [];
    dayEl.querySelector('.meals').innerHTML = ids.map((id) => {
      const r = recipe(id);
      if (!r) return '';
      return `<div class="meal"><span>${esc(r.title)}</span><span class="x" data-id="${id}" title="verwijderen">✕</span></div>`;
    }).join('');
    dayEl.querySelectorAll('.x').forEach((x) => x.addEventListener('click', () => {
      store.plan[k] = (store.plan[k] || []).filter((id) => id !== x.dataset.id);
      save(); viewWeek();
    }));
  };

  main.querySelectorAll('.day').forEach((dayEl) => {
    const k = dayEl.dataset.day;
    renderDay(dayEl, k);
    dayEl.querySelector('.add-meal').addEventListener('click', () => {
      if (!store.recipes.length) { toast('Voeg eerst een recept toe'); return; }
      pickModal('Kies een recept', store.recipes.map((r) => ({ id: r.id, label: `${emojiOf(r)} ${r.title}` })), (id) => {
        (store.plan[k] = store.plan[k] || []).push(id);
        save(); viewWeek();
      });
    });
  });

  $('#plan-shop').addEventListener('click', () => {
    const ids = Object.values(store.plan).flat();
    if (!ids.length) { toast('Je weekmenu is nog leeg'); return; }
    ids.map(recipe).filter(Boolean).forEach((r) => addRecipeToShopping(r, 1));
    toast(`${new Set(ids).size} recepten toegevoegd aan je boodschappenlijst`);
  });
}

/* ---------- Modals ---------- */
function confirmModal(text, onYes) {
  const root = $('#modal-root');
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <h3>Even checken</h3>
        <p>${esc(text)}</p>
        <div class="actions">
          <button class="btn ghost" id="m-no">Annuleren</button>
          <button class="btn danger" id="m-yes">Ja, doen</button>
        </div>
      </div>
    </div>`;
  $('#m-no', root).addEventListener('click', () => root.innerHTML = '');
  $('#m-yes', root).addEventListener('click', () => { root.innerHTML = ''; onYes(); });
}

function promptModal(title, onSubmit) {
  const root = $('#modal-root');
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <h3>${esc(title)}</h3>
        <input id="m-input" class="search" style="width:100%" />
        <div class="actions">
          <button class="btn ghost" id="m-no">Annuleren</button>
          <button class="btn" id="m-ok">Toevoegen</button>
        </div>
      </div>
    </div>`;
  const input = $('#m-input', root);
  input.focus();
  const close = () => root.innerHTML = '';
  $('#m-no', root).addEventListener('click', close);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { onSubmit(input.value); close(); } });
  $('#m-ok', root).addEventListener('click', () => { onSubmit(input.value); close(); });
}

function pickModal(title, options, onPick) {
  const root = $('#modal-root');
  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <h3>${esc(title)}</h3>
        <div style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">
          ${options.map((o) => `<button class="btn ghost" data-id="${o.id}" style="justify-content:flex-start">${esc(o.label)}</button>`).join('')}
        </div>
        <div class="actions"><button class="btn ghost" id="m-no">Annuleren</button></div>
      </div>
    </div>`;
  root.querySelectorAll('[data-id]').forEach((b) =>
    b.addEventListener('click', () => { root.innerHTML = ''; onPick(b.dataset.id); }));
  $('#m-no', root).addEventListener('click', () => root.innerHTML = '');
}

/* ---------- Thema ---------- */
function applyTheme() {
  document.documentElement.dataset.theme = store.theme;
  $('#theme-toggle').textContent = store.theme === 'dark' ? '☀️ Licht' : '🌙 Donker';
}
$('#theme-toggle').addEventListener('click', () => {
  store.theme = store.theme === 'dark' ? 'light' : 'dark';
  save(); applyTheme();
});

/* ---------- Start ---------- */
applyTheme();
updateBadge();
navigate();
