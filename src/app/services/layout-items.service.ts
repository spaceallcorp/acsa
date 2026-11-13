// layout-items.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  navBarItems,
  footerItems,
  siteLogos,
  socialMedia,
  addresses,

  heroSlider,
  partners,
  
} from '../models/layout-items.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutItemsService {
  constructor(private firestore: Firestore) {}

  // ==================== NAVIGATION BAR ====================
  
  getNavBarItems(): Observable<navBarItems[]> {
    const navBarCollection = collection(this.firestore, 'navBarItems');
    return collectionData(navBarCollection, { idField: 'id' }) as Observable<navBarItems[]>;
  }

  addNavBarItem(item: navBarItems) {
    const navBarCollection = collection(this.firestore, 'navBarItems');
    return addDoc(navBarCollection, item);
  }

  updateNavBarItem(id: string, item: Partial<navBarItems>) {
    const navBarDocRef = doc(this.firestore, `navBarItems/${id}`);
    return updateDoc(navBarDocRef, item);
  }

  deleteNavBarItem(id: string) {
    const navBarDocRef = doc(this.firestore, `navBarItems/${id}`);
    return deleteDoc(navBarDocRef);
  }

  // ==================== FOOTER ====================
  
  getFooterItems(): Observable<footerItems[]> {
    const footerCollection = collection(this.firestore, 'footerItems');
    return collectionData(footerCollection, { idField: 'id' }) as Observable<footerItems[]>;
  }

  addFooterItem(item: footerItems) {
    const footerCollection = collection(this.firestore, 'footerItems');
    return addDoc(footerCollection, item);
  }

  updateFooterItem(id: string, item: Partial<footerItems>) {
    const footerDocRef = doc(this.firestore, `footerItems/${id}`);
    return updateDoc(footerDocRef, item);
  }

  deleteFooterItem(id: string) {
    const footerDocRef = doc(this.firestore, `footerItems/${id}`);
    return deleteDoc(footerDocRef);
  }

  // ==================== SITE LOGOS ====================
  
  getSiteLogos(): Observable<siteLogos[]> {
    const logosCollection = collection(this.firestore, 'siteLogos');
    return collectionData(logosCollection, { idField: 'id' }) as Observable<siteLogos[]>;
  }

  addSiteLogos(item: siteLogos) {
    const logosCollection = collection(this.firestore, 'siteLogos');
    return addDoc(logosCollection, item);
  }

  updateSiteLogos(id: string, item: Partial<siteLogos>) {
    const logosDocRef = doc(this.firestore, `siteLogos/${id}`);
    return updateDoc(logosDocRef, item);
  }

  deleteSiteLogos(id: string) {
    const logosDocRef = doc(this.firestore, `siteLogos/${id}`);
    return deleteDoc(logosDocRef);
  }

  // ==================== SOCIAL MEDIA ====================
  
  getSocialMedia(): Observable<socialMedia[]> {
    const socialCollection = collection(this.firestore, 'socialMedia');
    return collectionData(socialCollection, { idField: 'id' }) as Observable<socialMedia[]>;
  }

  addSocialMedia(item: socialMedia) {
    const socialCollection = collection(this.firestore, 'socialMedia');
    return addDoc(socialCollection, item);
  }

  updateSocialMedia(id: string, item: Partial<socialMedia>) {
    const socialDocRef = doc(this.firestore, `socialMedia/${id}`);
    return updateDoc(socialDocRef, item);
  }

  deleteSocialMedia(id: string) {
    const socialDocRef = doc(this.firestore, `socialMedia/${id}`);
    return deleteDoc(socialDocRef);
  }

  // ==================== ADDRESSES ====================
  
  getAddresses(): Observable<addresses[]> {
    const addressesCollection = collection(this.firestore, 'addresses');
    return collectionData(addressesCollection, { idField: 'id' }) as Observable<addresses[]>;
  }

  addAddress(item: addresses) {
    const addressesCollection = collection(this.firestore, 'addresses');
    return addDoc(addressesCollection, item);
  }

  updateAddress(id: string, item: Partial<addresses>) {
    const addressDocRef = doc(this.firestore, `addresses/${id}`);
    return updateDoc(addressDocRef, item);
  }

  deleteAddress(id: string) {
    const addressDocRef = doc(this.firestore, `addresses/${id}`);
    return deleteDoc(addressDocRef);
  }

  // ==================== PARTNERS (addres interface) ====================
  
  getPartners(): Observable<partners[]> {
    const partnersCollection = collection(this.firestore, 'partners');
    return collectionData(partnersCollection, { idField: 'id' }) as Observable<partners[]>;
  }

  addPartner(item: partners) {
    const partnersCollection = collection(this.firestore, 'partners');
    return addDoc(partnersCollection, item);
  }

  updatePartner(id: string, item: Partial<partners>) {
    const partnerDocRef = doc(this.firestore, `partners/${id}`);
    return updateDoc(partnerDocRef, item);
  }

  deletePartner(id: string) {
    const partnerDocRef = doc(this.firestore, `partners/${id}`);
    return deleteDoc(partnerDocRef);
  }

  // ==================== HERO SLIDER ====================
  
  getHeroSlides(): Observable<heroSlider[]> {
    const heroCollection = collection(this.firestore, 'heroSlider');
    return collectionData(heroCollection, { idField: 'id' }) as Observable<heroSlider[]>;
  }

  addHeroSlide(item: heroSlider) {
    const heroCollection = collection(this.firestore, 'heroSlider');
    return addDoc(heroCollection, item);
  }

  updateHeroSlide(id: string, item: Partial<heroSlider>) {
    const heroDocRef = doc(this.firestore, `heroSlider/${id}`);
    return updateDoc(heroDocRef, item);
  }

  deleteHeroSlide(id: string) {
    const heroDocRef = doc(this.firestore, `heroSlider/${id}`);
    return deleteDoc(heroDocRef);
  }
}
