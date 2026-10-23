import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
  addDoc
} from '@angular/fire/firestore';

import { Produto } from '../models/products.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'productsGlobal');

  /** LISTAR TODOS OS PRODUTOS */
  getProducts(): Observable<Produto[]> {
    return collectionData(this.productsCollection, { idField: 'id' }).pipe(
      map(products =>
        products.map(doc => {
          const data = doc as any;
          return {
            ...data,
            description: data.description ?? '',
            descriptionPT: data.descriptionPT ?? data.descriptionPt ?? data.description_pt ?? '',
            descriptionFR: data.descriptionFR ?? data.descriptionFr ?? data.description_fr ?? data.productdescriptionFR ?? ''
          } as Produto;
        })
      )
    );
  }

  /** ATUALIZAR / SALVAR PRODUTO */
  async updateProduct(id: string, partial: Partial<Produto>): Promise<void> {
    const productDocRef = doc(this.firestore, `productsGlobal/${id}`);
    await setDoc(productDocRef, partial, { merge: true });
  }

  /** CRIAR PRODUTO */
  async createProduct(product: Produto): Promise<void> {
    const { id, ...data } = product;
    
    const sanitizedName = product.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');
    
    if (!sanitizedName) {
      throw new Error('O nome do produto é inválido para gerar o ID');
    }
    
    const productDocRef = doc(this.productsCollection, sanitizedName);
    await setDoc(productDocRef, data);
  }

  /** DELETAR PRODUTO */
  async deleteProduct(id: string): Promise<void> {
    const productDoc = doc(this.firestore, `productsGlobal/${id}`);
    return deleteDoc(productDoc);
  }
}