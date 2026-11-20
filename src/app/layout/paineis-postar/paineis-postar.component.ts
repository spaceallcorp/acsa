import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-paineis-postar',
  imports: [FormsModule, CommonModule, EditorModule,],
  templateUrl: './paineis-postar.component.html',
  styleUrl: './paineis-postar.component.css'
})
export class PaineisPostarComponent {
  tinymceApiKey: string = environment.tinymce?.apiKey || '';

  // Data models
  editorContent: string = '';
  author: string = '';
  featuredImageUrl: string = '';
  painelUrl: string = '';
  newPainel = {
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

  async onSubmit() {
    this.errorMessage = '';

    if (!this.newPainel.title.trim()) {
      this.errorMessage = 'O título é obrigatório.';
      return;
    }

    /*
    if (!this.editorContent.trim()) {
      this.errorMessage = 'O conteúdo é obrigatório.';
      return;
    } */

    this.isSubmitting = true;

    try {
      const paineisCollection = collection(this.firestore, 'paineis');
      await addDoc(paineisCollection, {
        title: this.newPainel.title,
        content: this.editorContent,
        author: this.newPainel.author,
        imageUrl: this.featuredImageUrl || null,
        painelUrl: this.painelUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Reset form
      this.newPainel.title = '';
      this.editorContent = '';
      this.featuredImageUrl = '';
      this.router.navigate(['/']);

    } catch (error) {
      console.error('Erro ao salvar o painel:', error);
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
}
