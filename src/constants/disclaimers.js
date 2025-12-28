export const DISCLAIMERS = {
  english: {
    short: "⚠️ For Entertainment Only - Not Professional Advice",
    full: "⚠️ ENTERTAINMENT ONLY - NOT PROFESSIONAL ADVICE\n\nThis assessment is designed for entertainment and self-reflection purposes only. It should NOT be considered as professional psychological evaluation, therapy, or relationship counseling. For serious relationship concerns, please consult a licensed mental health professional or relationship counselor.",
    watermark: "For Entertainment Only"
  },
  tanglish: {
    short: "⚠️ Entertainment Mattum - Professional Advice Illa",
    full: "⚠️ ENTERTAINMENT MATTUM - PROFESSIONAL ADVICE ILLA\n\nIdhu sirippu-kku mattum design pannirukkom, self-reflection-kku. Idha professional psychological evaluation, therapy, or relationship counseling-a consider panna KOODADHU. Serious relationship problems-kku licensed mental health professional or counselor-a parunga.",
    watermark: "Entertainment Mattum"
  }
};

export const getDisclaimer = (language = 'english', variant = 'full') => {
  return DISCLAIMERS[language]?.[variant] || DISCLAIMERS.english[variant];
};
