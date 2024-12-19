'use client'
import { useEffect, useRef, useState } from 'react';

export function useSpeaker() {
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
            // Код выполняется только в браузере
            utteranceRef.current = new SpeechSynthesisUtterance();
            utteranceRef.current.pitch = 0;

            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 4) {
                utteranceRef.current.voice = voices[4];
            }

            const handleVoicesChanged = () => {
                const updatedVoices = window.speechSynthesis.getVoices();
                if (utteranceRef.current && updatedVoices.length > 4) {
                    utteranceRef.current.voice = updatedVoices[4];
                }
            };

            window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

            // Устанавливаем флаг, чтобы указать, что мы в браузере
            setIsBrowser(true);

            return () => {
                window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
            };
        }
    }, []);

    const speak = (text: string, lang: string) => {
        if (!utteranceRef.current) {
            console.error('Speech synthesis is not supported in this environment.');
            return;
        }

        // Отменяем текущий синтез речи
        window.speechSynthesis.cancel();

        // Настраиваем и воспроизводим новый текст
        utteranceRef.current.text = text;
        utteranceRef.current.lang = lang;
        window.speechSynthesis.speak(utteranceRef.current);
    };

    return { speak, isBrowser };
}
