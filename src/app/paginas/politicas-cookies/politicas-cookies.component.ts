import { Component, inject } from '@angular/core';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MenuComponent } from '../../layout/menu/menu.component';
import { CookieConsentService } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-politicas-cookies',
  imports: [RodapeComponent, TranslatePipe, MenuComponent],
  templateUrl: './politicas-cookies.component.html',
  styleUrl: './politicas-cookies.component.css',
})
export class PoliticasCookiesComponent {
  private cookieConsent = inject(CookieConsentService);
  cookiesUpdatedDate = '2025-01-15'; // January is 0, so this represents January 15, 2025

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  openCookieSettings(): void {
    this.cookieConsent.openPreferences();
  }

  constructor(private translate: TranslateService) {}

  languages = [
    { code: 'pt', name: 'PT', flag: 'assets/flags/pt-flag.svg' },
    { code: 'en', name: 'EN', flag: 'assets/flags/us-flag.svg' },
    // Add more languages as needed
    { code: 'fr', name: 'FR', flag: 'assets/flags/fr-flag.svg' },
    { code: 'es', name: 'ES', flag: 'assets/flags/es-flag.svg' },
  ];

  selectedLanguage = this.languages[0]; // Default to first language

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const langCode = select.value;
    const foundLang = this.languages.find((l) => l.code === langCode);
    if (foundLang) {
      this.selectedLanguage = foundLang;
    }
  }
}
