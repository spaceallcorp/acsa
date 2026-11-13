export type EventoCollection = 'eventos' | 'eventosNg' | 'eventosPt' | 'eventosDestaqueEU';

export interface EventoCollectionOption {
    value: EventoCollection;
    label: string;
}

export const EVENTO_COLLECTIONS: EventoCollectionOption[] = [
    { value: 'eventos', label: 'Angola Cables (eventos)' },
    { value: 'eventosNg', label: 'TelCables Nigeria (eventosNg)' },
    { value: 'eventosPt', label: 'TelCables Europe (eventosPt)' },
    { value: 'eventosDestaqueEU', label: 'Featured Event - TelCables Europe (eventosDestaqueEU)' }
];

export interface Evento {
    id?: string;
    title: string;
    organizacao?: string;
    author?: string;
    content: string;
    createdAt: Date | any;
    updatedAt?: Date | any;
    imageUrl: string; // Make sure this is required if you're using it
    eventoUrl?: string; // Make sure this is required if you're using it
    collection?: EventoCollection;
}

