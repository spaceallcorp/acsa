import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CMS_SITES, CmsSiteConfig, CmsSiteId } from '../models/cms-site.model';

@Injectable({
  providedIn: 'root',
})
export class CmsSiteService {
  readonly sites = CMS_SITES;

  private readonly activeSiteSubject = new BehaviorSubject<CmsSiteId>('ao');
  readonly activeSite$ = this.activeSiteSubject.asObservable();

  readonly activeSiteId = signal<CmsSiteId>('ao');

  readonly activeSiteConfig = computed<CmsSiteConfig>(() => {
    return this.sites.find((s) => s.id === this.activeSiteId()) ?? this.sites[0];
  });

  setActiveSite(siteId: CmsSiteId): void {
    if (this.activeSiteId() === siteId) return;
    this.activeSiteId.set(siteId);
    this.activeSiteSubject.next(siteId);
  }

  /** Sincroniza a operação activa a partir do nome de qualquer colecção Firestore */
  setActiveSiteByCollection(collectionName: string): void {
    const matched = this.sites.find((s) =>
      Object.values(s.collections).includes(collectionName as never)
    );
    if (matched) {
      this.setActiveSite(matched.id);
    }
  }

  getSiteConfig(siteId: CmsSiteId = this.activeSiteId()): CmsSiteConfig {
    return this.sites.find((s) => s.id === siteId) ?? this.sites[0];
  }

  getLayoutCollectionName(
    baseCollection:
      | 'navBarItems'
      | 'footerItems'
      | 'siteLogos'
      | 'socialMedia'
      | 'addresses'
      | 'partners'
      | 'heroSlider',
    siteId: CmsSiteId = 'ao'
  ): string {
    const site = this.getSiteConfig(siteId);
    return `${baseCollection}${site.suffix}`;
  }
}
