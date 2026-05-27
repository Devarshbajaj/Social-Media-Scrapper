import axios from 'axios';

export class TranslationService {
  constructor() {
    // Supported languages for translation
    this.supportedLanguages = {
      en: 'English',
      hi: 'Hindi',
      pa: 'Punjabi',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      ar: 'Arabic',
      zh: 'Chinese',
      ru: 'Russian',
      ja: 'Japanese',
    };
  }

  /**
   * Translate text using Google Translate API or alternative service
   */
  async translateText(text, targetLanguage) {
    try {
      // Using Google Translate via public API (no key required)
      // For production, use official Google Cloud Translation API
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`;

      const response = await axios.get(url);

      if (response.data.responseStatus === 200) {
        return response.data.responseData.translatedText;
      } else {
        console.error('Translation API error:', response.data);
        return text; // Return original text if translation fails
      }
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  /**
   * Translate text into multiple languages
   */
  async translateToMultipleLanguages(text, languages = null) {
    const targetLanguages = languages || Object.keys(this.supportedLanguages);
    const translations = {};

    // Add English (original language)
    translations['en'] = text;

    for (const lang of targetLanguages) {
      if (lang === 'en') continue;

      try {
        translations[lang] = await this.translateText(text, lang);
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to translate to ${lang}:`, error);
        translations[lang] = text;
      }
    }

    return translations;
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text) {
    try {
      // Using language-detect or simple heuristics
      // For now, we assume English for simplicity
      return 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }
}

export default new TranslationService();
