/*
 * Fronius-Card-by-Lutarym
 * Lovelace-Karte für den Fronius Wattpilot (Integration: fronius_wattpilot_lutarym)
 * Version: 0.4.0
 * Lizenz: MIT
 */
const CARD_VERSION = '0.4.0';
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
const LED_SOURCE_COLOR = { pv: COLORS.yellow, battery: COLORS.green, grid: COLORS.white };
const LED_SOURCE_OPTIONS = [
  { value: 'pv', label: 'Gelb (PV-Überschuss)' },
  { value: 'battery', label: 'Grün (Hausspeicher)' },
  { value: 'grid', label: 'Weiß (Netz)' },
];

// Zeitwerte der Animation. Im Handbuch nicht angegeben, daher Annahmen.
const RAINBOW_MS = 3000;
const FLASH_MS = 500;
const CHASE_PER_SEC = 6;

// Schlüssel der Integration, die die Karte braucht
const KEYS = {
  amp: 'amp',
  power: 'nrg_ptotal',
  car: 'car',
  session: 'wh',
  total: 'eto',
  error: 'err',
  mode: 'lmo',
  modelStatus: 'modelStatus',
  trx: 'trx',
  cards: 'cards',
};

// Namen der optionalen manuellen Entitäten in der Konfiguration
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

const ENTITY_FIELDS = [
  'charging_current', 'power', 'car', 'model_status', 'session_energy', 'total_energy',
  'error', 'mode', 'active_card', 'cards',
];

const FIELD_LABEL = {
  name: 'Name',
  model: 'Modell',
  max_current: 'Höchstwert Ladestrom (A)',
  led_source: 'LED-Farbe beim Laden ohne PV-Überschuss',
  serial: 'Seriennummer (nur bei mehreren Wattpilot)',
  show_status: 'Status anzeigen',
  show_values: 'Werte anzeigen',
  show_chip: 'RFID-Chip anzeigen',
  show_controls: 'Regler anzeigen',
  charging_current: 'Ladestrom (Entität)',
  power: 'Ladeleistung (Entität)',
  car: 'Fahrzeugstatus (Entität)',
  model_status: 'Grund des Geräts (Entität)',
  session_energy: 'Energie seit Anstecken (Entität)',
  total_energy: 'Gesamtenergie (Entität)',
  error: 'Fehlerstatus (Entität)',
  mode: 'Lademodus (Entität)',
  active_card: 'Aktive Transaktion (Entität)',
  cards: 'Registrierte RFID-Karten (Entität)',
};

function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

class FroniusCardByLutarym extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = null;
    this._hass = null;
    this._built = false;
    this._raf = null;
    this._ledEls = [];
    this._offColor = '#2e333b';
    this._startAt = performance.now();
    this._loop = this._loop.bind(this);
    this._pendingAmp = null;
    this._entityMap = null;
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
      show_status: false,
      show_values: false,
      show_chip: false,
      show_controls: false,
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
    const c = this._config || {};
    let n = 4;
    if (c.show_status) n += 1;
    if (c.show_values) n += 2;
    if (c.show_chip) n += 1;
    if (c.show_controls) n += 2;
    return n;
  }

  static getStubConfig() {
    return { name: 'Wattpilot', model: 'flex-home', max_current: 16, led_source: 'pv' };
  }

  // Visueller Editor in Home Assistant
  static getConfigForm() {
    const entityFields = ENTITY_FIELDS.map((name) => ({ name, selector: { entity: {} } }));
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        {
          name: 'model',
          required: true,
          selector: { select: { options: Object.entries(MODELS).map(([value, label]) => ({ value, label })) } },
        },
        { name: 'max_current', selector: { number: { min: 6, max: 32, step: 1, mode: 'box' } } },
        { name: 'led_source', selector: { select: { options: LED_SOURCE_OPTIONS } } },
        { name: 'serial', selector: { text: {} } },
        {
          type: 'expandable',
          title: 'Zusatzinformationen anzeigen',
          name: '',
          flatten: true,
          schema: [
            { name: 'show_status', selector: { boolean: {} } },
            { name: 'show_values', selector: { boolean: {} } },
            { name: 'show_chip', selector: { boolean: {} } },
            { name: 'show_controls', selector: { boolean: {} } },
          ],
        },
        {
          type: 'expandable',
          title: 'Entitäten manuell angeben (optional)',
          name: '',
          flatten: true,
          schema: entityFields,
        },
      ],
      computeLabel: (field) => FIELD_LABEL[field.name],
      computeHelper: (field) => (field.name === 'name' ? 'Fronius-Card-by-Lutarym v' + CARD_VERSION : undefined),
      assertConfig: (config) => {
        if (config.model && !MODELS[config.model]) throw new Error('Unbekanntes Modell');
      },
    };
  }

  connectedCallback() {
    if (this._raf === null) this._raf = requestAnimationFrame(this._loop);
  }

  disconnectedCallback() {
    if (this._raf !== null) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  // ---------- Entitäten finden ----------

  // Liest die Entitäts-Registry. Die eindeutige Kennung hat die Form "<Seriennummer>_<Schlüssel>".
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
      this._discoverMsg = 'Entitäten konnten nicht automatisch gefunden werden (' + (e?.message || e) + '). Bitte die IDs im Editor unter "Entitäten manuell angeben" eintragen.';
    } finally {
      this._discovered = true;
      this._discovering = false;
      this._update();
    }
  }

  // Kurzer Hinweis in der Karte, vergeht nach 8 Sekunden
  _setNotice(text) {
    this._notice = text;
    clearTimeout(this._noticeTimer);
    this._noticeTimer = setTimeout(() => { this._notice = ''; this._update(); }, 8000);
    this._update();
  }

  // Manuelle Entität hat Vorrang, sonst die automatisch gefundene
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
      powerKw = powerS.attributes?.unit_of_measurement === 'W' ? powerKw / 1000 : powerKw;
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
    this._offColor = { 'home': '#c9ced6', 'flex-home': '#d3d8df', 'flex-pro': '#353a42' }[c.model];
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        [hidden] { display: none !important; }
        .card {
          --sub: #5d6676; --line: #d8dee7; --well: #eef2f6; --accent: #0a6c86; --accent-ink: #ffffff;
          background: var(--ha-card-background, var(--card-background-color, #ffffff));
          color: var(--primary-text-color, #161b26);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, none);
          padding: 16px; box-sizing: border-box;
          font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
        }
        @media (prefers-color-scheme: dark) {
          .card:not([data-theme="light"]) { --sub: #97a2b1; --line: #262e39; --well: #1d242d; --accent: #5fd0e8; --accent-ink: #061115; }
        }
        .device { max-width: 240px; margin: 0 auto; }
        svg { width: 100%; height: auto; display: block; overflow: visible; }
        .panel { margin-top: 12px; display: grid; gap: 10px; }
        .state { font-size: 16px; font-weight: 650; }
        .sub { color: var(--sub); font-size: 12px; margin-top: 2px; }
        .err { color: #c62828; font-size: 12px; margin-top: 4px; }
        .values { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .val { background: var(--well); border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; min-width: 0; }
        .val .k { font-size: 10px; color: var(--sub); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
        .val .v { font-size: 18px; font-weight: 650; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
        .val .v small { font-size: 11px; font-weight: 500; color: var(--sub); margin-left: 2px; }
        .chip { display: flex; align-items: center; gap: 8px; font-size: 12px; background: var(--well); border: 1px solid var(--line); border-radius: 10px; padding: 7px 10px; }
        .chip .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sub); flex: none; }
        .chip.active .dot { background: var(--accent); }
        .chip b { font-weight: 650; }
        .controls { display: grid; gap: 10px; }
        .row { display: grid; gap: 6px; }
        .row h3 { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--sub); margin: 0; font-weight: 650; }
        .seg { display: flex; flex-wrap: wrap; gap: 6px; }
        button { font: inherit; font-size: 12px; color: var(--primary-text-color, #161b26); background: var(--well); border: 1px solid var(--line); border-radius: 9px; padding: 6px 10px; cursor: pointer; min-height: 34px; }
        button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        button[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
        button:disabled { opacity: .5; cursor: default; }
        .slider { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: center; font-size: 12px; }
        input[type="range"] { width: 100%; accent-color: var(--accent); min-width: 0; }
        output { font-variant-numeric: tabular-nums; font-weight: 650; min-width: 44px; text-align: right; }
        .msg { color: var(--sub); font-size: 11px; }
        .mode-btn { cursor: pointer; }
        .mode-btn.off { cursor: default; opacity: .5; }
        .mode-btn:focus { outline: none; }
        .mode-btn:focus-visible .ring { stroke: #4d9bff; }
        .mode-btn.active .ring { stroke: #4d9bff; stroke-width: 1.6; }
      </style>
      <div class="card" part="card">
        <div class="device">${shape}</div>
        <div class="panel">
          <div id="statusBox" hidden>
            <div class="state" id="state">-</div>
            <div class="sub" id="sub"></div>
            <div class="err" id="errMsg"></div>
          </div>
          <div class="values" id="valuesBox" hidden>
            <div class="val"><div class="k">Ladestrom</div><div class="v" id="vA">-</div></div>
            <div class="val"><div class="k">Leistung</div><div class="v" id="vW">-</div></div>
            <div class="val"><div class="k">Energie seit Anstecken</div><div class="v" id="vS">-</div></div>
            <div class="val"><div class="k">Gesamtenergie</div><div class="v" id="vT">-</div></div>
          </div>
          <div class="chip" id="chipBox" hidden><span class="dot"></span><span id="chipText">Kein Chip aktiv</span></div>
          <div class="controls" id="controlsBox" hidden>
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
          </div>
          <div class="msg" id="discoverMsg"></div>
        </div>
      </div>`;

    const $ = (id) => this.shadowRoot.getElementById(id);
    this._els = {
      statusBox: $('statusBox'), state: $('state'), sub: $('sub'), errMsg: $('errMsg'),
      valuesBox: $('valuesBox'), vA: $('vA'), vW: $('vW'), vS: $('vS'), vT: $('vT'),
      chipBox: $('chipBox'), chipText: $('chipText'),
      controlsBox: $('controlsBox'), amp: $('amp'), ampOut: $('ampOut'),
      modeRow: $('modeRow'), modes: $('modes'), discoverMsg: $('discoverMsg'), disp: $('disp'),
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
    this._modeBtns = Array.from(this.shadowRoot.querySelectorAll('.mode-btn'));
    const press = (btn) => {
      const id = this._ent(KEYS.mode);
      if (!this._hass) return;
      if (!id) {
        const msg = 'Lademodus-Entität nicht gefunden. Im Editor unter "Entitäten manuell angeben" den Lademodus eintragen.';
        console.warn('[Fronius-Card-by-Lutarym] ' + msg);
        this._setNotice(msg);
        return;
      }
      Promise.resolve(this._hass.callService('select', 'select_option', { entity_id: id, option: btn.dataset.opt }))
        .catch((e) => this._setNotice('Umschalten fehlgeschlagen: ' + (e?.message || e)));
    };
    this._modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => press(btn));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(btn); }
      });
    });
    this._built = true;
  }

  // Wattpilot Go / Home: weißes Gehäuse, Ring als Bogen rechts am Stecker
  _homeShape() {
    const n = 10, cx = 98, cy = 238, rr = 72;
    const dots = [];
    for (let i = 0; i < n; i++) {
      const rad = (i / (n - 1)) * 85 * Math.PI / 180;
      const x = cx + rr * Math.sin(rad), y = cy - rr * Math.cos(rad);
      dots.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.4"/>`);
    }
    return `<svg viewBox="-4 -28 208 366" role="img" aria-label="Fronius Wattpilot Go / Home">
      <defs>
        <linearGradient id="hBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eef0f3"/><stop offset="1" stop-color="#d8dce2"/></linearGradient>
        <radialGradient id="hSock" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#2b2f36"/><stop offset="1" stop-color="#050608"/></radialGradient>
        <radialGradient id="hBtn" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#666c76"/><stop offset="1" stop-color="#2f343b"/></radialGradient>
        <filter id="hGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="334" rx="70" ry="4" fill="#000" opacity=".25"/>
      <rect x="80" y="-24" width="40" height="28" rx="6" fill="#1b1e24"/>
      <rect x="0" y="0" width="200" height="330" rx="80" fill="url(#hBody)"/>
      <rect x=".5" y=".5" width="199" height="329" rx="79.5" fill="none" stroke="#000" stroke-opacity=".12"/>
      <ellipse cx="100" cy="60" rx="42" ry="11" fill="#d7262e"/>
      <text x="100" y="64.5" text-anchor="middle" font-size="12" font-style="italic" font-weight="700" fill="#ffffff" font-family="system-ui, sans-serif">Fronius</text>
      <g transform="translate(100 102)" fill="none" stroke="#3a3f47" stroke-width="1.6" stroke-linecap="round"><circle r="2"/><path d="M-6 -4 Q-8 0 -6 4"/><path d="M6 -4 Q8 0 6 4"/><path d="M-10 -8 Q-14 0 -10 8"/><path d="M10 -8 Q14 0 10 8"/></g>
      <circle cx="31" cy="165" r="16" fill="url(#hBtn)"/>
      <g class="mode-btn" data-opt="eco" role="button" tabindex="0" aria-label="Eco" transform="translate(98 156)"><circle r="9" fill="transparent"/><path d="M-4 3 C-5 -2 -1 -5 4 -5 C4 0 1 4 -4 3 Z M-4 3 L1 -1" fill="none" stroke="#3a3f47" stroke-width="1.1"/><circle class="ind" cy="-10" r="1.6" fill="#ffffff" stroke="#3a3f47" stroke-width=".4" opacity="0"/></g>
      <g class="mode-btn" data-opt="nexttrip" role="button" tabindex="0" aria-label="Next Trip" transform="translate(114 156)"><circle r="9" fill="transparent"/><circle r="4.5" fill="none" stroke="#3a3f47" stroke-width="1.1"/><path d="M0 -2.5 V0 L2 1.2" fill="none" stroke="#3a3f47" stroke-width="1.1"/><circle class="ind" cy="-10" r="1.6" fill="#ffffff" stroke="#3a3f47" stroke-width=".4" opacity="0"/></g>
      <text x="133" y="160" font-size="12" font-weight="700" fill="#2a2f37" font-family="system-ui, sans-serif">Wattpilot</text>
      <circle cx="98" cy="238" r="68" fill="#15181d"/>
      <circle cx="98" cy="238" r="58" fill="url(#hSock)"/>
      <rect x="84" y="176" width="28" height="7" rx="3" fill="#0b0d10"/>
      <g id="led" filter="url(#hGlow)" fill="#c9ced6">${dots.join('')}</g>
    </svg>`;
  }

  // Wattpilot Flex Home und Flex Pro: Ring mit Segmenten, drei Symbole, Anzeige
  _flexShape(dark) {
    const P = dark
      ? { body: ['#4a4f57', '#3a3e46', '#2a2d33'], face: ['#3c4149', '#2a2e35'], ring: '#353a42', txt: '#e9edf3', sub: '#9aa2ad', logo: '#c9ced6' }
      : { body: ['#eceef2', '#dfe2e7', '#cdd2d9'], face: ['#f5f6f8', '#e4e7ec'], ring: '#d3d8df', txt: '#2a2f37', sub: '#6b7280', logo: '#8a909a' };
    const n = 48;
    const pt = (a, r) => { const t = (a - 90) * Math.PI / 180; return [100 + r * Math.cos(t), 206 + r * Math.sin(t)]; };
    const segs = [];
    for (let i = 0; i < n; i++) {
      const p0 = pt(i * 7.5 + 0.9, 70), p1 = pt((i + 1) * 7.5 - 0.9, 70);
      segs.push(`<path d="M${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A70 70 0 0 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}" fill="none" stroke="${P.ring}" stroke-width="6" stroke-linecap="round"/>`);
    }
    return `<svg viewBox="-4 -4 208 338" role="img" aria-label="Fronius Wattpilot ${dark ? 'Flex Pro' : 'Flex Home'}">
      <defs>
        <linearGradient id="fBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.body[0]}"/><stop offset=".55" stop-color="${P.body[1]}"/><stop offset="1" stop-color="${P.body[2]}"/></linearGradient>
        <radialGradient id="fFace" cx=".5" cy=".3" r=".75"><stop offset="0" stop-color="${P.face[0]}"/><stop offset="1" stop-color="${P.face[1]}"/></radialGradient>
        <filter id="fGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="100" cy="334" rx="74" ry="4" fill="#000" opacity=".25"/>
      <rect x="0" y="0" width="200" height="330" rx="22" fill="url(#fBody)"/>
      <rect x=".5" y=".5" width="199" height="329" rx="21.5" fill="none" stroke="#000" stroke-opacity=".15"/>
      <ellipse cx="100" cy="60" rx="36" ry="9" fill="none" stroke="${P.logo}" stroke-width="1.4"/>
      <text x="100" y="63.5" text-anchor="middle" font-size="11" font-style="italic" font-weight="700" fill="${P.logo}" font-family="system-ui, sans-serif">Fronius</text>
      <circle cx="100" cy="206" r="62" fill="url(#fFace)"/>
      <g id="led" filter="url(#fGlow)">${segs.join('')}</g>
      <g transform="translate(100 176) scale(.9)" fill="none" stroke="${P.txt}" stroke-width="1.6" stroke-linecap="round"><circle r="2"/><path d="M-6 -4 Q-8 0 -6 4"/><path d="M6 -4 Q8 0 6 4"/><path d="M-10 -8 Q-14 0 -10 8"/><path d="M10 -8 Q14 0 10 8"/></g>
      <g class="mode-btn" data-opt="standard" role="button" tabindex="0" aria-label="Standard" transform="translate(78 210)"><circle r="11" fill="transparent"/><circle class="ring" r="8" fill="none" stroke="${P.sub}" stroke-width="1"/><path d="M1 -5 L-3 1 H0 L-1 5 L3 -1 H0 Z" fill="${P.txt}"/><circle class="ind" cy="-14" r="1.8" fill="#ffffff" stroke="#3a3f47" stroke-width=".4" opacity="0"/></g>
      <g class="mode-btn" data-opt="eco" role="button" tabindex="0" aria-label="Eco" transform="translate(100 210)"><circle r="11" fill="transparent"/><circle class="ring" r="8" fill="none" stroke="${P.sub}" stroke-width="1"/><path d="M-4 3 C-5 -2 -1 -5 4 -5 C4 0 1 4 -4 3 Z M-4 3 L1 -1" fill="none" stroke="${P.txt}" stroke-width="1.1" stroke-linejoin="round"/><circle class="ind" cy="-14" r="1.8" fill="#ffffff" stroke="#3a3f47" stroke-width=".4" opacity="0"/></g>
      <g class="mode-btn" data-opt="nexttrip" role="button" tabindex="0" aria-label="Next Trip" transform="translate(122 210)"><circle r="11" fill="transparent"/><circle class="ring" r="8" fill="none" stroke="${P.sub}" stroke-width="1"/><circle r="4" fill="none" stroke="${P.txt}" stroke-width="1"/><path d="M0 -2.5 V0 L2 1.2" fill="none" stroke="${P.txt}" stroke-width="1" stroke-linecap="round"/><circle class="ind" cy="-14" r="1.8" fill="#ffffff" stroke="#3a3f47" stroke-width=".4" opacity="0"/></g>
      <text id="disp" x="121" y="243" text-anchor="middle" font-size="16" font-weight="700" fill="${P.txt}" font-family="ui-monospace, Menlo, Consolas, monospace">-</text>
      <text x="94" y="252" font-size="5" fill="${P.sub}" font-family="system-ui, sans-serif">Session kWh</text>
      <text x="94" y="257" font-size="5" fill="${P.sub}" font-family="system-ui, sans-serif">Total kWh</text>
      <text x="94" y="262" font-size="5" fill="${P.sub}" font-family="system-ui, sans-serif">Power kW</text>
    </svg>`;
  }

  // ---------- Anzeige aktualisieren ----------

  _update() {
    if (!this._config || !this._hass || !this._built) return;
    const c = this._config;
    const r = this._read();
    this._readings = r;
    const els = this._els;
    const lang = this._hass.language || 'de';
    const fmt = (v, d) => (v === null || v === undefined) ? '-' : v.toLocaleString(lang, { minimumFractionDigits: d, maximumFractionDigits: d });

    els.statusBox.hidden = !c.show_status;
    els.valuesBox.hidden = !c.show_values;
    els.chipBox.hidden = !c.show_chip;
    els.controlsBox.hidden = !c.show_controls;

    // Status: Fehler hat Vorrang, sonst der Fahrzeugstatus
    if (r.hasError) els.state.textContent = 'Fehler';
    else els.state.textContent = r.car ? (CAR_LABEL[r.car] || r.car) : '-';
    els.sub.textContent = r.statusKey ? (MODEL_STATUS_LABEL[r.statusKey] || r.statusKey) : '';
    els.errMsg.textContent = r.hasError ? 'Fehler: ' + (ERR_LABEL[r.errKey] || r.errKey || '') : '';

    els.vA.innerHTML = (r.charging && r.amp !== null) ? `${fmt(r.amp, 0)}<small>A</small>` : '-';
    els.vW.innerHTML = r.powerKw !== null ? `${fmt(r.powerKw, 2)}<small>kW</small>` : '-';
    els.vS.innerHTML = r.session !== null ? `${fmt(r.session, 1)}<small>kWh</small>` : '-';
    els.vT.innerHTML = r.total !== null ? `${fmt(r.total, 1)}<small>kWh</small>` : '-';
    if (els.disp) els.disp.textContent = r.powerKw !== null ? fmt(r.powerKw, 1) : '-';

    // Chip: aktive Karte aus trx
    if (r.activeCard) {
      const e = r.activeCard.energy;
      const eTxt = typeof e === 'number' ? ` (${fmt(e / 1000, 2)} kWh)` : '';
      els.chipBox.classList.add('active');
      els.chipText.innerHTML = `Chip: <b>${escapeHtml(r.activeCard.name || 'ohne Namen')}</b>${eTxt}`;
    } else {
      els.chipBox.classList.remove('active');
      els.chipText.textContent = r.cardCount ? `Kein Chip aktiv (${r.cardCount} registriert)` : 'Kein Chip aktiv';
    }

    // Ladestrom-Regler
    const cur = r.amp ?? Number(c.max_current);
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

    const hasMode = !!this._ent(KEYS.mode);
    (this._modeBtns || []).forEach((btn) => {
      const active = btn.dataset.opt === r.mode;
      btn.classList.toggle('active', active);
      btn.classList.toggle('off', !hasMode);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    els.discoverMsg.textContent = this._notice || this._discoverMsg || '';
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
    const off = this._offColor;
    const lit = r.connected ? Math.round(n * (r.amp ?? 0) / Math.max(1, r.maxA)) : 0;

    let kind = 'idle';
    if (now - this._startAt < RAINBOW_MS) kind = 'rainbow';
    else if (r.hasError) kind = 'flash';
    else if (r.complete) kind = 'done';
    else if (r.charging) kind = 'chase';
    else if (r.connected) kind = 'ready';

    // Laden mit PV-Überschuss erkennt die Karte am Gerätestatus, sonst zählt led_source
    const pvCharging = r.statusKey === 'chargingbecausepvsurplus';
    const chargeColor = pvCharging ? COLORS.yellow : (LED_SOURCE_COLOR[this._config.led_source] || COLORS.yellow);
    const flashOn = Math.floor(now / FLASH_MS) % 2 === 0;
    const runPos = (now / 1000 * CHASE_PER_SEC) % n;

    const modeBlinkOn = Math.floor(now / FLASH_MS) % 2 === 0;
    (this._modeBtns || []).forEach((btn) => {
      const ind = btn.querySelector('.ind');
      if (!ind) return;
      const active = btn.dataset.opt === r.mode;
      let op = 0;
      if (active) op = btn.dataset.opt === 'standard' ? 1 : (modeBlinkOn ? 1 : 0.15);
      ind.setAttribute('opacity', String(op));
    });

    this._ledEls.forEach((e, i) => {
      let c;
      if (kind === 'rainbow') {
        c = `hsl(${Math.round(((i / n) * 360 + now / 8) % 360)}, 90%, 58%)`;
      } else if (kind === 'flash') {
        const top = isHome ? true : (i < 4 || i >= n - 4);
        c = top && flashOn ? COLORS.red : off;
      } else if (kind === 'done') {
        c = COLORS.green;
      } else if (kind === 'chase') {
        if (i < lit) c = chargeColor;
        else {
          let d = Math.abs(i - runPos); d = Math.min(d, n - d);
          c = d < 1.6 ? '#7d8592' : off;
        }
      } else if (kind === 'ready') {
        c = i < lit ? COLORS.blue : off;
      } else {
        c = off;
      }
      if (isHome) e.setAttribute('fill', c);
      else e.setAttribute('stroke', c);
    });
  }
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, FroniusCardByLutarym);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: 'Fronius-Card-by-Lutarym',
    description: 'Wallbox-Grafik des Fronius Wattpilot mit animiertem LED-Ring. Zusatzinformationen sind im Editor zuschaltbar.',
    preview: false,
  });
}

console.info(
  '%c FRONIUS-CARD-BY-LUTARYM %c v' + CARD_VERSION + ' ',
  'color: #fff; background: #0a6c86; font-weight: 700;',
  'color: #0a6c86; background: #e6f4f8; font-weight: 700;'
);
