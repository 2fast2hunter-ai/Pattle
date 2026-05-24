import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function LegalScreen({ type, onBack, t }) {
    const title = type === 'imprint' ? (t ? t('legal_imprint') : 'Impressum') : (t ? t('legal_privacy') : 'Datenschutz');
    
    return (
        <div className="h-full flex flex-col bg-slate-950 animate-in fade-in slide-in-from-right duration-300">
            <div className="relative flex items-center justify-center p-4 shrink-0 border-b border-white/5">
                <button
                    onClick={onBack}
                    className="absolute left-4 p-2 bg-slate-800/50 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors border border-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black italic tracking-wide text-white">{title}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 text-slate-300 text-sm leading-relaxed space-y-6 select-text">
                {type === 'imprint' ? (
                    <>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Angaben gemäß § 5 TMG</h3>
                            <p>
                                [Dein Vorname] [Dein Nachname]<br/>
                                [Deine Straße] [Hausnummer]<br/>
                                [PLZ] [Dein Wohnort]
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Kontakt</h3>
                            <p>
                                E-Mail: [Deine E-Mail-Adresse]<br/>
                                { /* Optional: Telefon: [Deine Telefonnummer] */ }
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                            <p>
                                [Dein Vorname] [Dein Nachname]<br/>
                                [Deine Straße] [Hausnummer]<br/>
                                [PLZ] [Dein Wohnort]
                            </p>
                        </div>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-xs">
                            <strong>HINWEIS:</strong> Bitte ersetze die Angaben in eckigen Klammern durch deine echten Daten. Da die App In-App-Käufe oder Werbung enthält, gilt sie meist nicht mehr als rein privat, weshalb ein vollständiges Impressum notwendig ist.
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Datenschutzerklärung</h3>
                            <p>
                                Wir freuen uns über dein Interesse an unserer App "Pattle". Der Schutz deiner Privatsphäre ist für uns sehr wichtig. Nachstehend informieren wir dich ausführlich über den Umgang mit deinen Daten.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-bold mb-1">1. Verantwortlicher</h4>
                            <p>
                                Verantwortlicher für die Datenverarbeitung ist:<br/>
                                [Dein Vorname] [Dein Nachname]<br/>
                                [Deine Straße] [Hausnummer]<br/>
                                [PLZ] [Dein Wohnort]<br/>
                                E-Mail: [Deine E-Mail-Adresse]
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-1">2. Datenerhebung bei Nutzung der App</h4>
                            <p>
                                Wir erheben personenbezogene Daten, wenn du uns diese im Rahmen deiner Registrierung (E-Mail-Adresse, Benutzername, Passwort) freiwillig mitteilst. Wir verwenden diese Daten ausschließlich zur Abwicklung des Spielbetriebs (Speicherung des Fortschritts, Login).
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-1">3. Nutzung von Firebase</h4>
                            <p>
                                Wir nutzen Dienste von Google Firebase (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland).
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Authentication:</strong> Zur Verwaltung der Benutzeranmeldung.</li>
                                <li><strong>Firestore Database:</strong> Zur Speicherung von Spieldaten (Inventar, Pets, Level).</li>
                                <li><strong>Cloud Functions:</strong> Zur serverseitigen Verarbeitung von Spiellogik.</li>
                                <li><strong>Hosting:</strong> Bereitstellung der Web-App.</li>
                            </ul>
                            <p className="mt-2">
                                Weitere Informationen zum Datenschutz bei Google Firebase findest du unter: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">https://firebase.google.com/support/privacy</a>
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-1">4. Google Analytics 4</h4>
                            <p>
                                Wir verwenden Google Analytics 4 (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) zur Analyse des Nutzerverhaltens. Dabei werden anonymisierte Nutzungsdaten erhoben, z.B. welche Spielbereiche aufgerufen werden und wie oft bestimmte Aktionen ausgeführt werden. Es werden <strong>keine personenbezogenen Daten</strong> (Name, E-Mail, Standort) erhoben. IP-Adressen werden anonymisiert. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">https://policies.google.com/privacy</a>
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-1">5. Werbung</h4>
                            <p>
                                Diese App bindet Werbung ein (z.B. für Belohnungen). Hierbei können durch den Werbeanbieter (z.B. Monetag) Daten wie IP-Adresse oder Device-ID verarbeitet werden, um passende Werbung anzuzeigen.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-1">6. Deine Rechte</h4>
                            <p>
                                Du hast das Recht auf Auskunft über deine gespeicherten Daten sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Kontaktiere uns dazu einfach per E-Mail.
                            </p>
                        </div>

                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-xs">
                            <strong>WICHTIG:</strong> Dies ist ein Muster für eine Hobby-App. Es ersetzt keine Rechtsberatung. Bitte passe die Kontaktdaten oben an.
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
