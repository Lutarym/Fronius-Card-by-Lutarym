# Fronius-Card-by-Lutarym

Lovelace-Karte für den Fronius Wattpilot. Sie zeigt das Gehäuse mit animiertem LED-Ring. Zusatzinformationen wie Status, Werte, RFID-Chip und Regler sind im Editor zuschaltbar.

**Version: 1.5.0** (steht im Editor unter dem Feld „Name“)

Die Karte braucht die Integration **Fronius Wattpilot by Lutarym** (`fronius_wattpilot_lutarym`). Die normale Fronius-Integration unterstützt den Wattpilot nicht.

Getestet ist der Code mit einem simulierten Home-Assistant-Objekt. Der visuelle Editor und ein Test am echten Wattpilot stehen noch aus.

## Funktionen

- Gehäuse für drei Bauformen: Go / Home (weiß), Flex Home (hell), Flex Pro (anthrazit)
- Animierter LED-Ring, siehe Abschnitt „LED-Verhalten“
- Die Symbole an der Karte sind Tasten für den Lademodus. Der aktive Modus leuchtet über dem Symbol.
- Visueller Editor in Home Assistant mit Auswahlfeldern
- Findet die Entitäten der Integration automatisch
- Zusatzinformationen sind standardmäßig aus und im Editor einzeln zuschaltbar:
  - Status mit Begründung des Geräts und Fehler
  - Werte: Ladestrom, Leistung, Energie seit Anstecken, Gesamtenergie
  - Aktiver RFID-Chip mit Name und Energie
  - Regler für Ladestrom und Lademodus (schreiben auf das Gerät)
  - Fahrzeuge automatisch aus den RFID-Chips der Integration, mit Foto oder Symbol und Ladestatus

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
3. Browser neu laden (Strg+F5).

## Demo-Modus

Mit „Demo-Modus (alles simuliert)“ im Editor zeigt die Karte Beispielwerte, ohne Verbindung zur Integration. Alle Zustände wechseln alle 14 Sekunden. Tasten und Regler wirken nur in der Simulation und schreiben nicht auf ein Gerät. Der Demo-Modus eignet sich zum Ausprobieren des Layouts.

## Konfiguration im Editor

1. Dashboard öffnen, **Bearbeiten**, dann **Karte hinzufügen**.
2. Nach „Fronius“ suchen oder die Karte unter „Benutzerdefiniert“ wählen.
3. Im Editor das **Modell** auswählen.
4. Unter **Zusatzinformationen anzeigen** die gewünschten Schalter einschalten.
5. Unter **Entitäten manuell angeben** nur etwas eintragen, wenn die automatische Erkennung nicht funktioniert.

## Konfiguration in YAML

Minimal reicht dieses Beispiel. Die Grafik ist dann die einzige Anzeige:

```yaml
type: custom:fronius-card-by-lutarym
model: flex-home
max_current: 16
led_source: pv
```

Mit Zusatzinformationen:

```yaml
type: custom:fronius-card-by-lutarym
model: flex-pro
show_status: true
show_values: true
show_chip: true
show_controls: true
```

### Optionen

| Option | Pflicht | Standard | Bedeutung |
|---|---|---|---|
| `name` | nein | Wattpilot | Name in der Konfiguration |
| `model` | nein | flex-home | `home` (Go / Home), `flex-home` oder `flex-pro` |
| `max_current` | nein | 16 | Höchstwert für den Ladestrom-Regler in Ampere |
| `led_source` | nein | pv | Farbe des LED-Rings beim Laden ohne PV-Überschuss: `pv` (gelb), `battery` (grün), `grid` (weiß) |
| `serial` | nein | | Seriennummer, wenn mehrere Wattpilot eingerichtet sind |
| `show_status` | nein | false | Status und Fehler anzeigen |
| `show_values` | nein | false | Werte anzeigen |
| `show_chip` | nein | false | RFID-Chip anzeigen |
| `show_controls` | nein | false | Regler für Ladestrom und Lademodus anzeigen |
| `show_car` | nein | false | Fahrzeugfoto mit Statusabzeichen anzeigen |
| `vehicle` | nein | none | Fahrzeug, das ohne aktiven Chip gezeigt wird: `none`, `vw-e-up` oder `byd-dolphin-surf` |
| `car_style` | nein | flow | Darstellung des Ladestatus am Fahrzeug: `flow` (Punkte laufen zum Auto), `badge` (Symbol am Foto), `diagram` (Sonne, Wallbox, Auto), `glow` (Schein am Foto in Statusfarbe) |
| `layout` | nein | landscape | Ausrichtung der Karte: `landscape` (Wallbox links, Fahrzeug, Status und Werte rechts), `portrait` (alles untereinander). Im Editor unter „Ausrichtung“ wählbar |
| `show_log` | nein | false | Ladeprotokoll anzeigen: Gesamtenergie pro registrierter RFID-Karte aus der Integration, der aktive Chip ist hervorgehoben |
| `chip_1` bis `chip_10` | nein | auto | Bild für den Chip auf diesem Platz im Wattpilot: `auto` (Foto am Chipnamen, sonst Symbol), `vw-e-up`, `byd-dolphin-surf` oder `icon` (Symbol) |
| `chip_1_image` bis `chip_10_image` | nein | leer | Eigenes Foto für diesen Chip, z. B. `/local/autos/zoe.png`. Hat Vorrang |
| `demo` | nein | false | Demo-Modus mit simulierten Werten |

Die Karte liest das Maximum des Ladestroms aus der Entität und begrenzt es auf `max_current`. Für einen Flex Home 11 C6 bleibt `max_current` daher bei 16.

### Entitäten manuell angeben (optional)

Diese Optionen überschreiben die automatische Erkennung. Eine manuell angegebene Entität hat Vorrang.

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

Die Entitäts-IDs in deiner Instanz findest du unter **Einstellungen, Geräte und Dienste, Entitäten**.

### Automatische Erkennung

Die Karte liest die Entitäts-Registry von Home Assistant. Sie erkennt die Entitäten der Integration an ihrer eindeutigen Kennung, die aus Seriennummer und Schlüssel besteht. Die Namen hängen nicht von der Sprache ab.

Wenn die Registry nicht gelesen werden kann, zeigt die Karte einen Hinweis. Dann trägst du die Entitäten im Editor manuell ein. Ob Nutzer ohne Administratorrechte die Registry lesen dürfen, habe ich nicht geprüft.

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

Die Karte liest die Chips aus den Entitäten der Integration Fronius Wattpilot by Lutarym:

- Chipnamen und Energie aus „<Chipname> Energie gesamt“, je Chip eine Entität.
- Den vorgehaltenen Chip aus „Aktive RFID-Karte“.

Ältere Fassungen der Integration haben diese Entitäten nicht. Dann liest die Karte „Registrierte RFID-Karten“ und „Aktive Transaktion“. Wert 0 bedeutet dort kein Chip, 1 der erste Chip, 2 der zweite.

Die Chip-Entitäten legt die Integration erst ab Version 2.9.0 auch bei Geräten an, die ihre Chips einzeln melden (Schlüssel `c0n` und folgende statt der Liste `cards`).

Ob die Entität auch dann einen Wert zeigt, wenn ein Chip nur vorgehalten wird und kein Ladevorgang läuft, habe ich nicht am Gerät geprüft.

## Fahrzeuge aus den RFID-Chips

Die Karte braucht dafür keine Einrichtung. Sie liest alle Chips aus der Integration und behandelt jeden Chip als ein Fahrzeug. Der Fahrzeugname ist der Chipname aus der Wattpilot-App. Wird ein Chip vorgehalten, erkennt die Karte ihn automatisch und zeigt dieses Fahrzeug.

Das Bild des Fahrzeugs ergibt sich so:

1. Ist im Editor für den Chip ein eigenes Foto angegeben, zeigt die Karte dieses. Fotos legst du zum Beispiel unter `/config/www/autos/` ab und gibst sie als `/local/autos/zoe.png` an.
2. Sonst zeigt sie das im Editor gewählte Foto, VW e-up oder BYD Dolphin Surf Comfort.
3. Steht dort „Automatisch“ (Standard), erkennt die Karte das Foto am Chipnamen:
   - „e-up“, „eup“, „VW“ oder „Volkswagen“ im Namen: Foto VW e-up
   - „Dolphin“ oder „BYD“ im Namen: Foto BYD Dolphin Surf Comfort
4. Passt kein Foto, zeigt die Karte ein Fahrzeug-Symbol. Es nimmt die Farbe des Ladestatus an.

Lässt sich ein eigenes Foto nicht laden, zum Beispiel wegen eines falschen Pfads, zeigt die Karte das Symbol und schreibt einen Hinweis in die Browser-Konsole.

Im Editor steht unter „Fahrzeuge (aus den RFID-Chips erkannt)“ jeder Chip mit seinem Namen, jeweils mit „Bild“ und „eigenes Foto“. Darunter steht, was „Automatisch“ zeigen würde. Der Abschnitt erscheint, sobald die Karte Chips gelesen hat.

Ist kein Chip aktiv, zeigt die Karte das Fahrzeug aus dem Feld „Fahrzeug ohne aktiven Chip“. Steht dort „Keins“, ist der Fahrzeugbereich bis zum nächsten Chip ausgeblendet.

Wird ein Chip vorgehalten, gilt außerdem:

- Über den Werten steht „Werte für <Fahrzeug>“. Ladestrom, Leistung und Energie seit Anstecken gehören dann zu diesem Fahrzeug.
- Zusätzlich erscheint „Gesamt mit diesem Chip“.
- Das Ladeprotokoll zeigt jedes Fahrzeug mit seiner Energie. Chips mit demselben Foto-Modell werden zusammengefasst. Hat ein Fahrzeug genau einen Chip, steht dort auch dessen letzte Ladung aus „<Chipname> Energie letzte Ladung“.

Als bekannt gilt ein Chip-Platz, wenn er einen Namen oder geladene Energie hat. Die Energie pro Chip ist die Summe, die der Wattpilot für diesen Chip speichert, kein Protokoll einzelner Ladungen.

## Bekannte Grenzen

- **Fahrzeugfotos:** Die Fotos stammen aus deinen Bilddateien. Die Bildrechte liegen beim Hersteller bzw. Anbieter. Für ein öffentliches GitHub-Repository vorher klären oder die Fotos entfernen. Auf dem BYD-Foto ist ein Kennzeichen mit dem Schriftzug „FINN“ zu sehen.
- **Fahrzeug-Status:** Das Abzeichen „Wartet auf PV-Überschuss“ ist abgeleitet (Fahrzeug angesteckt und Modus Eco). Die Integration meldet dafür keinen eigenen Status.

- **Grafik:** Die Gehäuse sind nach den Fotos von Fronius nachgezeichnet, nicht vermessen. Abweichungen im Detail sind möglich.
- **Visueller Editor:** Der Editor ist noch nicht in einer echten Home-Assistant-Instanz getestet.
- **Fehlertexte:** Die Karte nutzt die deutschen Texte der Integration.
- **Mehrere Wattpilot:** Ohne `serial` nimmt die Karte den ersten gefundenen Wattpilot.
- **Farbe bei Netz oder Speicher:** Die Karte erkennt die Quelle nicht selbst. Die Farbe kommt aus `led_source`.
- **LED-Farben:** Die Farben stammen aus einer Zusammenfassung des Handbuchs. Eine zweite Quelle habe ich nicht gefunden.
- **Leistungseinheit:** Die Karte rechnet Watt in Kilowatt um, wenn die Entität die Einheit W angibt. Die README der Integration weist darauf hin, dass die Skalierung möglicherweise abweicht. Bitte mit der Wattpilot-App vergleichen.
- **Gerätetest:** Die Karte ist nicht am echten Wattpilot getestet.

## Tasten an der Karte

- Blitz: Standard, Blatt: Eco, Uhr: Next Trip. Die Zuordnung ist eine Annahme, weil das Handbuch die Symbole nicht beschreibt.
- Beim Go / Home-Modell ist auf dem Foto nur Blatt und Uhr zu sehen. Die Taste links am Gehäuse ist nicht belegt, ihre Funktion ist nicht bekannt.
- Das Handbuch beschreibt: Die Anzeige über dem aktiven Modus leuchtet weiß, bei Eco und Next Trip blinkt sie. Der Blinktakt ist eine Annahme.

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
| Registrierte RFID-Karten (nur ältere Firmware) | `cards` | Sensor |
| Aktive RFID-Karte | `active_card` | Sensor |
| „<Chipname> Energie gesamt“ je Chip | `cards_0_energy` bis `cards_9_energy` | Sensor, Wh |
| „<Chipname> Energie letzte Ladung“ je Chip | `cards_0_session` bis `cards_9_session` | Sensor, Wh |

Für die Anzeige „Lädt mit PV-Überschuss“ braucht die Karte den „Ladegrund“ (`modelStatus`). Diese Entität ist in der Integration ab Werk deaktiviert. Ohne sie zeigt die Karte beim Laden nur „Lädt“.

Die Zuordnung der Energie seit Anstecken zu `wh` habe ich aus den Namen der Integration abgeleitet. Bitte prüfe das in deiner Instanz.

## Changelog

Siehe `CHANGELOG.md`.

## Lizenz

MIT, siehe `LICENSE`.
