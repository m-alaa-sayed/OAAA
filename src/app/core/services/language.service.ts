import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['en', 'ar'];
  private storageKey = 'language';

  constructor(public translate: TranslateService) {
    this.translate.addLangs(this.languages);
    this.translate.setDefaultLang('ar');
    this.initLanguage();
  }

  initLanguage() {
    let lang = localStorage.getItem(this.storageKey) || 'ar';
    lang = this.languages.includes(lang) ? lang : 'ar';
    this.setLanguage(lang);
  }

  setLanguage(lang: string) {
    if (!this.languages.includes(lang)) lang = 'ar';
    localStorage.setItem(this.storageKey, lang);
    this.translate.setDefaultLang('ar');
    this.translate.use(lang);
    this.setPageDirection(lang);
  }

  setPageDirection(lang: string) {
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang === 'en' ? 'en' : 'ar';
  }

  getCurrentLanguage() {
    return localStorage.getItem(this.storageKey) || 'ar';
  }
}
