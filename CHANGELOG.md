# Changelog

## 0.8.0

- Neu: Vier grafische Darstellungen des Ladestatus am Fahrzeugfoto, im Editor unter „Darstellung des Ladestatus“ wählbar. `flow`: Punkte laufen zum Auto, wenn Strom fließt. `badge`: Symbol am Foto. `diagram`: Sonne, Wallbox und Auto mit leuchtendem Strompfad. `glow`: weicher Schein am Foto in der Statusfarbe.
- Geändert: Unter dem Foto steht nur noch der Hauptstatus als kleine Zeile mit Symbol.

## 0.7.1

- Geändert: Die Statuskarte unter dem Foto zeigt nur noch den Hauptstatus, zum Beispiel „Lädt“ oder „Wartet auf PV-Überschuss“, mit einem Symbol in der Statusfarbe. Modus und Kennzahlen sind entfernt.

## 0.7.0

- Geändert: Der Fahrzeugstatus unter dem Foto ist eine Statuskarte. Oben stehen „Fahrzeug“ und der Lademodus, darunter der Status im Klartext. Zwei Kennzahlen zeigen die aktuelle Leistung in kW und die Energie seit Anstecken in kWh. Die linke Kante hat die Statusfarbe.

## 0.6.1

- Geändert: Das Statusfeld unter dem Foto ist heller und kleiner. Es hat keine dunkle Fläche und keinen Leuchteffekt mehr. Das Symbol im Kreis, der Klartext und der Lademodus bleiben.

## 0.6.0

- Geändert: Der Fahrzeugstatus unter dem Foto ist ein eigenes Statusfeld in dunkler Optik. Links zeigt ein Kreis mit Symbol den Zustand: gestrichelt beim Warten, ein rotierender Bogen beim Laden, ein Haken bei abgeschlossener Ladung und ein Kreuz bei Fehler. Rechts stehen der Status im Klartext und der Lademodus (zum Beispiel „Modus Eco“).

## 0.5.9

- Geändert: Unter dem Fahrzeugfoto steht jetzt der Status im Klartext, zum Beispiel „Lädt mit PV-Überschuss“. Er sitzt zwischen zwei leuchtenden Linien in der Statusfarbe. Die Linien pulsieren beim Laden und Warten.

## 0.5.8

- Geändert: Der Fahrzeugstatus ist keine Pille mehr, sondern eine schmale LED-Leiste unter dem Fahrzeugfoto in der Statusfarbe. Sie leuchtet weich und pulsiert beim Laden und Warten. Der Statustext steht weiter in der Kartenkopfzeile und als Hinweis beim Überfahren.

## 0.5.7

- Geändert: Das Statusabzeichen ist ruhiger gestaltet. Es ist ein schlichtes Feld mit einem kleinen leuchtenden Punkt in der Statusfarbe, passend zu den LEDs der Wallbox. Der Text bricht nicht mehr um.

## 0.5.6

- Geändert: Das Statusabzeichen unter dem Fahrzeugfoto ist zurückhaltender. Kleineres Symbol (12 px), nur leichte Tönung statt Vollfläche, dünner Rand.

## 0.5.5

- Neu: Demo-Modus („Demo-Modus (alles simuliert)“ im Editor). Die Karte braucht dann keine Integration. Zustände, Werte, Chip, Lademodus, Regler und Fahrzeugfoto wechseln alle 14 Sekunden. Tasten und Regler funktionieren lokal in der Simulation.

## 0.5.0

- Neu: Fahrzeugfoto als Zusatzinformation. Auswahl im Editor unter „Fahrzeug“: keins, VW e-up oder BYD Dolphin Surf Comfort. Anzeige im Editor unter „Fahrzeug anzeigen“.
- Neu: Statusabzeichen unter dem Foto. Angesteckt (blau), Wartet auf PV-Überschuss (gelb, Eco, abgeleitet), Lädt mit PV-Überschuss (gelb), Lädt (grün), Ladung abgeschlossen (grün), Fehler (rot).
- Fehler behoben: Manuell eingetragene Entitäten im Editor wurden ignoriert. Die Karte hat die Entität nur über die Registry gesucht. Das betraf alle Felder, auch den Lademodus der Tasten.

## 0.4.0

- Neu: Die Symbole an der Karte sind Tasten für den Lademodus. Blitz zu Standard, Blatt zu Eco, Uhr zu Next Trip. Die Zuordnung ist eine Annahme.
- Neu: Der aktive Modus zeigt eine Leuchtanzeige über dem Symbol. Standard leuchtet, Eco und Next Trip blinken (Blinktakt angenommen).
- Neu: Wenn die Lademodus-Entität fehlt oder ein Umschalten fehlschlägt, zeigt die Karte einen Hinweis und schreibt eine Meldung in die Browser-Konsole.

## 0.3.0

- Gehäuse nach den Fotos von Fronius überarbeitet (Go / Home, Flex Home, Flex Pro). Die Grafik ist nicht vermessen.
- Standard: nur die Wallbox-Grafik mit LED-Ring. Zusatzinformationen sind aus.
- Neu: Visueller Editor in Home Assistant mit Modellauswahl und Schaltern für Status, Werte, RFID-Chip und Regler.
- Neu: Entitäten lassen sich im Editor manuell angeben.
- Die Karte heißt jetzt Fronius-Card-by-Lutarym (Kartentyp `custom:fronius-card-by-lutarym`).
- Die Version steht im Editor unter dem Feld „Name“, nicht mehr in der Karte.

## 0.2.0

- Entitäten werden automatisch über die Integration Fronius Wattpilot by Lutarym gefunden. Die Zuordnung erfolgt über die eindeutige Kennung der Entität, nicht über den Namen. Damit funktioniert die Karte unabhängig von der Sprache der Instanz.
- Manuelle Entitäten sind weiterhin möglich und haben Vorrang. Mit `serial` lässt sich ein bestimmter Wattpilot wählen, wenn mehrere eingerichtet sind.
- Status aus dem Fahrzeugstatus der Integration: Kein Fahrzeug, Angesteckt wartet, Lädt, Ladung abgeschlossen, Fehler.
- Begründung des Geräts im Klartext, zum Beispiel „Laden mit PV-Überschuss“ oder „Kein Laden wegen Zeitplan“.
- Fehlertexte aus der Integration, zum Beispiel „Übertemperatur“.
- Anzeige des aktiven RFID-Chips mit Name und Energie. Die Anzeige erscheint, wenn der Wattpilot einen aktiven Chip meldet.
- LED-Ring zeigt bei Laden mit PV-Überschuss gelb, sonst die Farbe aus `led_source`. Bei „Ladung abgeschlossen“ leuchten alle LEDs grün.
- Die Ladeerkennung über einen Schwellenwert entfällt. Der Status kommt vom Gerät.
- Geändert: `connected` und `charging_threshold` entfallen. Für den Fahrzeugstatus gibt es jetzt die Option `car`.

## 0.1.0

- Erste Version der Karte.
- Gehäuse für Go / Home, Flex Home und Flex Pro.
- LED-Ring mit Animation: Start, Laden und Fehler.
- Anzeige von Status, Ladestrom, Leistung, Energie seit Anstecken und Gesamtenergie.
- Steuerung für Ladestrom und Lademodus.
- Versionsangabe in der Karte.
