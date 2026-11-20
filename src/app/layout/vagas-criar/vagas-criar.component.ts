import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-vagas-criar',
  imports: [FormsModule, CommonModule, EditorModule],
  templateUrl: './vagas-criar.component.html',
  styleUrl: './vagas-criar.component.css'
})
export class VagasCriarComponent {
  tinymceApiKey: string = environment.tinymce?.apiKey || '';

  // Data models
  editorContent: string = '';
  author: string = '';
  featuredImageUrl: string = '';
  newVaga = {
    posicao: '',
    departamento: '',
    
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

    if (!this.newVaga.posicao.trim()) {
      this.errorMessage = 'A poisção é obrigatória.';
      return;
    }

    if (!this.editorContent.trim()) {
      this.errorMessage = 'As responsabilidades são obrigatórias.';
      return;
    }

    this.isSubmitting = true;

    try {
      const vagasCollection = collection(this.firestore, 'vagas');
      await addDoc(vagasCollection, {
        posicao: this.newVaga.posicao,
        content: this.editorContent,
         author: this.newVaga.departamento, 
        imageUrl: this.featuredImageUrl || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Reset form
      this.newVaga.posicao = '';
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
      return 'Você não tem permissão para publicar Vagas.';
    }
    return 'Falha ao salvar. Tente novamente.';
  }
}
