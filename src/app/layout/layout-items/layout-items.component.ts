// layout-items.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { LayoutItemsService } from '../../services/layout-items.service';
import {
  navBarItems,
  footerItems,
  siteLogos,
  socialMedia,
  addresses,
  partners,
  heroSlider,
  NavLink
} from '../../models/layout-items.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-items',
  templateUrl: './layout-items.component.html',
  styleUrls: ['./layout-items.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LayoutItemsComponent implements OnInit, OnDestroy {
  // Active tab management
  activeTab: string = 'navbar';
  
  // Observables for each section
  navItems$: Observable<navBarItems[]> = new Observable<navBarItems[]>();
  footerItems$: Observable<footerItems[]> = new Observable<footerItems[]>();
  siteLogos$: Observable<siteLogos[]> = new Observable<siteLogos[]>();
  socialMedia$: Observable<socialMedia[]> = new Observable<socialMedia[]>();
  addresses$: Observable<addresses[]> = new Observable<addresses[]>();
  partners$: Observable<partners[]> = new Observable<partners[]>();
  heroSlides$: Observable<heroSlider[]> = new Observable<heroSlider[]>();
  
  // Form groups
  navForm!: FormGroup; // Mudado para ! pois a inicialização real ocorre em initForms()
  footerForm!: FormGroup;
  logosForm!: FormGroup;
  socialForm!: FormGroup;
  addressesForm!: FormGroup;
  partnersForm!: FormGroup;
  heroForm!: FormGroup;
  
  // IDs de Edição
  editingNavId: string | null | undefined = null;
  editingFooterId: string | null | undefined = null;
  editingLogosId: string | null | undefined = null;
  editingSocialId: string | null | undefined = null;
  editingAddressId: string | null | undefined = null;
  editingPartnerId: string | null | undefined = null;
  editingHeroId: string | null | undefined = null;
  
  // Loading states
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Configuração das Abas (Tabs)
// Configuração das Abas (Tabs) com os respetivos ícones
  tabs = [
    { id: 'navbar', label: 'Navbar Items', icon: '📁' },
    { id: 'footer', label: 'Footer Items', icon: '👣' },
    { id: 'logos', label: 'Site Logos', icon: '🖼️' },
    { id: 'social', label: 'Social Media', icon: '🌐' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'partners', label: 'Partners', icon: '🤝' },
    { id: 'hero', label: 'Hero Slider', icon: '⚡' }
  ];

  constructor(
    private fb: FormBuilder,
    private layoutService: LayoutItemsService
  ) {
    // Inicialização preventiva básica
    this.createBlankForms();
  }

  ngOnInit(): void {
    // Inicializa os formulários com as estruturas corretas ANTES de ler dados
    this.initForms();

    // Initialize observables vindos do serviço Firestore
    this.navItems$ = this.layoutService.getNavBarItems();
    this.footerItems$ = this.layoutService.getFooterItems();
    this.siteLogos$ = this.layoutService.getSiteLogos();
    this.socialMedia$ = this.layoutService.getSocialMedia();
    this.addresses$ = this.layoutService.getAddresses();
    this.partners$ = this.layoutService.getPartners();
    this.heroSlides$ = this.layoutService.getHeroSlides();
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createBlankForms(): void {
    this.navForm = this.fb.group({});
    this.footerForm = this.fb.group({});
    this.logosForm = this.fb.group({});
    this.socialForm = this.fb.group({});
    this.addressesForm = this.fb.group({});
    this.partnersForm = this.fb.group({});
    this.heroForm = this.fb.group({});
  }

  private initForms(): void {
    // ⭐ FIX: NavBar Form agora possui a estrutura idêntica exigida pelo HTML
    this.navForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      link: [''],
      order: [1, [Validators.required, Validators.min(1)]],
      items: this.fb.array([]) // O FormArray que estava a causar o crash por ausência
    });

    // Footer Form
    this.footerForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      link: ['', [Validators.required]]
    });

    // Site Logos Form
    this.logosForm = this.fb.group({
      navbarLogoUrl: ['', [Validators.required]],
      footerLogoUrl: ['', [Validators.required]],
      mobileLogoUrl: ['', [Validators.required]]
    });

    // Social Media Form
    this.socialForm = this.fb.group({
      title: ['', [Validators.required]],
      link: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });

    // Address Form
    this.addressesForm = this.fb.group({
      title: ['', [Validators.required]],
      addressName: ['', [Validators.required]],
      phone: [''],
      contactEmail: ['', [Validators.required, Validators.email]]
    });

    // Partner Form
    this.partnersForm = this.fb.group({
      partnersLogo: ['', [Validators.required]],
      partnerUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });

    // Hero Slider Form
    this.heroForm = this.fb.group({
  imageUrl: [''], // Continua obrigatório, agindo como Fallback/Poster
  videoUrl: [''],                        // Opcional, sem validadores estritos
  title: ['', [Validators.required]],
  subtitle: ['', [Validators.required]],
  ctaBtnText: ['', [Validators.required]],
  ctaUrl: ['', [Validators.required]],
  ctaBtn2Text: ['', [Validators.required]],
  cta2Url: ['', [Validators.required]],
  upEventImageUrl: [''], // Novo campo para a imagem do evento
  upEventUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  // ==================== TAB MANAGEMENT ====================
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
    this.resetAllForms();
  }

  // ==================== NAVBAR METHODS ====================

  get subItemsFormArray(): FormArray {
    return this.navForm.get('items') as FormArray;
  }

  private createSubItemGroup(subItem?: NavLink): FormGroup {
    return this.fb.group({
      title: [subItem ? subItem.title : '', [Validators.required]],
      link: [subItem ? subItem.link : '', [Validators.required]]
    });
  }

  addSubItem(): void {
    if (this.subItemsFormArray) {
      this.subItemsFormArray.push(this.createSubItemGroup());
    }
  }

  removeSubItem(index: number): void {
    if (this.subItemsFormArray) {
      this.subItemsFormArray.removeAt(index);
    }
  }
  
  resetNavForm(): void {
    this.navForm.reset({
      title: '',
      link: '',
      order: 1
    });
    if (this.subItemsFormArray) {
      this.subItemsFormArray.clear();
    }
    this.editingNavId = null;
  }

  onSubmitNav(): void {
    if (this.navForm.invalid) {
      this.markFormGroupTouched(this.navForm);
      return;
    }

    this.loading = true;
    const categoryData = this.navForm.value;

    if (this.editingNavId) {
      this.layoutService.updateNavBarItem(this.editingNavId, categoryData)
        .then(() => {
          this.showSuccess('Navbar architecture updated successfully!');
          this.resetNavForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    } else {
      this.layoutService.addNavBarItem(categoryData)
        .then(() => {
          this.showSuccess('Navbar category added successfully!');
          this.resetNavForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  editNavItem(item: navBarItems): void {
    this.editingNavId = item.id;
    
    this.navForm.patchValue({
      title: item.title,
      link: item.link || '',
      order: item.order || 1
    });

    if (this.subItemsFormArray) {
      this.subItemsFormArray.clear();
      if (item.items && item.items.length > 0) {
        item.items.forEach((subItem: NavLink) => {
          this.subItemsFormArray.push(this.createSubItemGroup(subItem));
        });
      }
    }

    const formElement = document.getElementById('navForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  deleteNavItem(id: string): void {
    if (confirm('Are you sure you want to delete this category and all its internal links?')) {
      this.loading = true;
      this.layoutService.deleteNavBarItem(id)
        .then(() => {
          this.showSuccess('Navbar architecture item removed!');
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  // ==================== FOOTER METHODS ====================
  
  resetFooterForm(): void {
    this.footerForm.reset();
    this.editingFooterId = null;
  }

  onSubmitFooter(): void {
    if (this.footerForm.invalid) {
      this.markFormGroupTouched(this.footerForm);
      return;
    }

    this.loading = true;
    const footerItem = this.footerForm.value;

    if (this.editingFooterId) {
      this.layoutService.updateFooterItem(this.editingFooterId, footerItem)
        .then(() => {
          this.showSuccess('Footer item updated successfully!');
          this.resetFooterForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    } else {
      this.layoutService.addFooterItem(footerItem)
        .then(() => {
          this.showSuccess('Footer item added successfully!');
          this.resetFooterForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  editFooterItem(item: footerItems): void {
    this.editingFooterId = item.id;
    this.footerForm.patchValue({
      title: item.title,
      link: item.link
    });
  }

  deleteFooterItem(id: string): void {
    if (confirm('Are you sure you want to delete this footer item?')) {
      this.loading = true;
      this.layoutService.deleteFooterItem(id)
        .then(() => {
          this.showSuccess('Footer item deleted successfully!');
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  // ==================== SITE LOGOS METHODS ====================
  
  resetLogosForm(): void {
    this.logosForm.reset();
    this.editingLogosId = null;
  }

  onSubmitLogos(): void {
    if (this.logosForm.invalid) {
      this.markFormGroupTouched(this.logosForm);
      return;
    }

    this.loading = true;
    const logos = this.logosForm.value;

    if (this.editingLogosId) {
      this.layoutService.updateSiteLogos(this.editingLogosId, logos)
        .then(() => {
          this.showSuccess('Site logos updated successfully!');
          this.resetLogosForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    } else {
      this.layoutService.addSiteLogos(logos)
        .then(() => {
          this.showSuccess('Site logos added successfully!');
          this.resetLogosForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  editLogosItem(item: siteLogos): void {
    this.editingLogosId = item.id;
    this.logosForm.patchValue({
      navbarLogoUrl: item.navbarLogoUrl,
      footerLogoUrl: item.footerLogoUrl,
      mobileLogoUrl: item.mobileLogoUrl
    });
  }

  deleteLogosItem(id: string): void {
    if (confirm('Are you sure you want to delete these site logos?')) {
      this.loading = true;
      this.layoutService.deleteSiteLogos(id)
        .then(() => {
          this.showSuccess('Site logos deleted successfully!');
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  // ==================== SOCIAL MEDIA METHODS ====================
  
  resetSocialForm(): void {
    this.socialForm.reset();
    this.editingSocialId = null;
  }

  onSubmitSocial(): void {
    if (this.socialForm.invalid) {
      this.markFormGroupTouched(this.socialForm);
      return;
    }

    this.loading = true;
    const socialItem = this.socialForm.value;

    if (this.editingSocialId) {
      this.layoutService.updateSocialMedia(this.editingSocialId, socialItem)
        .then(() => {
          this.showSuccess('Social media item updated successfully!');
          this.resetSocialForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    } else {
      this.layoutService.addSocialMedia(socialItem)
        .then(() => {
          this.showSuccess('Social media item added successfully!');
          this.resetSocialForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  editSocialItem(item: socialMedia): void {
    this.editingSocialId = item.id;
    this.socialForm.patchValue({
      title: item.title,
      link: item.link
    });
  }

  deleteSocialItem(id: string): void {
    if (confirm('Are you sure you want to delete this social media item?')) {
      this.loading = true;
      this.layoutService.deleteSocialMedia(id)
        .then(() => {
          this.showSuccess('Social media item deleted successfully!');
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  // ==================== ADDRESS METHODS ====================
  
  resetAddressForm(): void {
    this.addressesForm.reset();
    this.editingAddressId = null;
  }

  onSubmitAddress(): void {
    if (this.addressesForm.invalid) {
      this.markFormGroupTouched(this.addressesForm);
      return;
    }

    this.loading = true;
    const address = this.addressesForm.value;

    if (this.editingAddressId) {
      this.layoutService.updateAddress(this.editingAddressId, address)
        .then(() => {
          this.showSuccess('Address updated successfully!');
          this.resetAddressForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    } else {
      this.layoutService.addAddress(address)
        .then(() => {
          this.showSuccess('Address added successfully!');
          this.resetAddressForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  editAddressItem(item: addresses): void {
    this.editingAddressId = item.id;
    this.addressesForm.patchValue({
      title: item.title,
      addressName: item.addressName,
      phone: item.phone || '',
      contactEmail: item.contactEmail
    });
  }

  deleteAddressItem(id: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.loading = true;
      this.layoutService.deleteAddress(id)
        .then(() => {
          this.showSuccess('Address deleted successfully!');
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  // ==================== PARTNER METHODS ====================
  
  resetPartnerForm(): void {
    this.partnersForm.reset();
    this.editingPartnerId = null;
  }

  onSubmitPartner(): void {
    if (this.partnersForm.invalid) {
      this.markFormGroupTouched(this.partnersForm);
      return;
    }

    this.loading = true;
    const partner = this.partnersForm.value;

    if (this.editingPartnerId) {
      this.layoutService.updatePartner(this.editingPartnerId, partner)
        .then(() => {
          this.showSuccess('Partner updated successfully!');
          this.resetPartnerForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    } else {
      this.layoutService.addPartner(partner)
        .then(() => {
          this.showSuccess('Partner added successfully!');
          this.resetPartnerForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  editPartnerItem(item: partners): void {
    this.editingPartnerId = item.id || null;
    this.partnersForm.patchValue({
      partnersLogo: item.partnersLogo,
      partnerUrl: item.partnerUrl
    });
  }

  deletePartnerItem(id: string): void {
    if (confirm('Are you sure you want to delete this partner?')) {
      this.loading = true;
      this.layoutService.deletePartner(id)
        .then(() => {
          this.showSuccess('Partner deleted successfully!');
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  // ==================== HERO SLIDER METHODS ====================
  
  resetHeroForm(): void {
    this.heroForm.reset();
    this.editingHeroId = null;
  }


  onSubmitHero(): void {
    if (this.heroForm.invalid) {
      this.markFormGroupTouched(this.heroForm);
      return;
    }

    this.loading = true;
    const slide = this.heroForm.value;

    if (this.editingHeroId) {
      this.layoutService.updateHeroSlide(this.editingHeroId, slide)
        .then(() => {
          this.showSuccess('Hero slide updated successfully!');
          this.resetHeroForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    } else {
      this.layoutService.addHeroSlide(slide)
        .then(() => {
          this.showSuccess('Hero slide added successfully!');
          this.resetHeroForm();
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  editHeroItem(item: heroSlider): void {
    this.editingHeroId = item.id;
    this.heroForm.patchValue({
      imageUrl: item.imageUrl,
      title: item.title,
      subtitle: item.subtitle,
      ctaBtnText: item.ctaBtnText,
      ctaUrl: item.ctaUrl,
      ctaBtn2Text: item.ctaBtn2Text,
      cta2Url: item.cta2Url,
      upEventImageUrl: item.upEventImageUrl,
      upEventUrl: item.upEventUrl,

       videoUrl: item.videoUrl || '',
      posterUrl: item.posterUrl || ''
      
    });
  }

  deleteHeroItem(id: string): void {
    if (confirm('Are you sure you want to delete this hero slide?')) {
      this.loading = true;
      this.layoutService.deleteHeroSlide(id)
        .then(() => {
          this.showSuccess('Hero slide deleted successfully!');
          this.loading = false;
        })
        .catch(error => {
          this.handleError(error);
          this.loading = false;
        });
    }
  }

  // ==================== UTILITY METHODS ====================
  
  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    this.errorMessage = error.message || 'An error occurred. Please try again.';
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  private resetAllForms(): void {
    this.resetNavForm();
    this.resetFooterForm();
    this.resetLogosForm();
    this.resetSocialForm();
    this.resetAddressForm();
    this.resetPartnerForm();
    this.resetHeroForm();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getSocialIcon(platform: string): string {
    const icons: { [key: string]: string } = {
      'facebook': '📘',
      'twitter': '🐦',
      'instagram': '📷',
      'linkedin': '🔗',
      'youtube': '📺',
      'whatsapp': '💬',
      'tiktok': '🎵'
    };
    return icons[platform.toLowerCase()] || '🌐';
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}