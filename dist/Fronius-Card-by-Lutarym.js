/*
 * Fronius-Card-by-Lutarym
 * Lovelace-Karte für den Fronius Wattpilot (Integration: fronius_wattpilot_lutarym)
 * Version: 0.2.0
 * Lizenz: MIT
 */
const CARD_VERSION = '0.2.0';
const CARD_TAG = 'fronius-card-by-lutarym';
const INTEGRATION_DOMAIN = 'fronius_wattpilot_lutarym';

const COLORS = {
  blue: '#4d9bff',
  yellow: '#f4c94a',
  green: '#43c77f',
  white: '#f3f5f8',
  red: '#ff5a5a',
};

const MODELS = {
  'home': 'Go / Home (weiß)',
  'flex-home': 'Flex Home (hell)',
  'flex-pro': 'Flex Pro (anthrazit)',
};

// Texte aus den Übersetzungen der Integration (de.json), Schlüssel sind die Zustände
const CAR_LABEL = {
  unknown_error: 'Unbekannt oder Fehler',
  idle: 'Kein Fahrzeug',
  charging: 'Lädt',
  waitcar: 'Angesteckt, wartet',
  complete: 'Ladung abgeschlossen',
  error: 'Fehler',
};
const LMO_LABEL = { standard: 'Standard', eco: 'Eco Mode', nexttrip: 'Next Trip Mode' };
const MODEL_STATUS_LABEL = {
  notchargingbecausenochargectrldata: 'Kein Laden, keine Ladesteuerungsdaten',
  notchargingbecauseovertemperature: 'Kein Laden wegen Übertemperatur',
  notchargingbecauseaccesscontrolwait: 'Kein Laden, Freigabe fehlt',
  chargingbecauseforcestateon: 'Laden erzwungen',
  notchargingbecauseforcestateoff: 'Laden unterbunden',
  notchargingbecausescheduler: 'Kein Laden wegen Zeitplan',
  notchargingbecauseenergylimit: 'Kein Laden, Energiegrenze erreicht',
  chargingbecauseawattarpricelow: 'Laden wegen niedrigem Strompreis',
  chargingbecauseautomaticstoptestladung: 'Laden, Testladung',
  chargingbecauseautomaticstopnotenoughtime: 'Laden, Zeit reicht nicht',
  chargingbecauseautomaticstop: 'Laden bis zum automatischen Stopp',
  chargingbecauseautomaticstopnoclock: 'Laden, keine Uhrzeit vorhanden',
  chargingbecausepvsurplus: 'Laden mit PV-Überschuss',
  chargingbecausefallbackgoedefault: 'Laden im Rückfallbetrieb',
  chargingbecausefallbackgoescheduler: 'Laden im Rückfallbetrieb mit Zeitplan',
  chargingbecausefallbackdefault: 'Laden im Standard-Rückfallbetrieb',
  notchargingbecausefallbackgoeawattar: 'Kein Laden, Rückfallbetrieb Strompreis',
  notchargingbecausefallbackawattar: 'Kein Laden, Rückfall auf Strompreis',
  notchargingbecausefallbackautomaticstop: 'Kein Laden, Rückfall auf automatischen Stopp',
  chargingbecausecarcompatibilitykeepalive: 'Laden zur Fahrzeugkompatibilität',
  chargingbecausechargepausenotallowed: 'Laden, Pause nicht erlaubt',
  notchargingbecausesimulateunplugging: 'Kein Laden, Abstecken wird simuliert',
  notchargingbecausephaseswitch: 'Kein Laden wegen Phasenumschaltung',
  notchargingbecauseminpauseduration: 'Kein Laden, Mindestpause läuft',
};
// Fehlertexte aus de.json der Integration (Schlüssel = Zustand von err)
const ERR_LABEL = {
  none: 'Kein Fehler', fiac: 'Fehlerstrom Wechselstrom', fidc: 'Fehlerstrom Gleichstrom',
  phase: 'Phasenfehler', overvolt: 'Überspannung', overamp: 'Überstrom', diode: 'Diodenfehler',
  ppinvalid: 'Ungültige Kabelkennung', gndinvalid: 'Erdung fehlerhaft', contactorstuck: 'Schütz klemmt',
  contactormiss: 'Schütz zieht nicht an', fiunknown: 'Fehlerstrom unbekannt', unknown: 'Unbekannt',
  overtemp: 'Übertemperatur', nocomm: 'Keine Kommunikation', statuslockstuckopen: 'Verriegelung klemmt offen',
  statuslockstucklocked: 'Verriegelung klemmt geschlossen',
};
const LED_SOURCE_COLOR ={ pv: COLORS.yellow, battery: COLORS.green, grid: COLORS.white };
const LED_SOURCE_LABEL = { pv: 'PV-Überschuss', battery: 'Hausspeicher', grid: 'Netz' };

// Zeitwerte der Animation. Im Handbuch nicht angegeben, daher Annahmen.
const RAINBOW_MS = 3000;
const FLASH_MS = 500;
const CHASE_PER_SEC = 6;

// Schlüssel der Integration, die die Karte braucht
const KEYS = {
  amp: 'amp',               // Ladestrom (number)
  power: 'nrg_ptotal',      // Ladeleistung (sensor, W)
  car: 'car',               // Fahrzeugstatus (sensor, Schlüssel)
  session: 'wh',            // Energie seit Start/Anstecken (sensor, Wh)
  total: 'eto',             // Gesamtenergie (sensor, Wh)
  error: 'err',             // Fehlerstatus (sensor, Schlüssel)
  mode: 'lmo',              // Lademodus (select)
  modelStatus: 'modelStatus', // Grund für Laden/Nicht-Laden (sensor, Schlüssel)
  trx: 'trx',               // Aktive Transaktion, 0 = keine Karte (number)
  cards: 'cards',           // Registrierte Karten, Liste in den Attributen (sensor)
};

// Namen der optionalen manuellen Konfiguration je Schlüssel
const CONFIG_NAME = {
  amp: 'charging_current',
  power: 'power',
  car: 'car',
  session: 'session_energy',
  total: 'total_energy',
  error: 'error',
  mode: 'mode',
  modelStatus: 'model_status',
  trx: 'active_card',
  cards: 'cards',
};

function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

class FroniusWattpilotCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = null;
    this._hass = null;
    this._built = false;
    this._raf = null;
    this._ledEls = [];
    this._startAt = performance.now();
    this._loop = this._loop.bind(this);
    this._pendingAmp = null;
    this._entityMap = null;      // Schlüssel -> Entitäts-ID, aus der Registry gefunden
    this._discovering = false;
    this._discovered = false;
    this._discoverMsg = '';
    this._readings = null;
  }

  // ---------- Home-Assistant-Schnittstelle ----------

  setConfig(config) {
    if (!config) throw new Error('Keine Konfiguration angegeben.');
    this._config = Object.assign({
      name: 'Wattpilot',
      model: 'flex-home',
      max_current: 16,
      led_source: 'pv',
      serial: null,
    }, config);
    if (!MODELS[this._config.model]) {
      throw new Error('Unbekanntes Modell: ' + this._config.model + ' (erlaubt: ' + Object.keys(MODELS).join(', ') + ')');
    }
    this._built = false;
    this._build();
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._discovered && !this._discovering) this._discover();
    this._update();
  }

  getCardSize() {
    return 7;
  }

  static getStubConfig() {
    return { name: 'Wattpilot', model: 'flex-home', max_current: 16, led_source: 'pv' };
  }

  connectedCallback() {
    if (this._raf === null) this._raf = requestAnimationFrame(this._loop);
  }

  disconnectedCallback() {
    if (this._raf !== null) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  // ---------- Entitäten finden ----------

  // Liest die Entitäts-Registry und ordnet jede Entität über ihre eindeutige Kennung
  // ("<Seriennummer>_<Schlüssel>") dem Schlüssel der Integration zu. Das funktioniert
  // unabhängig von der Sprache der Instanz.
  async _discover() {
    this._discovering = true;
    try {
      const list = await this._hass.callWS({ type: 'config/entity_registry/list' });
      const bySerial = {};
      list.forEach((entry) => {
        if (entry.platform !== INTEGRATION_DOMAIN || !entry.unique_id) return;
        const idx = entry.unique_id.indexOf('_');
        if (idx < 0) return;
        const serial = entry.unique_id.slice(0, idx);
        const key = entry.unique_id.slice(idx + 1);
        (bySerial[serial] = bySerial[serial] || {})[key] = entry.entity_id;
      });
      const serials = Object.keys(bySerial);
      if (!serials.length) {
        this._discoverMsg = 'Keine Wattpilot-Entitäten gefunden. Ist die Integration eingerichtet?';
      } else {
        const chosen = this._config?.serial && bySerial[this._config.serial] ? this._config.serial : serials[0];
        this._entityMap = bySerial[chosen];
        if (serials.length > 1 && !this._config?.serial) {
          this._discoverMsg = 'Mehrere Wattpilot gefunden, es wird der erste genutzt. Mit "serial" lässt sich das ändern.';
        }
      }
    } catch (e) {
      this._discoverMsg = 'Entitäten konnten nicht automatisch gefunden werden (' + (e?.message || e) + '). Bitte die IDs in der Konfiguration eintragen.';
    } finally {
      this._discovered = true;
      this._discovering = false;
      this._update();
    }
  }

  // Entitäts-ID eines Schlüssels: zuerst die manuelle Konfiguration, dann die automatische Erkennung
  _ent(key) {
    const override = this._config ? this._config[CONFIG_NAME[key]] : null;
    if (override) return override;
    return this._entityMap ? this._entityMap[key] || null : null;
  }

  _state(entityId) {
    if (!entityId || !this._hass || !this._hass.states[entityId]) return null;
    return this._hass.states[entityId];
  }

  _num(entityId) {
    const s = this._state(entityId);
    if (!s) return null;
    const v = parseFloat(s.state);
    return Number.isFinite(v) ? v : null;
  }

  // ---------- Werte lesen ----------

  _read() {
    const amp = this._state(this._ent(KEYS.amp));
    const maxAttr = amp && amp.attributes ? parseFloat(amp.attributes.max) : NaN;
    const maxA = Math.min(Number(this._config.max_current), Number.isFinite(maxAttr) ? maxAttr : Number(this._config.max_current));

    const powerS = this._state(this._ent(KEYS.power));
    let powerKw = powerS ? parseFloat(powerS.state) : NaN;
    if (Number.isFinite(powerKw)) {
      const unit = powerS.attributes?.unit_of_measurement;
      powerKw = unit === 'W' ? powerKw / 1000 : powerKw;
    } else {
      powerKw = null;
    }

    const carS = this._state(this._ent(KEYS.car));
    const car = carS ? carS.state : null;
    const connected = ['charging', 'waitcar', 'complete'].includes(car);
    const charging = car === 'charging';

    const errS = this._state(this._ent(KEYS.error));
    const errKey = errS ? String(errS.state).toLowerCase() : null;
    const hasError = !!errKey && !['none', 'unknown', 'unavailable'].includes(errKey);

    const modeS = this._state(this._ent(KEYS.mode));
    const modeOptions = modeS?.attributes?.options || [];

    const statusS = this._state(this._ent(KEYS.modelStatus));
    const statusKey = statusS ? statusS.state : null;

    const sessionS = this._state(this._ent(KEYS.session));
    const totalS = this._state(this._ent(KEYS.total));
    const toKwh = (s) => {
      if (!s) return null;
      const v = parseFloat(s.state);
      if (!Number.isFinite(v)) return null;
      return s.attributes?.unit_of_measurement === 'Wh' ? v / 1000 : v;
    };

    // Aktiver Chip: trx zeigt die Nummer der Karte, 1 entspricht dem ersten Eintrag der Liste
    const trxS = this._state(this._ent(KEYS.trx));
    const trx = trxS ? parseInt(trxS.state, 10) : 0;
    const cardsS = this._state(this._ent(KEYS.cards));
    const cardItems = Array.isArray(cardsS?.attributes?.items) ? cardsS.attributes.items : [];
    const activeCard = trx > 0 && cardItems[trx - 1] ? cardItems[trx - 1] : null;

    return {
      amp: this._num(this._ent(KEYS.amp)), maxA,
      powerKw, car, connected, charging, complete: car === 'complete',
      hasError, errKey,
      mode: modeS ? modeS.state : null, modeOptions,
      statusKey,
      session: toKwh(sessionS), total: toKwh(totalS),
      activeCard,
      cardCount: cardItems.length,
    };
  }

  // ---------- Aufbau ----------

  _build() {
    if (this._built || !this._config) return;
    const c = this._config;
    const shape = c.model === 'home' ? this._homeShape() : this._flexShape(c.model === 'flex-pro');
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          --bg: #ffffff; --fg: #161b26; --muted: #5d6676; --line: #d8dee7; --well: #eef2f6;
          --studio-a: #ffffff; --studio-b: #dfe5ec; --accent: #0a6c86; --accent-ink: #ffffff;
          background: var(--ha-card-background, var(--bg));
          color: var(--primary-text-color, var(--fg));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, none);
          padding: 16px; box-sizing: border-box;
          font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
        }
        @media (prefers-color-scheme: dark) {
          .card:not([data-theme="light"]) { --well: #1d242d; --studio-a: #2a313b; --studio-b: #14181e; --accent: #5fd0e8; --accent-ink: #061115; --muted: #97a2b1; --line: #262e39; }
        }
        .head { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
        .title { font-size: 16px; font-weight: 650; margin: 0; }
        .badge { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); border-radius: 999px; padding: 3px 9px; white-space: nowrap; }
        .stage { display: grid; grid-template-columns: minmax(0, 170px) minmax(0, 1fr); gap: 16px; align-items: center; }
        @media (max-width: 480px) { .stage { grid-template-columns: minmax(0, 1fr); justify-items: center; } }
        .studio { border-radius: 12px; padding: 14px; width: 100%; max-width: 190px; background: radial-gradient(120% 90% at 50% 20%, var(--studio-a), var(--studio-b)); border: 1px solid var(--line); box-sizing: border-box; }
        svg { width: 100%; height: auto; display: block; overflow: visible; }
        .state { font-size: 16px; font-weight: 650; }
        .sub { color: var(--muted); font-size: 12px; margin-top: 2px; }
        .values { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 10px; }
        .val { background: var(--well); border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; min-width: 0; }
        .val .k { font-size: 10px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
        .val .v { font-size: 18px; font-weight: 650; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
        .val .v small { font-size: 11px; font-weight: 500; color: var(--muted); margin-left: 2px; }
        .chip { margin-top: 8px; display: flex; align-items: center; gap: 8px; font-size: 12px; background: var(--well); border: 1px solid var(--line); border-radius: 10px; padding: 7px 10px; }
        .chip .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); flex: none; }
        .chip.active .dot { background: var(--accent); }
        .chip b { font-weight: 650; }
        .controls { margin-top: 12px; display: grid; gap: 10px; }
        .row { display: grid; gap: 6px; }
        .row h3 { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin: 0; font-weight: 650; }
        .seg { display: flex; flex-wrap: wrap; gap: 6px; }
        button { font: inherit; font-size: 12px; color: var(--primary-text-color, var(--fg)); background: var(--well); border: 1px solid var(--line); border-radius: 9px; padding: 6px 10px; cursor: pointer; min-height: 34px; }
        button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        button[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
        button:disabled { opacity: .5; cursor: default; }
        .slider { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: center; font-size: 12px; }
        input[type="range"] { width: 100%; accent-color: var(--accent); min-width: 0; }
        output { font-variant-numeric: tabular-nums; font-weight: 650; min-width: 44px; text-align: right; }
        .msg { color: var(--muted); font-size: 11px; }
        .err { color: #c62828; font-size: 12px; margin-top: 6px; }
        .foot { display: flex; justify-content: space-between; gap: 6px; flex-wrap: wrap; font-size: 11px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 10px; margin-top: 12px; }
      </style>
      <div class="card" part="card">
        <div class="head">
          <h2 class="title">${escapeHtml(c.name)}</h2>
          <span class="badge" aria-label="Kartenversion">v${CARD_VERSION}</span>
        </div>
        <div class="stage">
          <div class="studio">${shape}</div>
          <div>
            <div class="state" id="state">-</div>
            <div class="sub" id="sub"></div>
            <div class="values">
              <div class="val"><div class="k">Ladestrom</div><div class="v" id="vA">-</div></div>
              <div class="val"><div class="k">Leistung</div><div class="v" id="vW">-</div></div>
              <div class="val"><div class="k">Energie seit Anstecken</div><div class="v" id="vS">-</div></div>
              <div class="val"><div class="k">Gesamtenergie</div><div class="v" id="vT">-</div></div>
            </div>
            <div class="chip" id="chip"><span class="dot"></span><span id="chipText">Kein Chip aktiv</span></div>
            <div class="err" id="errMsg"></div>
          </div>
        </div>
        <div class="controls">
          <div class="row" id="modeRow" hidden>
            <h3>Lademodus</h3>
            <div class="seg" id="modes" role="group" aria-label="Lademodus"></div>
          </div>
          <div class="row">
            <h3>Ladestrom</h3>
            <div class="slider">
              <span class="msg">6 A</span>
              <input type="range" id="amp" min="6" max="${Number(c.max_current)}" step="1" aria-label="Ladestrom in Ampere">
              <output id="ampOut" for="amp">-</output>
            </div>
          </div>
          <div class="msg" id="discoverMsg"></div>
        </div>
        <div class="foot">
          <span>Fronius Wattpilot by Lutarym</span>
          <span>${CARD_TAG} v${CARD_VERSION}</span>
        </div>
      </div>`;

    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = {
      state: $('state'), sub: $('sub'), vA: $('vA'), vW: $('vW'), vS: $('vS'), vT: $('vT'),
      chip: $('chip'), chipText: $('chipText'), errMsg: $('errMsg'),
      amp: $('amp'), ampOut: $('ampOut'), modeRow: $('modeRow'), modes: $('modes'),
      discoverMsg: $('discoverMsg'), disp: $('disp'),
    };

    this._els.amp.addEventListener('input', () => {
      this._pendingAmp = Number(this._els.amp.value);
      this._els.ampOut.textContent = this._els.amp.value + ' A';
    });
    this._els.amp.addEventListener('change', () => {
      const value = Number(this._els.amp.value);
      this._pendingAmp = null;
      const id = this._ent(KEYS.amp);
      if (id) this._hass?.callService('number', 'set_value', { entity_id: id, value });
    });

    this._ledEls = Array.from(this.shadowRoot.getElementById('led')?.children || []);
    this._built = true;
  }

  _homeShape() {
    const dots = [];
    for (let i = 0; i < 16; i++) {
      const deg = -40 + i * (200 / 15);
      const rad = (deg - 90) * Math.PI / 180;
      dots.push(`<circle cx="${(118 + 58 * Math.cos(rad)).toFixed(2)}" cy="${(200 + 58 * Math.sin(rad)).toFixed(2)}" r="2.4" fill="#2a2f37"/>`);
    }
    return `<svg viewBox="0 0 200 330" role="img" aria-label="Wallbox">
      <defs>
        <linearGradient id="hBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eef0f3"/><stop offset="1" stop-color="#d8dce2"/></linearGradient>
        <radialGradient id="hSock" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#2b2f36"/><stop offset="1" stop-color="#050608"/></radialGradient>
        <filter id="hGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="322" rx="72" ry="5" fill="#000" opacity=".25"/>
      <rect x="8" y="10" width="184" height="306" rx="92" fill="url(#hBody)"/>
      <rect x="8.5" y="10.5" width="183" height="305" rx="91.5" fill="none" stroke="#000" stroke-opacity=".12"/>
      <rect x="92" y="0" width="16" height="20" rx="4" fill="#1b1e24"/>
      <ellipse cx="100" cy="66" rx="34" ry="8" fill="none" stroke="#d6322c" stroke-width="3.2"/>
      <text x="100" y="71" text-anchor="middle" font-size="14" font-style="italic" font-weight="700" fill="#d6322c" font-family="system-ui, sans-serif">Fronius</text>
      <g id="led" filter="url(#hGlow)">${dots.join('')}</g>
      <circle cx="118" cy="200" r="46" fill="url(#hSock)"/>
      <circle cx="118" cy="200" r="46" fill="none" stroke="#000" stroke-opacity=".4"/>
      <rect x="98" y="183" width="40" height="8" rx="3" fill="#15181d"/>
      <text x="128" y="262" font-size="12" font-weight="700" fill="#2a2f37" font-family="system-ui, sans-serif">Wattpilot</text>
    </svg>`;
  }

  _flexShape(dark) {
    const body = dark ? ['#4a4f57', '#3a3e46', '#25282e'] : ['#e8eaed', '#d9dce1', '#c3c8d0'];
    const face = dark ? ['#3c4149', '#2a2e35'] : ['#f1f2f4', '#dfe2e7'];
    const txt = dark ? '#e9edf3' : '#2a2f37';
    const sub = dark ? '#9aa2ad' : '#6b7280';
    const segs = [];
    for (let i = 0; i < 48; i++) {
      const a0 = i * 7.5 + 0.8, a1 = (i + 1) * 7.5 - 0.8;
      const p = (a) => { const r = (a - 90) * Math.PI / 180; return [100 + 80 * Math.cos(r), 170 + 80 * Math.sin(r)]; };
      const p0 = p(a0), p1 = p(a1);
      segs.push(`<path d="M${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A80 80 0 0 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}" fill="none" stroke-width="5" stroke-linecap="round" stroke="${dark ? '#2e333b' : '#c3c8d0'}"/>`);
    }
    return `<svg viewBox="0 0 200 330" role="img" aria-label="Wallbox">
      <defs>
        <linearGradient id="fBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${body[0]}"/><stop offset=".55" stop-color="${body[1]}"/><stop offset="1" stop-color="${body[2]}"/></linearGradient>
        <radialGradient id="fFace" cx=".5" cy=".3" r=".75"><stop offset="0" stop-color="${face[0]}"/><stop offset="1" stop-color="${face[1]}"/></radialGradient>
        <filter id="fGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="322" rx="74" ry="5" fill="#000" opacity=".25"/>
      <rect x="10" y="8" width="180" height="310" rx="30" fill="url(#fBody)"/>
      <rect x="10" y="8" width="180" height="310" rx="30" fill="none" stroke="#000" stroke-opacity=".15"/>
      <ellipse cx="100" cy="30" rx="40" ry="8" fill="none" stroke="${dark ? '#e9edf3' : '#ffffff'}" stroke-opacity=".8" stroke-width="1.6"/>
      <text x="100" y="35" text-anchor="middle" font-size="13" font-style="italic" font-weight="700" fill="${dark ? '#e9edf3' : '#ffffff'}" font-family="system-ui, sans-serif">Fronius</text>
      <circle cx="100" cy="170" r="84" fill="${dark ? '#1b1f25' : '#cfd3d9'}" opacity=".9"/>
      <circle cx="100" cy="170" r="80" fill="url(#fFace)"/>
      <g id="led" filter="url(#fGlow)">${segs.join('')}</g>
      <g transform="translate(72 160)"><circle r="11" fill="none" stroke="${sub}" stroke-width="1.2"/><path d="M1 -5 L-3 1 H0 L-1 5 L3 -1 H0 Z" fill="${txt}"/></g>
      <g transform="translate(100 160)"><circle r="11" fill="none" stroke="${sub}" stroke-width="1.2"/><path d="M-4 3 C-5 -2 -1 -5 4 -5 C4 0 1 4 -4 3 Z M-4 3 L1 -1" fill="none" stroke="${txt}" stroke-width="1.1" stroke-linejoin="round"/></g>
      <g transform="translate(128 160)"><circle r="11" fill="none" stroke="${sub}" stroke-width="1.2"/><circle r="4.5" fill="none" stroke="${txt}" stroke-width="1.1"/><path d="M0 -2.5 V0 L2 1.2" fill="none" stroke="${txt}" stroke-width="1.1" stroke-linecap="round"/></g>
      <text x="62" y="200" font-size="7" fill="${sub}" font-family="system-ui, sans-serif">Session kWh</text>
      <text x="62" y="210" font-size="7" fill="${sub}" font-family="system-ui, sans-serif">Total kWh</text>
      <text x="62" y="220" font-size="7" fill="${sub}" font-family="system-ui, sans-serif">Power kW</text>
      <text id="disp" x="134" y="210" text-anchor="middle" font-size="22" font-weight="700" fill="${txt}" font-family="ui-monospace, Menlo, Consolas, monospace">-</text>
    </svg>`;
  }

  // ---------- Anzeige aktualisieren ----------

  _update() {
    if (!this._config || !this._hass || !this._built) return;
    const r = this._read();
    this._readings = r;
    const els = this._els;
    const lang = this._hass.language || 'de';
    const fmt = (v, d) => (v === null || v === undefined) ? '-' : v.toLocaleString(lang, { minimumFractionDigits: d, maximumFractionDigits: d });

    // Status: Fehler hat Vorrang, sonst der Fahrzeugstatus
    let stateText;
    if (r.hasError) stateText = 'Fehler';
    else if (r.car) stateText = CAR_LABEL[r.car] || r.car;
    else stateText = '-';
    els.state.textContent = stateText;

    // Begründung des Geräts (Klartext aus der Integration), wenn bekannt
    const reason = r.statusKey ? (MODEL_STATUS_LABEL[r.statusKey] || r.statusKey) : '';
    els.sub.textContent = reason;

    els.vA.innerHTML = (r.charging && r.amp !== null) ? `${fmt(r.amp, 0)}<small>A</small>` : '-';
    els.vW.innerHTML = r.powerKw !== null ? `${fmt(r.powerKw, 2)}<small>kW</small>` : '-';
    els.vS.innerHTML = r.session !== null ? `${fmt(r.session, 1)}<small>kWh</small>` : '-';
    els.vT.innerHTML = r.total !== null ? `${fmt(r.total, 1)}<small>kWh</small>` : '-';
    if (els.disp) els.disp.textContent = r.powerKw !== null ? fmt(r.powerKw, 1) : '-';

    // Chip: aktive Karte aus trx
    if (r.activeCard) {
      const e = r.activeCard.energy;
      const eTxt = typeof e === 'number' ? ` (${fmt(e / 1000, 2)} kWh)` : '';
      els.chip.classList.add('active');
      els.chipText.innerHTML = `Chip: <b>${escapeHtml(r.activeCard.name || 'ohne Namen')}</b>${eTxt}`;
    } else {
      els.chip.classList.remove('active');
      els.chipText.textContent = r.cardCount ? `Kein Chip aktiv (${r.cardCount} registriert)` : 'Kein Chip aktiv';
    }

    els.errMsg.textContent = r.hasError ? 'Fehler: ' + (ERR_LABEL[r.errKey] || r.errKey || '') : '';

    // Ladestrom-Regler
    const cur = r.amp ?? Number(this._config.max_current);
    if (this._pendingAmp === null) {
      els.amp.max = r.maxA;
      els.amp.value = Math.min(cur, r.maxA);
      els.ampOut.textContent = Math.round(cur) + ' A';
    }
    els.amp.disabled = !r.connected || !this._ent(KEYS.amp);

    // Lademodus: Optionen aus der Entität, Beschriftung auf Deutsch
    if (this._ent(KEYS.mode) && r.modeOptions.length) {
      els.modeRow.hidden = false;
      const sig = r.modeOptions.join('|');
      if (els.modes.dataset.opts !== sig) {
        els.modes.dataset.opts = sig;
        els.modes.innerHTML = '';
        r.modeOptions.forEach((opt) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = LMO_LABEL[opt] || opt;
          b.dataset.opt = opt;
          b.addEventListener('click', () => {
            this._hass.callService('select', 'select_option', { entity_id: this._ent(KEYS.mode), option: opt });
          });
          els.modes.appendChild(b);
        });
      }
      els.modes.querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-pressed', b.dataset.opt === r.mode ? 'true' : 'false');
      });
    } else {
      els.modeRow.hidden = true;
    }

    els.discoverMsg.textContent = this._discoverMsg || '';
  }

  // ---------- LED-Animation ----------

  _loop(now) {
    this._raf = requestAnimationFrame(this._loop);
    if (!this._ledEls.length || !this._readings) return;
    this._paint(now);
  }

  _paint(now) {
    const r = this._readings;
    const n = this._ledEls.length;
    const isHome = this._config.model === 'home';
    const dark = isHome ? '#2a2f37' : '#2e333b';
    const lit = r.connected ? Math.round(n * (r.amp ?? 0) / Math.max(1, r.maxA)) : 0;

    let kind = 'idle';
    if (now - this._startAt < RAINBOW_MS) kind = 'rainbow';
    else if (r.hasError) kind = 'flash';
    else if (r.complete) kind = 'done';
    else if (r.charging) kind = 'chase';
    else if (r.connected) kind = 'ready';

    // Farbe beim Laden: PV-Überschuss erkennt die Karte am Gerätestatus, sonst die Einstellung
    const pvCharging = r.statusKey === 'chargingbecausepvsurplus';
    const chargeColor = pvCharging ? COLORS.yellow : (LED_SOURCE_COLOR[this._config.led_source] || COLORS.yellow);
    const flashOn = Math.floor(now / FLASH_MS) % 2 === 0;
    const runPos = (now / 1000 * CHASE_PER_SEC) % n;

    this._ledEls.forEach((e, i) => {
      let c;
      if (kind === 'rainbow') {
        c = `hsl(${Math.round(((i / n) * 360 + now / 8) % 360)}, 90%, 58%)`;
      } else if (kind === 'flash') {
        const top = isHome ? true : (i < 4 || i >= n - 4);
        c = top && flashOn ? COLORS.red : dark;
      } else if (kind === 'done') {
        c = COLORS.green;
      } else if (kind === 'chase') {
        if (i < lit) c = chargeColor;
        else {
          let d = Math.abs(i - runPos); d = Math.min(d, n - d);
          c = d < 1.6 ? '#7d8592' : dark;
        }
      } else if (kind === 'ready') {
        c = i < lit ? COLORS.blue : dark;
      } else {
        c = dark;
      }
      if (isHome) e.setAttribute('fill', c);
      else e.setAttribute('stroke', c);
    });
  }
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, FroniusWattpilotCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: 'Fronius-Card-by-Lutarym',
    description: 'Wallbox-Karte für den Fronius Wattpilot mit LED-Ring, Status, Chip-Anzeige und Steuerung (Integration: Fronius Wattpilot by Lutarym).',
    preview: false,
  });
}

console.info(
  '%c FRONIUS-WATTPILOT-CARD %c v' + CARD_VERSION + ' ',
  'color: #fff; background: #0a6c86; font-weight: 700;',
  'color: #0a6c86; background: #e6f4f8; font-weight: 700;'
);
