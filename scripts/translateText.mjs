import fetch from 'node-fetch';

const translationCache = new Map();
export async function getTranslation(text, targetLanguage) {
    if (translationCache.has(text)) {
        return translationCache.get(text);
    }

    const translatedText = await translateText(text, targetLanguage);
    translationCache.set(text, translatedText);
    return translatedText;
}

export async function translateText(text, targetLanguage) {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodedText}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const translatedText = data[0][0][0];
        return translatedText;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Translation failed');
    }
}