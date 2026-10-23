import { Component, inject } from '@angular/core';
import { Produto } from '../../models/products.model';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  
} from '@angular/forms';
import { ProductService } from '../../services/product.service';

// Define the Metric type
interface ProdutoMetric {
  title: string;
  value: string;
}

@Component({
  selector: 'app-produto-criar',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './produto-criar.component.html',
  styleUrl: './produto-criar.component.css',
})
export class ProdutoCriarComponent {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductService);
  
  loading = false;

  // Fixed form definition - removed the invalid metrics declaration
  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    descriptionPT: [''],
    descriptionFR: [''],
    metrics: this.fb.array([]), // Fixed: was incorrectly declared
    features: this.fb.array([]),
    coverUrl: [''],
    featuredImageUrl: [''],
    ctaText: [''],
    ctaUrl: [''],
    productGuideUrl: [''],
    productSector: [''],
    productCategory: ['']
  });

  /* =====================================================
     GETTERS
  ===================================================== */

  get metrics(): FormArray {
    return this.form.get('metrics') as FormArray;
  }

  get features(): FormArray {
    return this.form.get('features') as FormArray;
  }

  /* =====================================================
     METRICS
  ===================================================== */

  addMetric(): void {
    const metricGroup = this.fb.group({
      title: ['', Validators.required],
      value: [0, Validators.required]
    });
    this.metrics.push(metricGroup);
  }

  removeMetric(index: number): void {
    this.metrics.removeAt(index);
  }

  /* =====================================================
     FEATURES
  ===================================================== */

  addFeature(): void {
    this.features.push(
      this.fb.control('', Validators.required)
    );
  }

  removeFeature(index: number): void {
    this.features.removeAt(index);
  }

  /* =====================================================
     SUBMIT
  ===================================================== */

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formValue = this.form.value;

    const product: Produto = {
      id: Date.now(),
      name: formValue.name || '',
      description: formValue.description || '',
      descriptionPT: formValue.descriptionPT || '',
      descriptionFR: formValue.descriptionFR || '',
      metrics: (formValue.metrics || []) as ProdutoMetric[], // Fixed type
      features: (formValue.features || []) as string[],
      coverUrl: formValue.coverUrl || '',
      featuredImageUrl: formValue.featuredImageUrl || '',
      ctaText: formValue.ctaText || '',
      ctaUrl: formValue.ctaUrl || '',
      productGuideUrl: formValue.productGuideUrl || '',
      productSector: formValue.productSector || '',
      productCategory: formValue.productCategory || ''
    };

    try {
      await this.productsService.createProduct(product);
      console.log('Produto criado com sucesso');
      this.resetForm();
    } catch (err) {
      console.error('Erro ao criar produto:', err);
    } finally {
      this.loading = false;
    }
  }

  /* =====================================================
     RESET
  ===================================================== */

  resetForm(): void {
    this.form.reset({
      name: '',
      description: '',
      descriptionPT: '',
      descriptionFR: '',
      coverUrl: '',
      featuredImageUrl: '',
      productGuideUrl: '',
      ctaText: '',
      ctaUrl: '',
      productSector: '',
      productCategory: ''
    });

    // Clear metrics array
    while (this.metrics.length) {
      this.metrics.removeAt(0);
    }

    // Clear features array
    while (this.features.length) {
      this.features.removeAt(0);
    }
  }
}