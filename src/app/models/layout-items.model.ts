export interface NavLink {
  title: string;
  link: string;
}

export interface navBarItems {
  id: string;      // ID do documento (ex: 'connectivity')
  title: string;   // Nome dinâmico da categoria (ex: 'Connectivity')
  order: number;   // Prioridade de exibição na tela
  link: string;    // Link principal da categoria (ex: '/connectivity')
  items: NavLink[]; // Array de links desta categoria
}
export interface footerItems {
    id : string;
    link : string;
    title: string;
}

export interface siteLogos {
    id : string;
    footerLogoUrl : string;
    navbarLogoUrl: string;
    mobileLogoUrl: string;
}

export interface socialMedia {
    id: string;
    link : string;
    title: string;
}

export interface addresses {
    id: string;
    title: string;
    addressName: string;
    phone?: string;
    contactEmail: string;

}

export interface partners {
    id: string;
    partnersLogo: string;
    partnerUrl: string;
}



export interface heroSlider {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    ctaBtnText: string;
      ctaBtn2Text: string;
    ctaUrl: string;
    cta2Url: string;

    // Novas propriedades dinâmicas para o motor de vídeo de fundo
    videoUrl?: string;  // Opcional, armazena o link do MP4 no Firestore
    posterUrl?: string; // Opcional, armazena o link da imagem de thumbnail
    upEventImageUrl?: string; // Add this line
    upEventUrl?: string; // Add this line
} 
