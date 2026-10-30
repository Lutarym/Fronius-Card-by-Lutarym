# Changelog

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
