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
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'sobre', component: AcercaComponent },

  { path: 'conta', component: SignupComponent },
  { path: 'indicador', component: IndicadorComponent },
  { path: 'agente', component: AgenteComponent },
  { path: 'datacenter', component: DatacenterComponent },
  { path: 'angonap2', component: Angonap2Component },
  { path: 'eventos', component: EventosAcComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'artigo', component: ArtigoComponent },
  { path: 'conectividade', component: ConectividadeComponent },
  { path: 'cloud', component: CloudservicesComponent },
  { path: 'data-center', component: DatacentersevicesComponent },
  { path: 'seguranca', component: SegurancaComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'recrutamento', component: RecrutamentoComponent },
  { path: 'datacenter', component: DatacentersevicesComponent },
  { path: 'virtualizacao', component: VirtualizacaoComponent },
  { path: 'erp', component: ErpComponent },
  { path: 'trust-center', component: TrustCenterComponent },

  { path: 'artigos/ip-transit-chave', component: IptransitComponent },
  { path: 'artigos/ciberseguranca', component: CibersecComponent },
  { path: 'artigos/cloud2-como-montar', component: Cloud2MontagemComponent },

  { path: 'mkt-proibido', component: DashboardComponent },


  {
    path: 'dashboard',
    component: DashboardComponent,
    title: "Dashboard - AngolaCables",
    canActivate: [AuthGuard.canActivate]
    // ✅ Rota protegida
  },
    { path: 'login', component: LoginComponent },


    {
    path: 'product/:id',
    component: ProductDetailComponent,

    resolve: {
      productName: productResolver
    },

    title: 'Produtos - TelCables South Africa'
  


  },
  {
    path: 'privacy-policies',
    loadComponent: () =>
      import('./paginas/privacy-policies/privacy-policies.component').then(
        (m) => m.PrivacyPoliciesComponent,
      ),
  },
  {
    path: 'cookies-policies',
    loadComponent: () =>
      import('./paginas/politicas-cookies/politicas-cookies.component').then(
        (m) => m.PoliticasCookiesComponent,
      ),
  },

  {
    path: 'politicas-cont-negocios',
    loadComponent: () =>
      import('./paginas/politicas-cont-negocios/politicas-cont-negocios.component').then(
        (m) => m.PoliticasContNegociosComponent,
      ),
  },


    {
    path: 'politicas-contrat',

    loadComponent: () =>
      import('./paginas/politicas-contrat/politicas-contrat.component').then(
        (m) => m.PoliticasContratComponent,
      ),
  },

  
  // Produtos (rota com parâmetro)
  {
    path: 'product/:id',
    component: ProductDetailComponent,

    resolve: {
      productName: productResolver
    },

    title: 'Produtos - TelCables South Africa'
  


  },
    {
    path: 'politicas-id-dued',

    loadComponent: () =>
      import('./paginas/politicas-id-duediligence/politicas-id-duediligence.component').then(
        (m) => m.PoliticasIdDuediligenceComponent,
      ),
  },

    {
    path: 'politicas-seginf',

    loadComponent: () =>
      import('./paginas/politicas-seginf/politicas-seginf.component').then(
        (m) => m.PoliticasSeginfComponent,
      ),
  },

  {
    path: 'sgi',
    loadComponent: () =>
      import('./paginas/sgi/sgi.component').then((m) => m.SgiComponent),
  },

  {
    path: 'anti',
    loadComponent: () =>
      import('./paginas/anti/anti.component').then((m) => m.AntiComponent),
  },

  {
    path: 'community-lists',
    loadComponent: () =>
      import('./paginas/community-lists/community-lists.component').then(
        (m) => m.CommunityListsComponent,
      ),
  },

  {
    path: 'artigos',
    loadComponent: () =>
      import('./layout/artigo-lista/artigo-lista.component').then(
        (m) => m.ArtigoListaComponent,
      ),
  },
  {
    path: 'artigo/:id',
    loadComponent: () =>
      import('./layout/artigo/artigo.component').then((m) => m.ArtigoComponent),
  },

  {
    path: 'postar',
    loadComponent: () =>
      import('./layout/artigo-postar/artigo-postar.component').then(
        (m) => m.ArtigoPostarComponent,
      ),
  },

  {
    path: 'postar-vaga',
    loadComponent: () =>
      import('./layout/vagas-criar/vagas-criar.component').then(
        (m) => m.VagasCriarComponent,
      ),
  },
];
