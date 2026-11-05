import React from 'react';
import { useTranslation } from 'react-i18next';
import { DiyaIcon, KolamDivider, TempleToranam } from '../motifs/CulturalMotifs';
import { AlertTriangle, HelpCircle, PhoneCall, X, ShieldAlert } from 'lucide-react';

interface StickyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'missing' | 'found' | 'lookup') => void;
}

export const StickyHelpModal: React.FC<StickyHelpModalProps> = ({ isOpen, onClose, onSelectAction }) => {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neel/85 backdrop-blur-md animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sticky-help-title"
    >
      <div className="relative w-full max-w-lg bg-chandan rounded-3xl shadow-sutra-lg border-2 border-kumkum overflow-hidden text-ink max-h-[95vh] overflow-y-auto">
        <TempleToranam className="w-full h-3.5 sm:h-4 opacity-90" />

        <div className="p-5 sm:p-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white border border-chandan-border hover:bg-chandan text-ink transition-colors shadow-xs"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-kumkum text-white shadow-urgent shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 id="sticky-help-title" className="text-lg sm:text-2xl font-serif font-bold text-neel">
                {t('home.sticky_help')}
              </h2>
              <div className="text-[11px] sm:text-xs text-kumkum font-bold uppercase tracking-wider">
                {t('app.subtitle')}
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
            {i18n.language === 'te'
              ? 'క్రింది అత్యవసర చర్యలలో ఒకదాన్ని ఎంచుకోండి. సహాయ కేంద్రాలు మరియు పోలీస్ బృందాలు వెంటనే స్పందిస్తాయి.'
              : i18n.language === 'hi'
              ? 'कृपया नीचे दिए गए विकल्पों में से चयन करें। पुलिस व सहायता टीमें तुरंत सक्रिय होंगी।'
              : 'Please choose an action below. Help desks and police patrol units will respond immediately.'}
          </p>

          <KolamDivider className="my-3 sm:my-4" />

          <div className="space-y-3">
            {/* Option 1: I lost someone */}
            <button
              onClick={() => {
                onSelectAction('missing');
                onClose();
              }}
              className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-kumkum-light border-2 border-kumkum text-left shadow-sm transition-all group hover:scale-[1.01]"
            >
              <div className="p-2.5 sm:p-3 rounded-xl bg-kumkum/10 text-kumkum group-hover:bg-kumkum group-hover:text-white transition-colors shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-kumkum group-hover:text-red-900 leading-tight">
                  {t('nav.report_missing')}
                </div>
                <div className="text-xs text-ink-muted mt-0.5">
                  {i18n.language === 'te'
                    ? 'పిల్లలు లేదా కుటుంబ సభ్యులు తప్పిపోతే 3 ట్యాప్‌లలో అలర్ట్ పంపండి.'
                    : i18n.language === 'hi'
                    ? 'यदि परिवार का कोई सदस्य बिछड़ गया है तो तुरंत 3 टैप में रिपोर्ट करें।'
                    : 'Report a separated child or elder with clothing tags and GPS.'}
                </div>
              </div>
            </button>

            {/* Option 2: I found someone */}
            <button
              onClick={() => {
                onSelectAction('found');
                onClose();
              }}
              className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-godavari-light border-2 border-godavari text-left shadow-sm transition-all group hover:scale-[1.01]"
            >
              <div className="p-2.5 sm:p-3 rounded-xl bg-godavari/10 text-godavari group-hover:bg-godavari group-hover:text-white transition-colors shrink-0">
                <HelpCircle size={22} />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-godavari group-hover:text-teal-900 leading-tight">
                  {t('nav.report_found')}
                </div>
                <div className="text-xs text-ink-muted mt-0.5">
                  {i18n.language === 'te'
                    ? 'ఎవరైనా చిన్నారి లేదా పెద్దలు కనిపిస్తే 30 సెకన్లలో సమాచారం ఇవ్వండి.'
                    : i18n.language === 'hi'
                    ? 'कोई बिछड़ा व्यक्ति मिलने पर 30 सेकंड का त्वरित फॉर्म भरें (ऑफलाइन सक्षम)।'
                    : 'Report a found person in 30 seconds (works fully offline).'}
                </div>
              </div>
            </button>

            {/* Option 3: Scan QR band on a lost person */}
            <button
              onClick={() => {
                onSelectAction('lookup');
                onClose();
              }}
              className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-haldi-light border-2 border-haldi text-left shadow-sm transition-all group hover:scale-[1.01]"
            >
              <div className="p-2.5 sm:p-3 rounded-xl bg-haldi/20 text-mitti group-hover:bg-haldi group-hover:text-neel transition-colors shrink-0">
                <PhoneCall size={22} />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-neel leading-tight">
                  {t('nav.lookup')}
                </div>
                <div className="text-xs text-ink-muted mt-0.5">
                  {i18n.language === 'te'
                    ? 'చేతి బ్యాండ్‌ను స్కాన్ చేసి హెల్ప్‌లైన్ ద్వారా సంరక్షకునికి కాల్ చేయండి.'
                    : i18n.language === 'hi'
                    ? 'कलाई बैंड का क्यूआर कोड स्कैन कर अभिभावक से सुरक्षित संपर्क करें।'
                    : 'Scan QR wristband code to connect with guardian safely.'}
                </div>
              </div>
            </button>
          </div>

          <div className="mt-5 pt-3 border-t border-chandan-border flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-ink-muted font-medium">24/7 Helplines:</span>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <a href="tel:112" className="text-kumkum font-bold hover:underline flex items-center gap-1 text-xs sm:text-sm">
                📞 112 (Police)
              </a>
              <span className="text-chandan-border">|</span>
              <a href="tel:1098" className="text-godavari font-bold hover:underline text-xs sm:text-sm">
                🧒 1098 (Childline)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyHelpModal;
