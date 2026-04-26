export class LanguageUtil {
  static get isArabic() {
    const lang = localStorage.getItem('language');
    return lang === 'ar';
  }

  static get lang() {
    return localStorage.getItem('language') ?? "";
  }

  /**
   * Get localized value based on current language
   * @param arabicValue - The Arabic value
   * @param englishValue - The English value
   * @returns The localized value based on current language, with fallback to the other language
   */
  static getLocalizedValue(arabicValue?: string | null, englishValue?: string | null): string {
    if (this.isArabic) {
      return arabicValue || englishValue || '';
    }
    return englishValue || arabicValue || '';
  }
}
