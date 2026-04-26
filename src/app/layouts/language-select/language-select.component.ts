import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from 'src/app/core/services/language.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'language-select',
  templateUrl: './language-select.component.html',
  styleUrl: './language-select.component.scss'
})
export class LanguageSelectComponent implements OnInit {

  element: any;
  flagvalue: any;
  valueSet: any;
  countryName: any;
  currentLang: string = 'ar'; // Default to Arabic

  constructor(
      @Inject(DOCUMENT) private document: Document,
      public _languageService: LanguageService,
      protected translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.element = document.documentElement;
    
    // Get current language or default to Arabic
    this.currentLang = this._languageService.getCurrentLanguage() || 'ar';
    
    // Ensure translate service is using the correct language
    if (!this.translate.currentLang || 
        (this.translate.currentLang !== 'en' && this.translate.currentLang !== 'ar')) {
      this.translate.setDefaultLang('ar');
      this.translate.use(this.currentLang);
    } else {
      this.currentLang = this.translate.currentLang;
    }
    
    const val = this.listLang.filter(x => x.lang === this.currentLang);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueSet = 'assets/images/flags/sa.svg'; } // Default to Saudi flag for Arabic
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  /***
 * Language Listing
 */
  listLang = [
    { text: 'English', dir: 'ltr', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'عربي', dir: 'rtl', flag: 'assets/images/flags/sa.svg', lang: 'ar' }
  ];

  /***
   * Language Value Set
   * @param item
   */
  setLanguage(item: 'en' | 'ar') {
    let currentLang = (item) == 'en' ? this.listLang[0] : this.listLang[1];
    this.countryName = currentLang.text;
    this.flagvalue = currentLang.flag;
    this.currentLang = currentLang.lang;
    this._languageService.setLanguage(currentLang.lang);
    window.location.reload();
  }

}
