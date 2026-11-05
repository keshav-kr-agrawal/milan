import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DiyaIcon, GopuramSilhouette, RakshaSutraThread, LotusIcon, KalashIcon, TempleToranam } from '../motifs/CulturalMotifs';
import { Check, Globe, X } from 'lucide-react';

export const LanguagePickerModal: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>(i18n.language || 'te');

  useEffect(() => {
    // Open on first launch if user hasn't chosen a language yet
    const hasChosen = localStorage.getItem('milan_lang_chosen');
    if (!hasChosen) {
      setIsOpen(true);
    }

    // Global event listener to open language picker anytime from Header or Footer
    const handleOpen = () => {
      setSelectedLang(i18n.language || 'te');
      setIsOpen(true);
    };

    window.addEventListener('milan:open-lang-picker', handleOpen);
    return () => window.removeEventListener('milan:open-lang-picker', handleOpen);
  }, [i18n.language]);

  const handleApply = (lang: string) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('milan_lang_chosen', 'true');
    localStorage.setItem('milan_user_lang', lang);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neel/85 backdrop-blur-md animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
    >
      <div className="relative w-full max-w-lg bg-chandan rounded-3xl shadow-sutra-lg border-2 border-haldi overflow-hidden text-ink">
        <TempleToranam className="w-full h-4 sm:h-5 opacity-90" />

        {/* Close button if user already chose before */}
        {localStorage.getItem('milan_lang_chosen') && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 hover:bg-white text-ink-muted hover:text-ink border border-chandan-border transition-colors shadow-xs z-10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}

        <div className="p-5 sm:p-7 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-white rounded-2xl border-2 border-haldi shadow-sm">
              <DiyaIcon size={38} />
            </div>
          </div>

          <h2 id="lang-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-neel">
            మీ భాషను ఎంచుకోండి • अपनी भाषा चुनें
          </h2>
          <div className="text-xs sm:text-sm font-semibold text-kesari mt-0.5">
            Select Your Preferred Language for Pushkaralu 2027
          </div>

          <p className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            గోదావరి పుష్కరాల రక్షా పోర్టల్ మీ ఎంపిక చేసిన ఒకే భాషలో స్పష్టంగా కనిపిస్తుంది.
            <span className="block text-[11px] text-ink-subtle mt-0.5">
              यह पोर्टल आपकी चुनी हुई भाषा में प्रदर्शित होगा। आप इसे कभी भी बदल सकते हैं।
            </span>
          </p>

          <RakshaSutraThread className="my-4" />

          {/* 3 Prominent Language Cards */}
          <div className="grid grid-cols-1 gap-3 my-4 text-left">
            {/* 1. Telugu */}
            <button
              type="button"
              onClick={() => setSelectedLang('te')}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all group ${
                selectedLang === 'te'
                  ? 'border-kesari bg-kesari-light text-neel font-bold shadow-md ring-2 ring-kesari/40'
                  : 'border-chandan-border bg-white hover:border-kesari text-ink'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${selectedLang === 'te' ? 'bg-kesari text-white border-kesari' : 'bg-chandan text-kesari border-chandan-border'}`}>
                  <DiyaIcon size={22} />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-neel">తెలుగు (Telugu)</div>
                  <div className="text-xs text-ink-muted">ఆంధ్రప్రదేశ్ & తెలంగాణ యాత్రికుల భాష</div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${selectedLang === 'te' ? 'border-kesari bg-kesari text-white' : 'border-chandan-border'}`}>
                {selectedLang === 'te' && <Check size={14} className="stroke-[3]" />}
              </div>
            </button>

            {/* 2. Hindi */}
            <button
              type="button"
              onClick={() => setSelectedLang('hi')}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all group ${
                selectedLang === 'hi'
                  ? 'border-kesari bg-kesari-light text-neel font-bold shadow-md ring-2 ring-kesari/40'
                  : 'border-chandan-border bg-white hover:border-kesari text-ink'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${selectedLang === 'hi' ? 'bg-kesari text-white border-kesari' : 'bg-chandan text-kesari border-chandan-border'}`}>
                  <LotusIcon size={22} />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-neel">हिन्दी (Hindi)</div>
                  <div className="text-xs text-ink-muted">उत्तर एवं मध्य भारत से आने वाले श्रद्धालुओं हेतु</div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${selectedLang === 'hi' ? 'border-kesari bg-kesari text-white' : 'border-chandan-border'}`}>
                {selectedLang === 'hi' && <Check size={14} className="stroke-[3]" />}
              </div>
            </button>

            {/* 3. English */}
            <button
              type="button"
              onClick={() => setSelectedLang('en')}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all group ${
                selectedLang === 'en'
                  ? 'border-kesari bg-kesari-light text-neel font-bold shadow-md ring-2 ring-kesari/40'
                  : 'border-chandan-border bg-white hover:border-kesari text-ink'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${selectedLang === 'en' ? 'bg-kesari text-white border-kesari' : 'bg-chandan text-kesari border-chandan-border'}`}>
                  <KalashIcon size={22} />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-neel">English</div>
                  <div className="text-xs text-ink-muted">For all national, international pilgrims & volunteers</div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${selectedLang === 'en' ? 'border-kesari bg-kesari text-white' : 'border-chandan-border'}`}>
                {selectedLang === 'en' && <Check size={14} className="stroke-[3]" />}
              </div>
            </button>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={() => handleApply(selectedLang)}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-kesari to-haldi hover:from-kesari-hover hover:to-gold text-white font-bold text-sm sm:text-base shadow-md transition-all hover:scale-[1.02] active:scale-95 border border-white/40"
          >
            {selectedLang === 'te'
              ? 'ప్రవేశించండి • Continue in Telugu →'
              : selectedLang === 'hi'
              ? 'प्रवेश करें • Continue in Hindi →'
              : 'Enter Portal • Continue in English →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePickerModal;
