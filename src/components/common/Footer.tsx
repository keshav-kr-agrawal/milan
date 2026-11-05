import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DiyaIcon, RakshaSutraThread, KolamDivider, TempleToranam } from '../motifs/CulturalMotifs';
import { populateFreshSeedData } from '../../data/db';
import { ChevronDown, ChevronUp, ArrowUp, RotateCcw, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const toggleAccordion = (col: string) => {
    setOpenAccordion(openAccordion === col ? null : col);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDemoData = async () => {
    if (window.confirm(t('common.demo_reset_confirm'))) {
      await populateFreshSeedData();
      setResetMessage('నమూనా డేటా విజయవంతంగా పునరుద్ధరించబడింది • डेटा रीसेट सफल • Demo Data Reset');
      setTimeout(() => setResetMessage(null), 4000);
    }
  };

  return (
    <footer className="bg-neel text-chandan-border border-t-2 border-haldi mt-auto select-none no-print">
      <TempleToranam className="w-full h-4 opacity-80" />
      <RakshaSutraThread className="h-1.5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Brand Header inside Footer */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-neel-surface gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-chandan rounded-2xl border-2 border-haldi shadow-sm">
              <DiyaIcon size={34} />
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-chandan tracking-wide">
                {t('app.title')}
              </div>
              <div className="text-xs text-haldi font-medium">
                {t('app.subtitle')}
              </div>
              <div className="text-[11px] text-chandan-border/80">
                {t('app.tagline')}
              </div>
            </div>
          </div>

          <div className="text-xs max-w-md text-chandan/90 leading-relaxed">
            {t('footer.brand_desc')}
          </div>
        </div>

        {/* 4 Trilingual Columns (Desktop Grid, Mobile Accordion) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 border-b border-neel-surface">
          {/* Column 1: Help */}
          <div className="border-b md:border-b-0 border-neel-surface pb-3 md:pb-0">
            <button
              onClick={() => toggleAccordion('help')}
              className="flex items-center justify-between w-full text-left font-serif font-bold text-chandan text-base mb-2 md:cursor-default"
            >
              <span>{t('footer.col_help')}</span>
              <span className="md:hidden">
                {openAccordion === 'help' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            <div className={`space-y-2 text-xs text-chandan-border/80 ${openAccordion === 'help' ? 'block' : 'hidden md:block'}`}>
              <div>
                <a href="tel:112" className="text-haldi font-bold hover:underline flex items-center gap-1.5">
                  📞 {t('footer.helpline_link')}
                </a>
              </div>
              <div>
                <button onClick={() => onNavigate('helpdesk')} className="hover:text-chandan transition-colors text-left">
                  {t('footer.helpdesks_link')}
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('home')} className="hover:text-chandan transition-colors text-left">
                  {t('footer.how_it_works_link')}
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('family')} className="hover:text-chandan transition-colors text-left">
                  {t('footer.register_family_link')}
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Safety & Emergency Numbers */}
          <div className="border-b md:border-b-0 border-neel-surface pb-3 md:pb-0">
            <button
              onClick={() => toggleAccordion('safety')}
              className="flex items-center justify-between w-full text-left font-serif font-bold text-chandan text-base mb-2 md:cursor-default"
            >
              <span>{t('footer.col_safety')}</span>
              <span className="md:hidden">
                {openAccordion === 'safety' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            <div className={`space-y-2 text-xs text-chandan-border/80 ${openAccordion === 'safety' ? 'block' : 'hidden md:block'}`}>
              <div>
                <a href="tel:112" className="text-kumkum-light font-bold hover:underline">
                  🚨 {t('footer.emergency_112')}
                </a>
              </div>
              <div>
                <a href="tel:100" className="hover:text-chandan">
                  👮 {t('footer.police_100')}
                </a>
              </div>
              <div>
                <a href="tel:108" className="hover:text-chandan">
                  🚑 {t('footer.ambulance_108')}
                </a>
              </div>
              <div>
                <a href="tel:1098" className="hover:text-chandan">
                  🧒 {t('footer.childline_1098')}
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Festival Heritage */}
          <div className="border-b md:border-b-0 border-neel-surface pb-3 md:pb-0">
            <button
              onClick={() => toggleAccordion('festival')}
              className="flex items-center justify-between w-full text-left font-serif font-bold text-chandan text-base mb-2 md:cursor-default"
            >
              <span>{t('footer.col_festival')}</span>
              <span className="md:hidden">
                {openAccordion === 'festival' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            <div className={`space-y-2 text-xs text-chandan-border/80 ${openAccordion === 'festival' ? 'block' : 'hidden md:block'}`}>
              <div>
                <button onClick={() => onNavigate('rituals')} className="hover:text-chandan transition-colors text-left">
                  {t('footer.about_pushkaralu')}
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('rituals')} className="hover:text-chandan transition-colors text-left">
                  {t('footer.rituals_link')}
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('rituals')} className="hover:text-chandan transition-colors text-left">
                  {t('footer.etiquette_link')}
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('edge_nodes')} className="hover:text-chandan transition-colors text-left">
                  {t('footer.offline_hotspots_link')}
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Legal & Privacy */}
          <div>
            <button
              onClick={() => toggleAccordion('legal')}
              className="flex items-center justify-between w-full text-left font-serif font-bold text-chandan text-base mb-2 md:cursor-default"
            >
              <span>{t('footer.col_legal')}</span>
              <span className="md:hidden">
                {openAccordion === 'legal' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            <div className={`space-y-2 text-xs text-chandan-border/80 ${openAccordion === 'legal' ? 'block' : 'hidden md:block'}`}>
              <div className="text-haldi font-medium flex items-center gap-1">
                <ShieldCheck size={14} />
                <span>{t('footer.privacy_policy')}</span>
              </div>
              <div>{t('footer.consent_terms')}</div>
              <div>{t('footer.data_retention')}</div>
              <div>{t('footer.accessibility_stmt')}</div>
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 Explicit Compliance Banner */}
        <div className="my-6 p-4 rounded-2xl bg-neel-deep border border-neel-surface text-xs leading-relaxed text-chandan-border/90 flex items-start gap-3">
          <ShieldCheck size={22} className="text-haldi shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-haldi">
              {t('footer.dpdp_badge')}
            </div>
            <div>
              {t('footer.dpdp_note')}
            </div>
          </div>
        </div>

        {/* Official Prototype Disclaimer */}
        <div className="py-4 text-center text-xs text-chandan-border/80 border-t border-neel-surface flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="font-medium text-haldi text-left space-y-0.5">
            <div>{t('footer.disclaimer_warning')}</div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleResetDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neel-surface hover:bg-neel-surface/80 text-haldi border border-haldi/40 text-xs font-semibold transition-colors"
              title={t('footer.reset_demo_btn')}
            >
              <RotateCcw size={13} />
              <span>{t('footer.reset_demo_btn')}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neel-surface hover:bg-neel-surface/80 text-chandan text-xs font-medium transition-colors"
              title={t('footer.back_to_top')}
            >
              <ArrowUp size={13} />
              <span>{t('footer.back_to_top')}</span>
            </button>
          </div>
        </div>

        {resetMessage && (
          <div className="text-center py-2 text-xs font-bold text-tulsi-light bg-tulsi/30 rounded-xl animate-fadeIn mt-2">
            ✓ {resetMessage}
          </div>
        )}

        <div className="pt-2 text-center text-[11px] text-chandan-border/50">
          గోదావరి మిలన్ v1.0.0 (Godavari Milan RTIH Innovation Prototype) • Rajamahendravaram, Andhra Pradesh
        </div>
      </div>
    </footer>
  );
};
