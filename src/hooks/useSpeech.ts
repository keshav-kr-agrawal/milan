import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useSpeech() {
  const { i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const speak = (text: string) => {
    if (!isSupported) return;

    window.speechSynthesis.cancel(); // Stop any active utterance

    const cleanText = text.replace(/<[^>]*>?/gm, ''); // strip HTML
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Map to regional Indic speech locale codes
    const currentLang = i18n.language || 'te';
    if (currentLang.startsWith('te')) {
      utterance.lang = 'te-IN';
    } else if (currentLang.startsWith('hi')) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.95; // slightly slower for better elder comprehension
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, stop, isSpeaking, isSupported };
}
