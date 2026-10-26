import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-rodape',
  imports: [ TranslatePipe, CommonModule, RouterLink],
  templateUrl: './rodape.component.html',
  styleUrl: './rodape.component.css'
})
export class RodapeComponent {
  private cookieConsent = inject(CookieConsentService);

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  openCookieSettings(): void {
    this.cookieConsent.openPreferences();
  }

  constructor(private translate: TranslateService) {}
}
