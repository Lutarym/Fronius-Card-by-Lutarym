# Fronius-Card-by-Lutarym

Lovelace-Karte für den Fronius Wattpilot. Sie zeigt das Gehäuse mit animiertem LED-Ring, Status, Werte, den aktiven RFID-Chip und die Steuerung für Ladestrom und Lademodus.

**Version: 0.2.0** (steht in der Karte oben rechts und unten rechts)

Die Karte braucht die Integration **Fronius Wattpilot by Lutarym** (`fronius_wattpilot_lutarym`). Die normale Fronius-Integration unterstützt den Wattpilot nicht.

Getestet ist der Code mit einem simulierten Home-Assistant-Objekt. Ein Test am echten Wattpilot steht noch aus.

## Funktionen

- Findet die Entitäten der Integration automatisch
- Gehäuse für drei Bauformen: Go / Home (weiß), Flex Home (hell), Flex Pro (anthrazit)
- LED-Ring mit Animation, siehe Abschnitt „LED-Verhalten“
- Status mit Begründung des Geräts, zum Beispiel „Laden mit PV-Überschuss“
- Anzeige von Ladestrom, Leistung, Energie seit Anstecken und Gesamtenergie
- Anzeige des aktiven RFID-Chips mit Name und Energie
- Ladestrom-Regler (schreibt auf das Gerät)
- Auswahl des Lademodus (schreibt auf das Gerät)
- Fehleranzeige

## Installation

### Über HACS

1. HACS öffnen, oben rechts die drei Punkte, dann **Benutzerdefinierte Repositories**.
2. Die Repository-URL eintragen, Kategorie **Dashboard**.
3. Die Karte in HACS installieren und den Browser neu laden.

### Manuell

1. Die Datei `dist/Fronius-Card-by-Lutarym.js` nach `/config/www/fronius-card-by-lutarym/` kopieren.
2. Unter **Einstellungen, Dashboards, Ressourcen** eine Ressource hinzufügen:
   - URL: `/local/fronius-card-by-lutarym/Fronius-Card-by-Lutarym.js`
   - Typ: JavaScript-Modul
3. Browser neu laden.

## Konfiguration

Minimal reicht dieses Beispiel. Die Karte sucht alle Entitäten der Integration selbst:

```yaml
type: custom:fronius-card-by-lutarym
name: Wattpilot
model: flex-home
max_current: 16
led_source: pv
```

### Optionen

| Option | Pflicht | Standard | Bedeutung |
|---|---|---|---|
| `name` | nein | Wattpilot | Titel der Karte |
| `model` | nein | flex-home | `home` (Go / Home), `flex-home` oder `flex-pro` |
| `max_current` | nein | 16 | Höchstwert für den Ladestrom-Regler in Ampere |
| `led_source` | nein | pv | Farbe des LED-Rings beim Laden ohne PV-Überschuss: `pv` (gelb), `battery` (grün), `grid` (weiß) |
| `serial` | nein | | Seriennummer, wenn mehrere Wattpilot eingerichtet sind |

Die Karte liest das Maximum des Ladestroms aus der Entität und begrenzt es auf `max_current`. Für einen Flex Home 11 C6 bleibt `max_current` daher bei 16.

### Entitäten manuell angeben (optional)

Wenn die automatische Erkennung nicht funktioniert, lassen sich Entitäten mit diesen Optionen eintragen. Eine manuell angegebene Entität hat Vorrang.

| Option | Entität der Integration |
|---|---|
| `charging_current` | Ladestrom (Zahl) |
| `power` | Ladeleistung (Sensor) |
| `car` | Fahrzeugstatus (Sensor) |
| `model_status` | Grund für Laden oder Nicht-Laden (Sensor) |
| `session_energy` | Energie seit Anstecken (Sensor) |
| `total_energy` | Gesamtenergie (Sensor) |
| `error` | Fehlerstatus (Sensor) |
| `mode` | Lademodus (Auswahl) |
| `active_card` | Aktive Transaktion (Zahl) |
| `cards` | Registrierte RFID-Karten (Sensor) |

Beispiel:

```yaml
type: custom:fronius-card-by-lutarym
name: Wattpilot
model: flex-pro
charging_current: number.wattpilot_charging_current
power: sensor.wattpilot_charging_power_total
car: sensor.wattpilot_car
mode: select.wattpilot_logic_mode
```

Die Entitäts-IDs in deiner Instanz findest du unter **Einstellungen, Geräte und Dienste, Entitäten**.

### Automatische Erkennung

Die Karte liest die Entitäts-Registry von Home Assistant. Sie erkennt die Entitäten der Integration an ihrer eindeutigen Kennung, die aus Seriennummer und Schlüssel besteht. Die Namen hängen nicht von der Sprache ab.

Wenn die Registry nicht gelesen werden kann, zeigt die Karte einen Hinweis. Dann trägst du die Entitäten manuell ein, wie oben beschrieben. Ob Nutzer ohne Administratorrechte die Registry lesen dürfen, habe ich nicht geprüft.

## LED-Verhalten

**Aus dem Handbuch von Fronius übernommen:**
- Beim Start leuchten die LEDs in Regenbogenfarben.
- Beim Laden laufen die nicht leuchtenden LEDs im Kreis.
- Bei einem Fehler blinken die LEDs rot. Beim Flex-Modell sind es die oberen LEDs, beim Home-Modell alle.

**Umsetzung in der Karte:**
- Laden mit PV-Überschuss: gelb. Sonst die Farbe aus `led_source`.
- Angesteckt, wartet: blau.
- Ladung abgeschlossen: alle LEDs grün.
- Die Anzahl leuchtender LEDs richtet sich nach dem Ladestrom.

**Annahmen, im Handbuch nicht angegeben:**
- Dauer des Regenbogens beim Start: 3 Sekunden
- Blinktakt bei Fehlern: 0,5 Sekunden
- Lauf im Kreis: 6 LEDs pro Sekunde

Diese Werte stehen im Code als Konstanten am Anfang der Datei und lassen sich dort ändern.

## Chip-Anzeige

Die Karte zeigt den Chip, dessen Nummer in der Entität „Aktive Transaktion“ steht. Wert 0 bedeutet kein Chip. Wert 1 entspricht dem ersten Eintrag der Kartenliste, 2 dem zweiten, und so weiter. Name und Energie kommen aus der Liste „Registrierte RFID-Karten“.

Ob die Entität auch dann einen Wert zeigt, wenn ein Chip nur vorgehalten wird und kein Ladevorgang läuft, habe ich nicht am Gerät geprüft. Das bitte in deiner Instanz testen.

## Bekannte Grenzen

- **Fehlertexte:** Die Karte nutzt die deutschen Texte der Integration. In anderen Sprachen bleiben die Texte der Integration auf Deutsch.
- **Mehrere Wattpilot:** Ohne `serial` nimmt die Karte den ersten gefundenen Wattpilot.
- **Farbe bei Netz oder Speicher:** Die Karte erkennt die Quelle nicht selbst. Die Farbe kommt aus `led_source`.
- **LED-Farben:** Die Farben stammen aus einer Zusammenfassung des Handbuchs. Eine zweite Quelle habe ich nicht gefunden.
- **Leistungseinheit:** Die Karte rechnet Watt in Kilowatt um, wenn die Entität die Einheit W angibt. Die README der Integration weist darauf hin, dass die Skalierung möglicherweise abweicht. Bitte mit der Wattpilot-App vergleichen.
- **Gehäuse:** Die Formen beruhen auf Fotos von Fronius und sind nicht vermessen. Die Form der mobilen Go-Modelle ist nicht geprüft, sie nutzt die Form der Home-Modelle.
- **Gerätetest:** Die Karte ist nicht am echten Wattpilot getestet.

## Hinweis zur Steuerung

Der Ladestrom-Regler und der Lademodus schreiben direkt auf das Gerät. Teste die Regler zuerst mit einem Ladevorgang, der nicht wichtig ist.

## Entitäten der Integration

| Zweck | Schlüssel in der Integration | Typ |
|---|---|---|
| Ladestrom | `amp` | Zahl |
| Leistung | `nrg_ptotal` | Sensor, W |
| Fahrzeugstatus | `car` | Sensor |
| Grund für Laden oder Nicht-Laden | `modelStatus` | Sensor |
| Energie seit Anstecken | `wh` | Sensor, Wh |
| Gesamtenergie | `eto` | Sensor, Wh |
| Fehler | `err` | Sensor |
| Lademodus | `lmo` | Auswahl |
| Aktive Transaktion (Chip-Nummer) | `trx` | Zahl |
| Registrierte RFID-Karten | `cards` | Sensor |

Die Zuordnung der Energie seit Anstecken zu `wh` habe ich aus den Namen der Integration abgeleitet. Bitte prüfe das in deiner Instanz.

## Changelog

Siehe `CHANGELOG.md`.

## Lizenz

MIT, siehe `LICENSE`.
