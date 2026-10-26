import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { SignupComponent } from './paginas/signup/signup.component';
import { IndicadorComponent } from './paginas/indicador/indicador.component';
import { AgenteComponent } from './paginas/agente/agente.component';
import { DatacenterComponent } from './paginas/datacenter/datacenter.component';
import { Angonap2Component } from './paginas/angonap2/angonap2.component';
import { AcercaComponent } from './paginas/acerca/acerca.component';
import { EventosComponent } from './layout/eventos/eventos.component';
import { EventosAcComponent } from './paginas/eventos-ac/eventos-ac.component';
import { BlogComponent } from './paginas/blog/blog.component';
import { ArtigoComponent } from './templates/artigo/artigo.component';
import { ConectividadeComponent } from './paginas/conectividade/conectividade.component';
import { CloudservicesComponent } from './paginas/cloudservices/cloudservices.component';
import { DatacentersevicesComponent } from './paginas/datacentersevices/datacentersevices.component';
import { SegurancaComponent } from './paginas/seguranca/seguranca.component';
import { NoticiasComponent } from './paginas/noticias/noticias.component';
import { ContactoComponent } from './paginas/contacto/contacto.component';
import { RecrutamentoComponent } from './paginas/recrutamento/recrutamento.component';
import { VirtualizacaoComponent } from './paginas/virtualizacao/virtualizacao.component';
import { ErpComponent } from './paginas/erp/erp.component';
import { TrustCenterComponent } from './paginas/trust-center/trust-center.component';
import { IptransitComponent } from './dummy/artigos/iptransit/iptransit.component';
import { CibersecComponent } from './dummy/artigos/cibersec/cibersec.component';
import { Cloud2MontagemComponent } from './dummy/artigos/cloud2-montagem/cloud2-montagem.component';
import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { VagasCriarComponent } from './layout/vagas-criar/vagas-criar.component';
import { ProductDetailComponent } from './layout/product-detail/product-detail.component';
import { productResolver } from './resolvers/produtc-resolver';

import { LoginComponent } from './paginas/login/login.component';

import { AuthGuard } from './guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    title: 'Início - Angola Cables'
  },
  {
    path: 'inicio',
    component: InicioComponent,
    title: 'Início - Angola Cables'
  },
  {
    path: 'sobre',
    component: AcercaComponent,
    title: 'Sobre Nós - Angola Cables'
  },
  {
    path: 'conta',
    component: SignupComponent,
    title: 'Criar Conta - Angola Cables'
  },
  {
    path: 'indicador',
    component: IndicadorComponent,
    title: 'Indicadores - Angola Cables'
  },
  {
    path: 'agente',
    component: AgenteComponent,
    title: 'Seja um Agente - Angola Cables'
  },
  {
    path: 'datacenter',
    component: DatacenterComponent,
    title: 'Data Center - Angola Cables'
  },
  {
    path: 'angonap2',
    component: Angonap2Component,
    title: 'AngoNAP Fortaleza - Angola Cables'
  },
  {
    path: 'eventos',
    component: EventosAcComponent,
    title: 'Eventos - Angola Cables'
  },
  {
    path: 'blog',
    component: BlogComponent,
    title: 'Blog - Angola Cables'
  },
  {
    path: 'artigo',
    component: ArtigoComponent,
    title: 'Artigo - Angola Cables'
  },
  {
    path: 'conectividade',
    component: ConectividadeComponent,
    title: 'Conectividade - Angola Cables'
  },
  {
    path: 'cloud',
    component: CloudservicesComponent,
    title: 'Cloud Services - Angola Cables'
  },
  {
    path: 'data-center',
    component: DatacentersevicesComponent,
    title: 'Serviços de Data Center - Angola Cables'
  },
  {
    path: 'seguranca',
    component: SegurancaComponent,
    title: 'Segurança - Angola Cables'
  },
  {
    path: 'noticias',
    component: NoticiasComponent,
    title: 'Notícias - Angola Cables'
  },
  {
    path: 'contacto',
    component: ContactoComponent,
    title: 'Contacto - Angola Cables'
  },
  {
    path: 'recrutamento',
    component: RecrutamentoComponent,
    title: 'Recrutamento - Angola Cables'
  },
  {
    path: 'virtualizacao',
    component: VirtualizacaoComponent,
    title: 'Virtualização - Angola Cables'
  },
  {
    path: 'erp',
    component: ErpComponent,
    title: 'Cloud2ERP - Angola Cables'
  },
  {
    path: 'trust-center',
    component: TrustCenterComponent,
    title: 'Trust Center - Angola Cables'
  },

  {
    path: 'artigos/ip-transit-chave',
    component: IptransitComponent,
    title: 'IP Transit - Angola Cables'
  },
  {
    path: 'artigos/ciberseguranca',
    component: CibersecComponent,
    title: 'Cibersegurança - Angola Cables'
  },
  {
    path: 'artigos/cloud2-como-montar',
    component: Cloud2MontagemComponent,
    title: 'Cloud2Africa - Angola Cables'
  },

  {
    path: 'mkt-proibido',
    component: DashboardComponent,
    title: 'Marketing - Angola Cables'
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard - Angola Cables',
    canActivate: [AuthGuard.canActivate]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Angola Cables'
  },

  {
    path: 'product/:id',
    component: ProductDetailComponent,
    resolve: {
      productName: productResolver
    },
    title: 'Produtos - Angola Cables'
  },
  {
    path: 'privacy-policies',
    loadComponent: () =>
      import('./paginas/privacy-policies/privacy-policies.component').then(
        (m) => m.PrivacyPoliciesComponent,
      ),
    title: 'Políticas de Privacidade - Angola Cables'
  },
  {
    path: 'cookies-policies',
    loadComponent: () =>
      import('./paginas/politicas-cookies/politicas-cookies.component').then(
        (m) => m.PoliticasCookiesComponent,
      ),
    title: 'Políticas de Cookies - Angola Cables'
  },
  {
    path: 'politicas-cont-negocios',
    loadComponent: () =>
      import('./paginas/politicas-cont-negocios/politicas-cont-negocios.component').then(
        (m) => m.PoliticasContNegociosComponent,
      ),
    title: 'Políticas de Continuidade de Negócios - Angola Cables'
  },
  {
    path: 'politicas-contrat',
    loadComponent: () =>
      import('./paginas/politicas-contrat/politicas-contrat.component').then(
        (m) => m.PoliticasContratComponent,
      ),
    title: 'Políticas de Contratação - Angola Cables'
  },
  {
    path: 'politicas-id-dued',
    loadComponent: () =>
      import('./paginas/politicas-id-duediligence/politicas-id-duediligence.component').then(
        (m) => m.PoliticasIdDuediligenceComponent,
      ),
    title: 'Políticas de Due Diligence - Angola Cables'
  },
  {
    path: 'politicas-seginf',
    loadComponent: () =>
      import('./paginas/politicas-seginf/politicas-seginf.component').then(
        (m) => m.PoliticasSeginfComponent,
      ),
    title: 'Políticas de Segurança da Informação - Angola Cables'
  },
  {
    path: 'sgi',
    loadComponent: () =>
      import('./paginas/sgi/sgi.component').then((m) => m.SgiComponent),
    title: 'SGI - Angola Cables'
  },
  {
    path: 'anti',
    loadComponent: () =>
      import('./paginas/anti/anti.component').then((m) => m.AntiComponent),
    title: 'Política Anticorrupção - Angola Cables'
  },
  {
    path: 'community-lists',
    loadComponent: () =>
      import('./paginas/community-lists/community-lists.component').then(
        (m) => m.CommunityListsComponent,
      ),
    title: 'Community Lists - Angola Cables'
  },
  {
    path: 'artigos',
    loadComponent: () =>
      import('./layout/artigo-lista/artigo-lista.component').then(
        (m) => m.ArtigoListaComponent,
      ),
    title: 'Artigos - Angola Cables'
  },
  {
    path: 'artigo/:id',
    loadComponent: () =>
      import('./layout/artigo/artigo.component').then((m) => m.ArtigoComponent),
    title: 'Artigo - Angola Cables'
  },
  {
    path: 'postar',
    loadComponent: () =>
      import('./layout/artigo-postar/artigo-postar.component').then(
        (m) => m.ArtigoPostarComponent,
      ),
    title: 'Publicar Artigo - Angola Cables'
  },
  {
    path: 'postar-vaga',
    loadComponent: () =>
      import('./layout/vagas-criar/vagas-criar.component').then(
        (m) => m.VagasCriarComponent,
      ),
    title: 'Publicar Vaga - Angola Cables'
  },
];
