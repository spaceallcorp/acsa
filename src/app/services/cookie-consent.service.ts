import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

export interface CookiePreferences {
  essenciais: boolean;
  analiticos: boolean;
  funcionais: boolean;
  marketing: boolean;
  dataConsentimento?: string;
  versao: string;
}

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  essenciais: true,
  analiticos: false,
  funcionais: true,
  marketing: false,
  versao: '2.0'
};

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private cookieService = inject(CookieService);
  private platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  public readonly COOKIE_NAME = 'cookie-consent';
  public readonly COOKIE_EXPIRY_DAYS = 365;

  public hasConsent = signal<boolean>(false);
  public showBanner = signal<boolean>(false);
  public showModal = signal<boolean>(false);
  public preferences = signal<CookiePreferences>({ ...DEFAULT_COOKIE_PREFERENCES });

  constructor() {
    this.initConsent();
  }

  /**
   * Inicializa o estado de consentimento a partir do cookie salvo ou exibe o banner.
   */
  public initConsent(): void {
    if (!this.isBrowser) return;

    if (this.cookieService.check(this.COOKIE_NAME)) {
      try {
        const raw = this.cookieService.get(this.COOKIE_NAME);
        const parsed: CookiePreferences = JSON.parse(raw);

        const merged: CookiePreferences = {
          ...DEFAULT_COOKIE_PREFERENCES,
          ...parsed,
          essenciais: true // Sempre verdadeiro
        };

        this.preferences.set(merged);
        this.hasConsent.set(true);
        this.showBanner.set(false);
        this.applyConsent(merged);
      } catch (err) {
        console.warn('Falha ao processar cookie de consentimento anterior, redefinindo.', err);
        this.showBanner.set(true);
        this.applyConsent(DEFAULT_COOKIE_PREFERENCES);
      }
    } else {
      this.showBanner.set(true);
      this.applyConsent(DEFAULT_COOKIE_PREFERENCES);
    }
  }

  /**
   * Aceita todos os tipos de cookies.
   */
  public acceptAll(): void {
    const allAccepted: CookiePreferences = {
      essenciais: true,
      analiticos: true,
      funcionais: true,
      marketing: true,
      dataConsentimento: new Date().toISOString(),
      versao: '2.0'
    };

    this.persist(allAccepted);
  }

  /**
   * Rejeita todos os cookies não-essenciais.
   */
  public rejectAll(): void {
    const allRejected: CookiePreferences = {
      essenciais: true,
      analiticos: false,
      funcionais: false,
      marketing: false,
      dataConsentimento: new Date().toISOString(),
      versao: '2.0'
    };

    this.persist(allRejected);
  }

  /**
   * Salva preferências personalizadas do utilizador.
   */
  public savePreferences(userPrefs: Partial<CookiePreferences>): void {
    const updated: CookiePreferences = {
      ...this.preferences(),
      ...userPrefs,
      essenciais: true,
      dataConsentimento: new Date().toISOString(),
      versao: '2.0'
    };

    this.persist(updated);
  }

  /**
   * Abre o modal de personalização de cookies.
   */
  public openPreferences(): void {
    this.showModal.set(true);
  }

  /**
   * Fecha o modal de personalização de cookies.
   */
  public closePreferences(): void {
    this.showModal.set(false);
  }

  /**
   * Reabre o banner principal.
   */
  public openBanner(): void {
    this.showBanner.set(true);
  }

  /**
   * Fecha o banner principal sem alterar consentimento.
   */
  public closeBanner(): void {
    this.showBanner.set(false);
  }

  /**
   * Persiste as preferências no cookie, aplica consentimento dinâmico e atualiza signals.
   */
  private persist(prefs: CookiePreferences): void {
    if (!this.isBrowser) return;

    try {
      const isHttps = window.location.protocol === 'https:';
      const json = JSON.stringify(prefs);

      this.cookieService.set(
        this.COOKIE_NAME,
        json,
        this.COOKIE_EXPIRY_DAYS,
        '/',
        undefined,
        isHttps,
        'Lax'
      );

      this.preferences.set(prefs);
      this.hasConsent.set(true);
      this.showBanner.set(false);
      this.showModal.set(false);

      this.applyConsent(prefs);
    } catch (e) {
      console.error('Erro ao guardar preferências de cookies:', e);
    }
  }

  /**
   * Aplica efetivamente o consentimento:
   * - Google Consent Mode v2 (analytics_storage, ad_storage, ad_user_data, ad_personalization)
   * - Expurgamento de cookies de rastreio caso analíticos/marketing tenham sido revogados.
   */
  private applyConsent(prefs: CookiePreferences): void {
    if (!this.isBrowser) return;

    // Atualiza Google Consent Mode v2
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: prefs.analiticos ? 'granted' : 'denied',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        ad_user_data: prefs.marketing ? 'granted' : 'denied',
        ad_personalization: prefs.marketing ? 'granted' : 'denied'
      });
    }

    // Se analíticos foram desativados, limpa cookies gerados pelo GA/GTM
    if (!prefs.analiticos) {
      this.purgeCookies([
        '_ga',
        '_gid',
        '_gat',
        '_gat_gtag_G_BYYG8XM67X',
        '_ga_BYYG8XM67X'
      ]);
    }

    // Se marketing foi desativado, limpa cookies de publicidade
    if (!prefs.marketing) {
      this.purgeCookies([
        '_fbp',
        '_gcl_au',
        '_pin_unauth',
        'IDE',
        'test_cookie'
      ]);
    }
  }

  /**
   * Remove ativamente cookies revogados no domínio atual e no domínio raiz.
   */
  private purgeCookies(cookieNames: string[]): void {
    if (!this.isBrowser || !document.cookie) return;

    const hostname = window.location.hostname;
    const domainParts = hostname.split('.');
    const rootDomain = domainParts.length > 2
      ? `.${domainParts.slice(-3).join('.')}`
      : `.${hostname}`;

    // Também pesquisa padrões (ex: _ga_*)
    const existingCookies = this.cookieService.getAll();
    const allKeys = Object.keys(existingCookies);

    cookieNames.forEach(name => {
      this.deleteFromAllScopes(name, hostname, rootDomain);
    });

    allKeys.forEach(key => {
      if (key.startsWith('_ga_') || key.startsWith('_gcl_')) {
        this.deleteFromAllScopes(key, hostname, rootDomain);
      }
    });
  }

  private deleteFromAllScopes(name: string, hostname: string, rootDomain: string): void {
    try {
      this.cookieService.delete(name, '/');
      this.cookieService.delete(name, '/', hostname);
      this.cookieService.delete(name, '/', rootDomain);

      // Limpeza manual fallback via document.cookie com data expirada
      const expired = '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `${name}${expired}`;
      document.cookie = `${name}${expired} domain=${hostname};`;
      document.cookie = `${name}${expired} domain=${rootDomain};`;
    } catch {
      // Ignora erros de remoção de cookies protegidos pelo navegador
    }
  }
}

