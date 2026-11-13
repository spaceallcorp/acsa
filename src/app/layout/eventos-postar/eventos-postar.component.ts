import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EVENTO_COLLECTIONS, EventoCollection } from '../../models/evento.models';

@Component({
  selector: 'app-eventos-postar',
  imports: [FormsModule, CommonModule, EditorModule],
  templateUrl: './eventos-postar.component.html',
  styleUrl: './eventos-postar.component.css'
})
export class EventosPostarComponent {

  // Available target collections
  collections = EVENTO_COLLECTIONS;
  selectedCollection: EventoCollection = 'eventos';

  // Data models
  editorContent: string = '';
  author: string = '';
  eventoUrl: string = '';
  featuredImageUrl: string = '';
  newEvento = {
    title: '',
    author: '',
    eventoUrl: '',

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

    if (!this.newEvento.title.trim()) {
      this.errorMessage = 'O título é obrigatório.';
      return;
    }

    if (!this.selectedCollection) {
      this.errorMessage = 'Seleccione o destino (colecção) do evento.';
      return;
    }

    /*
    if (!this.editorContent.trim()) {
      this.errorMessage = 'O conteúdo é obrigatório.';
      return;
    } */

    this.isSubmitting = true;

    try {
      const eventosCollection = collection(this.firestore, this.selectedCollection);
      await addDoc(eventosCollection, {
        title: this.newEvento.title,
        content: this.editorContent,
        author: this.newEvento.author,
        imageUrl: this.featuredImageUrl || null,
        eventoUrl: this.eventoUrl || null,
        collection: this.selectedCollection,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Reset form
      this.newEvento.title = '';
      this.newEvento.author = '';
      this.eventoUrl = '';
      this.editorContent = '';
      this.featuredImageUrl = '';
      this.selectedCollection = 'eventos';
      this.router.navigate(['/']);

    } catch (error) {
      console.error('Erro ao salvar o evento:', error);
      this.errorMessage = this.getFirestoreError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private getFirestoreError(error: any): string {
    if (error.code === 'permission-denied') {
      return 'Você não tem permissão para criar eventos.';
    }
    return 'Falha ao salvar. Tente novamente.';
  }
}
