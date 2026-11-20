import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';

import { TranslateService, TranslatePipe } from '@ngx-translate/core'; // Inserido
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-artigo-postar',
  standalone: true,
  // Adição de TranslatePipe aos imports
  imports: [FormsModule, CommonModule, EditorModule,], // Inserido
  templateUrl: './artigo-postar.component.html',
  styleUrls: ['./artigo-postar.component.css']
})
export class ArtigoPostarComponent {
  tinymceApiKey: string = environment.tinymce?.apiKey || '';

  // Data models
  editorContent: string = '';
  author: string = '';
  featuredImageUrl: string = '';
  newPost = {
    title: '',
    author: '',
  };

  isSubmitting = false;
  errorMessage = '';

  // TinyMCE config
  editorConfig = {
    height: 400,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
      'media', 'table', 'emoticons', 'help'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help'
  };

  private firestore = inject(Firestore);
  private router = inject(Router);
  private translate = inject(TranslateService); // Inserido

  constructor() { // Construtor adicionado/modificado para incluir a lógica de tradução
    this.translate.setDefaultLang('pt'); // Inserido
    this.translate.use(this.translate.currentLang || 'pt'); // Inserido
  }

  async onSubmit() {
    this.errorMessage = '';

    if (!this.newPost.title.trim()) {
      this.errorMessage = 'O título é obrigatório.';
      return;
    }

    if (!this.editorContent.trim()) {
      this.errorMessage = 'O conteúdo é obrigatório.';
      return;
    }

    this.isSubmitting = true;

    try {
      const postsCollection = collection(this.firestore, 'posts');
      await addDoc(postsCollection, {
        title: this.newPost.title,
        content: this.editorContent,
        author: this.newPost.author,
        imageUrl: this.featuredImageUrl || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Reset form
      this.newPost.title = '';
      this.editorContent = '';
      this.featuredImageUrl = '';
      this.router.navigate(['/']);

    } catch (error) {
      console.error('Erro ao salvar o artigo:', error);
      this.errorMessage = this.getFirestoreError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private getFirestoreError(error: any): string {
    if (error.code === 'permission-denied') {
      return 'Você não tem permissão para criar artigos.';
    }
    return 'Falha ao salvar. Tente novamente.';
  }

  useLanguage(language: string): void { // Inserido
    this.translate.use(language); // Inserido
  } // Inserido
}