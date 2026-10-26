import { Component, inject, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CookieConsentService, CookiePreferences } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.css'
})
export class CookiesComponent {
  public consentService = inject(CookieConsentService);

  // Cópia temporária para edição no modal
  public tempPrefs: CookiePreferences = { ...this.consentService.preferences() };

  // Controla acordeão de detalhes por categoria
  public expandedCategory = signal<string | null>(null);

  @HostListener('window:keydown.escape')
  public onEscape(): void {
    if (this.consentService.showModal()) {
      this.fecharAjustes();
    }
  }

  public aceitarTudo(): void {
    this.consentService.acceptAll();
  }

  public rejeitarTudo(): void {
    this.consentService.rejectAll();
  }

  public abrirAjustes(): void {
    // Sincroniza com as preferências atuais salvas
    this.tempPrefs = { ...this.consentService.preferences() };
    this.consentService.openPreferences();
  }

  public fecharAjustes(): void {
    this.consentService.closePreferences();
  }

  public salvarPreferencias(): void {
    this.consentService.savePreferences(this.tempPrefs);
  }

  public toggleCategoria(categoria: string): void {
    if (this.expandedCategory() === categoria) {
      this.expandedCategory.set(null);
    } else {
      this.expandedCategory.set(categoria);
    }
  }

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cookie-modal-overlay')) {
      this.fecharAjustes();
    }
  }
}
