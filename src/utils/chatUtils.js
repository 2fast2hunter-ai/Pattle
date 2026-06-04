const PROFANITY = [
  'fuck', 'fuck', 'sh1t', 'shit', 'bitch', 'bastard', 'cunt', 'asshole',
  'cock', 'pussy', 'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut',
  'motherfucker', 'motherfucking', 'dickhead',
  // German
  'scheiße', 'scheiß', 'hurensohn', 'wichser', 'arschloch', 'fotze', 'nutte',
  'drecksau', 'ficker', 'wichse',
];

export function filterProfanity(text) {
  if (!text) return text;
  let out = text;
  PROFANITY.forEach(word => {
    const re = new RegExp(word, 'gi');
    out = out.replace(re, '***');
  });
  return out;
}
