export type CmsSiteId = 'ao' | 'ng' | 'pt' | 'za';

export interface CmsSiteConfig {
  id: CmsSiteId;
  name: string;
  shortName: string;
  regionLabel: string;
  domain: string;
  logoSvg: string;
  suffix: '' | 'Ng' | 'Pt' | 'Za';
  collections: {
    eventos: 'eventos' | 'eventosNg' | 'eventosPt' | 'eventosZa';
    noticias: 'noticias' | 'noticiasNg' | 'noticiasPt' | 'noticiasZa';
    posts: 'posts' | 'postsNg' | 'postsPt' | 'postsZa';
    vagas: 'vagas' | 'vagasNg' | 'vagasPt' | 'vagasZa';
    paineis: 'paineis' | 'paineisNg' | 'paineisPt' | 'paineisZa';
  };
}

export const CMS_SITES: CmsSiteConfig[] = [
  {
    id: 'ao',
    name: 'Angola Cables',
    shortName: 'AO',
    regionLabel: 'Angola (HQ)',
    domain: 'angolacables.co.ao',
    logoSvg: '/img/telcables/svg/ac-teste-2.svg',
    suffix: '',
    collections: {
      eventos: 'eventos',
      noticias: 'noticias',
      posts: 'posts',
      vagas: 'vagas',
      paineis: 'paineis',
    },
  },
  {
    id: 'ng',
    name: 'TelCables Nigeria',
    shortName: 'NG',
    regionLabel: 'West Africa',
    domain: 'telcables.ng',
    logoSvg: '/img/telcables/svg/v2/telcables-nigeria.svg',
    suffix: 'Ng',
    collections: {
      eventos: 'eventosNg',
      noticias: 'noticiasNg',
      posts: 'postsNg',
      vagas: 'vagasNg',
      paineis: 'paineisNg',
    },
  },
  {
    id: 'pt',
    name: 'TelCables Europe',
    shortName: 'PT / EU',
    regionLabel: 'Portugal & Europe',
    domain: 'telcables.pt',
    logoSvg: '/img/telcables/svg/v2/telcables-europa.svg',
    suffix: 'Pt',
    collections: {
      eventos: 'eventosPt',
      noticias: 'noticiasPt',
      posts: 'postsPt',
      vagas: 'vagasPt',
      paineis: 'paineisPt',
    },
  },
  {
    id: 'za',
    name: 'TelCables South Africa',
    shortName: 'ZA',
    regionLabel: 'Southern & East Africa',
    domain: 'telcables.co.za',
    logoSvg: '/img/telcables/svg/v2/telcables-africasul.svg',
    suffix: 'Za',
    collections: {
      eventos: 'eventosZa',
      noticias: 'noticiasZa',
      posts: 'postsZa',
      vagas: 'vagasZa',
      paineis: 'paineisZa',
    },
  },
];

export type NoticiaCollection = 'noticias' | 'noticiasNg' | 'noticiasPt' | 'noticiasZa';
export const NOTICIA_COLLECTIONS: { value: NoticiaCollection; label: string }[] = [
  { value: 'noticias', label: 'Angola Cables (noticias)' },
  { value: 'noticiasNg', label: 'TelCables Nigeria (noticiasNg)' },
  { value: 'noticiasPt', label: 'TelCables Europe (noticiasPt)' },
  { value: 'noticiasZa', label: 'TelCables South Africa (noticiasZa)' },
];

export type PostCollection = 'posts' | 'postsNg' | 'postsPt' | 'postsZa';
export const POST_COLLECTIONS: { value: PostCollection; label: string }[] = [
  { value: 'posts', label: 'Angola Cables (posts)' },
  { value: 'postsNg', label: 'TelCables Nigeria (postsNg)' },
  { value: 'postsPt', label: 'TelCables Europe (postsPt)' },
  { value: 'postsZa', label: 'TelCables South Africa (postsZa)' },
];

export type VagaCollection = 'vagas' | 'vagasNg' | 'vagasPt' | 'vagasZa';
export const VAGA_COLLECTIONS: { value: VagaCollection; label: string }[] = [
  { value: 'vagas', label: 'Angola Cables (vagas)' },
  { value: 'vagasNg', label: 'TelCables Nigeria (vagasNg)' },
  { value: 'vagasPt', label: 'TelCables Europe (vagasPt)' },
  { value: 'vagasZa', label: 'TelCables South Africa (vagasZa)' },
];

export type PainelCollection = 'paineis' | 'paineisNg' | 'paineisPt' | 'paineisZa';
export const PAINEL_COLLECTIONS: { value: PainelCollection; label: string }[] = [
  { value: 'paineis', label: 'Angola Cables (paineis)' },
  { value: 'paineisNg', label: 'TelCables Nigeria (paineisNg)' },
  { value: 'paineisPt', label: 'TelCables Europe (paineisPt)' },
  { value: 'paineisZa', label: 'TelCables South Africa (paineisZa)' },
];
