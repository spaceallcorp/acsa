import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import { ProductService } from '../../services/product.service';
import { Produto } from '../../models/products.model';
import { MenuComponent } from '../menu/menu.component';
import { RodapeComponent } from '../rodape/rodape.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuComponent,
    RodapeComponent,
    TranslateModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private titleService = inject(Title);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  private routeSub!: Subscription;
  private reloadTrigger$ = new BehaviorSubject<void>(undefined);

  productName: string = '';
  product: Produto | null = null;
  tooltipText = '';
  tooltipX = 0;
  tooltipY = 0;
  relatedProducts: Produto[] = [];
  isLoading = false;
  errorMessage = '';

  selectedFlag: string = 'img/bandeiras/ao.png';
  selectedLanguage: string = 'PT';

  constructor() {
    this.preloadFlags();
  }

  private preloadFlags() {
    ['ao', 'usa', 'fr'].forEach(flag => {
      new Image().src = `/img/bandeiras/${flag}.png`;
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.updateLanguageDisplay(language);
  }

  onLanguageChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.useLanguage(selectedValue);
  }


  onMetricMouseEnter(event: MouseEvent, metric: { title: string; value: string }): void {
  const formattedValue = this.formatBigNumber(metric.value, metric.title);
  const translatedText = this.translate.instant('metric_of', {
    title: metric.title,
    value: formattedValue
  });

  this.showTooltip(event, translatedText);
}
  get currentDescription(): string {
    if (!this.product) return '';
    const lang = (this.translate.currentLang || this.selectedLanguage || 'pt').toLowerCase();

    if (lang.includes('pt') && this.product.descriptionPT) {
      return this.product.descriptionPT;
    }
    if (lang.includes('fr') && this.product.descriptionFR) {
      return this.product.descriptionFR;
    }

    // Inglês é o default (.description)
    return this.product.description || this.product.descriptionPT || '';
  }

  private updateLanguageDisplay(language: string): void {
    if (language === 'pt') {
      this.selectedFlag = 'img/bandeiras/ao.png';
      this.selectedLanguage = 'PT';
    } else if (language === 'en') {
      this.selectedFlag = 'img/bandeiras/usa.png';
      this.selectedLanguage = 'EN';
    } else if (language === 'fr') {
      this.selectedFlag = 'img/bandeiras/fr.png';
      this.selectedLanguage = 'FR';
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    // Sincroniza idioma inicial e escuta mudanças vindas do MenuComponent
    const currentLang = this.translate.currentLang || 'pt';
    this.updateLanguageDisplay(currentLang);

    this.translate.onLangChange.subscribe(event => {
      this.updateLanguageDisplay(event.lang);
      this.cdr.detectChanges();
    });

    this.route.data.subscribe(data => {
      this.productName = data['productName'];
      this.titleService.setTitle(`${this.productName} - TelCables South Africa`);
    });

    this.routeSub = combineLatest([
      this.route.paramMap,
      this.reloadTrigger$
    ]).pipe(
      switchMap(([params, _]) => {
        this.isLoading = true;
        this.errorMessage = '';
        this.cdr.detectChanges();
        const id = params.get('id');

        if (!id) {
          throw new Error(this.translate.instant('error_not_found'));
        }

        return this.productService.getProducts().pipe(
          switchMap(products => [{ products, id }])
        );
      })
    ).subscribe({
      next: ({ products, id }) => {
        this.ngZone.run(() => {
          this.product = products.find(p => String(p.id) === id) || null;

          if (!this.product) {
            this.errorMessage = this.translate.instant('error_not_found');
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
          }

          this.relatedProducts = products
            .filter(p =>
              p.id !== this.product?.id &&
              (p.productCategory === this.product?.productCategory ||
                p.productSector === this.product?.productSector)
            )
            .slice(0, 4);

          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('Error loading product:', error);
          this.errorMessage = error.message || this.translate.instant('error_load_failed');
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  loadProduct(): void {
    this.reloadTrigger$.next();
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  formatBigNumber(value?: string, title?: string): string {
    if (!value) {
      return 'N/A';
    }
    const titleLower = title?.toLowerCase() || '';
    if ((titleLower.includes('percent') || titleLower.includes('%') || titleLower.includes('taxa') || titleLower.includes('uptime')) && !value.includes('%')) {
      return `${value}%`;
    }
    return value;
  }

  getBigNumberIcon(title: string, index: number): string {
    const iconMap: { [key: string]: string } = {
      'clientes': '👥',
      'usuários': '👤',
      'vendas': '💰',
      'receita': '💵',
      'uptime': '⏱️',
      'disponibilidade': '🟢',
      'performance': '⚡',
      'escalabilidade': '📊'
    };

    const titleLower = title.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (titleLower.includes(key)) return icon;
    }

    const defaultIcons = ['📈', '🚀', '🌍', '⚡', '🎯', '💎', '🔧', '⭐'];
    return defaultIcons[index % defaultIcons.length];
  }

  getBigNumberTrend(title: string, value: number): string {
    if (value > 10000) return `🚀 ${this.translate.instant('trend_exceptional')}`;
    if (value > 5000) return `📈 ${this.translate.instant('trend_accelerated')}`;
    if (value > 1000) return `✅ ${this.translate.instant('trend_excellent')}`;
    if (value > 500) return `👍 ${this.translate.instant('trend_good')}`;
    if (value > 100) return `📊 ${this.translate.instant('trend_positive')}`;
    return `💪 ${this.translate.instant('trend_developing')}`;
  }

  getShortDescription(description?: string): string {
    if (!description) return '';
    return description.length > 180 ? description.substring(0, 180) + '...' : description;
  }

  scrollToContent(): void {
    const element = document.querySelector('.product-detail-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  showTooltip(event: MouseEvent, text: string): void {
    this.tooltipText = text;
    this.tooltipX = event.clientX + 15;
    this.tooltipY = event.clientY + 15;

    setTimeout(() => {
      if (this.tooltipText === text) this.hideTooltip();
    }, 2000);
  }

  hideTooltip(): void {
    this.tooltipText = '';
  }

  navigateToProduct(id: number | string): void {
    this.router.navigate(['/product', id]);
  }

  trackByProductId(index: number, item: Produto): number | string {
    return item.id;
  }

  handleImageError(event: any): void {
    event.target.src = '/assets/images/placeholder-product.jpg';
  }

  openContactForm(): void {
    this.router.navigate(['/contact']);
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.product?.name || 'Produto');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}`, '_blank');
  }

  shareOnTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Confira ${this.product?.name} - ${this.product?.description?.substring(0, 100)}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareOnLinkedIn(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.product?.name || 'Produto');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showTooltipMessage(this.translate.instant('link_copied_success'));
    }).catch(() => {
      this.showTooltipMessage(this.translate.instant('link_copied_error'));
    });
  }

  private showTooltipMessage(message: string): void {
    const tempTooltip = document.createElement('div');
    tempTooltip.textContent = message;
    tempTooltip.style.position = 'fixed';
    tempTooltip.style.bottom = '20px';
    tempTooltip.style.right = '20px';
    tempTooltip.style.backgroundColor = '#28C1FD';
    tempTooltip.style.color = '#03121f';
    tempTooltip.style.padding = '12px 24px';
    tempTooltip.style.borderRadius = '12px';
    tempTooltip.style.zIndex = '10000';
    tempTooltip.style.fontWeight = 'bold';
    document.body.appendChild(tempTooltip);

    setTimeout(() => tempTooltip.remove(), 2000);
  }
}