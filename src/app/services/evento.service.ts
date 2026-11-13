
import { Injectable, inject, signal } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, serverTimestamp } from '@angular/fire/firestore';
import { Evento, EventoCollection } from '../models/evento.models';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private firestore = inject(Firestore);
  private eventosCollection = collection(this.firestore, 'eventos');

  eventos = signal<Evento[]>([]);
  eventosNg = signal<Evento[]>([]);
  eventosPt = signal<Evento[]>([]);
  eventosDestaqueEU = signal<Evento[]>([]);

  constructor() {
    console.log('EventosService initializado');
    this.getEventos('eventos').subscribe(eventos => {
      console.log('Eventos carregados', eventos);
      this.eventos.set(eventos);
    });
  }

  getEventos(collectionName: EventoCollection = 'eventos'): Observable<Evento[]> {
    console.log(`Fetching all eventos from ${collectionName}`);
    const targetCollection = collection(this.firestore, collectionName);
    return collectionData(targetCollection, { idField: 'id' }).pipe(
      map((eventos: any[]) => eventos.map(evento => ({ ...evento, collection: collectionName } as Evento))),
      tap(eventos => console.log(`Eventos from Firestore (${collectionName}):`, eventos))
    ) as Observable<Evento[]>;
  }

  getEventosNg(): Observable<Evento[]> {
    return this.getEventos('eventosNg').pipe(
      tap(eventos => this.eventosNg.set(eventos))
    );
  }

  getEventosPt(): Observable<Evento[]> {
    return this.getEventos('eventosPt').pipe(
      tap(eventos => this.eventosPt.set(eventos))
    );
  }

  getEventosDestaqueEU(): Observable<Evento[]> {
    return this.getEventos('eventosDestaqueEU').pipe(
      tap(eventos => this.eventosDestaqueEU.set(eventos))
    );
  }

  async createEvento(evento: Partial<Evento>, collectionName: EventoCollection = 'eventos'): Promise<string> {
    const targetCollection = collection(this.firestore, collectionName);
    const docRef = await addDoc(targetCollection, {
      title: evento.title,
      content: evento.content || '',
      author: evento.author || '',
      imageUrl: evento.imageUrl || null,
      eventoUrl: evento.eventoUrl || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  getEventoById(id: string, collectionName: EventoCollection = 'eventos'): Observable<Evento | undefined> {
    console.log(`Fetching evento with ID: ${id} from ${collectionName}`);
    const postDoc = doc(this.firestore, `${collectionName}/${id}`);
    return docData(postDoc, { idField: 'id' }).pipe(
      map(evento => {
        if (!evento) {
          throw new Error('Evento não encontrado');
        }
        return { ...evento, collection: collectionName } as Evento;
      }),
      tap(evento => console.log('Retrieved evento:', evento))
    ) as Observable<Evento>;
  }

  async deleteEvento(id: string, collectionName: EventoCollection = 'eventos'): Promise<void> {
    console.log(`Deletando evento com ID: ${id} de ${collectionName}`);
    const eventoDoc = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(eventoDoc);
  }
}