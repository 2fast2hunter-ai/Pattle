export const FAQ_CATEGORIES = [
    {
        id: 'guild',
        label: 'Gilde',
        icon: '⚔️',
        entries: [
            {
                id: 'guild-getting-started',
                question: 'Wie starte ich meine erste Gilde?',
                steps: [
                    { title: 'Gilde erstellen', desc: 'Hauptmenü → Gilde → Neue Gilde gründen → Name eingeben → Gründen' },
                    { title: 'Emblem gestalten', desc: 'Beim Erstellen der Gilde Symbol & Farben auswählen – das Emblem wird einmalig beim Gründen festgelegt.' },
                    { title: 'Mitglieder einladen', desc: 'Mitglieder → Einladen → Spielernamen eingeben und bestätigen' },
                    { title: 'Officers ernennen', desc: 'Mitglied antippen → Zum Officer ernennen' },
                    { title: 'Gemeinsam kämpfen', desc: 'Gilde → Dungeon starten, Wochenbeute sammeln, in der Rangliste aufsteigen' },
                ],
                faqs: [
                    { q: 'Kann ich ohne Gilde spielen?', a: 'Ja, aber Gildenmitglieder erhalten XP-Boni und exklusive Gild-Events.' },
                    { q: 'Was kostet eine Gilde?', a: 'Nichts. Gilden sind komplett kostenlos.' },
                    { q: 'Wie verlasse ich eine Gilde?', a: 'Gilde → Einstellungen → Gilde verlassen. Als Gründer: Leitung zuerst an ein anderes Mitglied übertragen.' },
                ],
            },
        ],
    },
];
