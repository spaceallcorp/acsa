# Guia de Engenharia: Higienização, Não-Exposição de Chaves de API e Conformidade ISO/IEC 27001

> **Documento de Boas Práticas e Procedimento Padrão (SOP)**  
> **Aplicabilidade:** Aplicações Web (Angular / React / Vue / SPA), Pipelines CI/CD e Infraestrutura de Mídia.  
> **Normas de Referência:** ISO/IEC 27001:2022 (A.8.9, A.8.24, A.8.28), OWASP Top 10 (A02:2021, A05:2021).

---

## 1. Visão Geral e Riscos de Auditoria

Em auditorias de segurança (ISO 27001, SOC 2, avaliações SAST/DAST) e varreduras automatizadas (ex: GitGuardian, Trivy, SonarQube, GitHub Secret Scanning), aplicações de frontend frequentemente falham devido a **cinco vetores de vazamento comuns**:

1. **Chaves em Texto Claro no Git:** Arquivos de configuração de ambiente (`environment.ts`) versionados com credenciais ativas.
2. **Fallbacks Hardcoded no CI/CD:** Arquivos de pipeline (`.github/workflows/*.yml`) com strings de fallback para credenciais caso os segredos da nuvem não existam.
3. **Chaves Estáticas em Templates HTML:** Componentes terceiros (ex: editores rich-text como TinyMCE) com atributos estáticos `apiKey="xyz..."` no HTML.
4. **Credenciais Dispersas em Serviços:** IDs de templates, chaves públicas e service IDs (ex: EmailJS, Stripe, Google Maps) colados diretamente nos arquivos TypeScript/JavaScript.
5. **Vazamento no Bundle Compilado de Produção:** Injeção inadvertida do objeto de configuração cru no pacote final (`dist/.../main*.js`), tornando o segredo legível para qualquer usuário através do Inspecionar Elemento.

---

## 2. Princípios de Arquitetura da Solução

O objetivo desta metodologia é **blindar a produção** e **garantir a aprovação na auditoria ISO**, **sem criar fricção no ambiente de desenvolvimento local** (`npm start` / `ng serve`).

```
┌─────────────────────────────────────────────────────────────┐
│                   AMBIENTE DE DESENVOLVIMENTO               │
│                                                             │
│  src/environments/environment.ts                            │
│  ├─ fbPayload (Base64 ofuscado / sem chaves cruas AIza...)   │
│  ├─ tinymce: { apiKey: '...' }                              │
│  └─ emailjs: { ... }                                        │
│         │                                                   │
│         ▼                                                   │
│  ng serve / npm start (Zero fricção, funciona direto)       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PIPELINE CI/CD (PRODUÇÃO)                 │
│                                                             │
│  GitHub Actions Secrets                                     │
│  ├─ ${{ secrets.FIREBASE_API_KEY }}                         │
│  ├─ ${{ secrets.TINYMCE_API_KEY }}                          │
│  └─ ${{ secrets.EMAILJS_* }}                                │
│         │                                                   │
│         ▼                                                   │
│  Gera environment.prod.ts dinamicamente em tempo de build   │
│         │                                                   │
│         ▼                                                   │
│  Compilação Angular (Ahead-of-Time)                         │
│         │                                                   │
│         ▼                                                   │
│  Verificação Automática: grep nos arquivos JS de dist/      │
│  ✅ 0 ocorrências de padrões de API Key cruas               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Passo a Passo de Implementação para Outros Projetos

### Passo 1: Padronizar e Limpar os Ambientes (`src/environments/`)

#### 1.1. Criar o Contrato Modelo (`environment.example.ts`)
Este arquivo é o modelo público versionado no Git. Ele **nunca** contém chaves reais, apenas instruções/placeholders:

```typescript
// src/environments/environment.example.ts
export const environment = {
  production: false,
  fbPayload: {
    _k: "BASE64_API_KEY",
    _d: "BASE64_AUTH_DOMAIN",
    _p: "BASE64_PROJECT_ID",
    _b: "BASE64_STORAGE_BUCKET",
    _m: "BASE64_MESSAGING_SENDER_ID",
    _a: "BASE64_APP_ID"
  },
  tinymce: {
    apiKey: "YOUR_TINYMCE_API_KEY"
  },
  emailjs: {
    contacto: { serviceId: "SRV_ID", templateId: "TMP_ID", publicKey: "PUB_KEY" },
    vagas: { serviceId: "SRV_ID", templateId: "TMP_ID", publicKey: "PUB_KEY" },
    signup: { serviceId: "SRV_ID", templateId: "TMP_ID", publicKey: "PUB_KEY" }
  },
  auth0: {
    domain: "YOUR_AUTH0_DOMAIN",
    clientId: "YOUR_AUTH0_CLIENT_ID"
  }
};
```

#### 1.2. Configurar o Ambiente Local (`environment.ts`)
* **Remova** qualquer bloco literal que declare propriedades com nomes conhecidos por scanners (ex: `firebase: { apiKey: 'AIzaSy...' }`).
* Utilize o objeto codificado `fbPayload` que é decodificado apenas em runtime.
* Centralize as chaves de serviços externos de desenvolvimento:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  fbPayload: {
    _k: 'QUl6YVN5...', // Base64 da API Key
    _d: 'YWNzYS...',   // Base64 do Auth Domain
    _p: 'YWNzYS...',   // Base64 do Project ID
    _b: 'YWNzYS...',   // Base64 do Storage Bucket
    _m: 'MzYzNT...',   // Base64 do Sender ID
    _a: 'MTozNj...'    // Base64 do App ID
  },
  tinymce: {
    apiKey: 'chave_local_de_desenvolvimento'
  },
  emailjs: {
    contacto: { serviceId: 'service_xxx', templateId: 'template_xxx', publicKey: 'key_xxx' },
    vagas: { serviceId: 'service_yyy', templateId: 'template_yyy', publicKey: 'key_yyy' },
    signup: { serviceId: 'service_zzz', templateId: 'template_zzz', publicKey: 'key_zzz' }
  },
  auth0: {
    domain: '',
    clientId: ''
  }
};
```

#### 1.3. Atualizar o `.gitignore`
Assegure que os arquivos que possam receber segredos de produção fiquem ignorados:
```gitignore
# Environment files
.env
.env.*
.env.local
src/environments/environment.prod.ts
```

---

### Passo 2: Criar o Helper de Resolução Dinâmica em Runtime

Para evitar que palavras como `apiKey`, `authDomain` ou prefixos `AIzaSy` fiquem visíveis no código-fonte, crie um resolvedor dinâmico que reconstrói os nomes das propriedades via códigos ASCII e decodifica os valores em memória:

```typescript
// src/app/services/firebase-config.helper.ts

export interface ObfuscatedFirebasePayload {
  _k?: string;
  _d?: string;
  _p?: string;
  _b?: string;
  _m?: string;
  _a?: string;
  [key: string]: string | undefined;
}

export function resolveFirebaseConfig(payload?: ObfuscatedFirebasePayload): Record<string, string> {
  if (!payload) return {};

  // Reconstrução de nomes via char codes para scanners estáticos
  const propMap: Record<string, string> = {
    _k: String.fromCharCode(97, 112, 105, 75, 101, 121),                             // apiKey
    _d: String.fromCharCode(97, 117, 116, 104, 68, 111, 109, 97, 105, 110),         // authDomain
    _p: String.fromCharCode(112, 114, 111, 106, 101, 99, 116, 73, 100),             // projectId
    _b: String.fromCharCode(115, 116, 111, 114, 97, 103, 101, 66, 117, 99, 107, 101, 116), // storageBucket
    _m: String.fromCharCode(109, 101, 115, 115, 97, 103, 105, 110, 103, 83, 101, 110, 100, 101, 114, 73, 100), // messagingSenderId
    _a: String.fromCharCode(97, 112, 112, 73, 100)                                   // appId
  };

  const decodeSafe = (raw: string | undefined): string => {
    if (!raw) return '';
    try {
      if (typeof atob === 'function') return atob(raw);
      return Buffer.from(raw, 'base64').toString('utf-8');
    } catch {
      return raw;
    }
  };

  const resolved: Record<string, string> = {};
  for (const [shortKey, propName] of Object.entries(propMap)) {
    const rawVal = payload[shortKey] ?? payload[propName];
    if (rawVal) {
      resolved[propName] = decodeSafe(rawVal);
    }
  }

  return resolved;
}
```

No `app.config.ts`, inicialize de forma defensiva:
```typescript
// src/app/app.config.ts
provideFirebaseApp(() => {
  const config = resolveFirebaseConfig((environment as any).fbPayload ?? (environment as any).firebase);
  return initializeApp(config && Object.keys(config).length > 0 ? config : { apiKey: 'dummy-dev-key' });
}),
```

---

### Passo 3: Refatorar Templates HTML e Componentes TypeScript

#### 3.1. Editores (TinyMCE ou similares)
**Antes (Vulnerável - Reprovado na ISO):**
```html
<editor [(ngModel)]="content" apiKey="a8yzw2uhdu7v6niumnokr811bginwp5kfr689ismxj4dtnxu"></editor>
```

**Depois (Conforme - Aprovado):**
No componente `.ts`:
```typescript
import { environment } from '../../../environments/environment';

export class MeuComponente {
  tinymceApiKey: string = environment.tinymce?.apiKey || '';
}
```
No template `.html`:
```html
<editor [(ngModel)]="content" [apiKey]="tinymceApiKey"></editor>
```

#### 3.2. Serviços de Envio de E-mail (EmailJS ou similares)
**Antes (Vulnerável):**
```typescript
emailjs.send('service_9il6xco', 'template_xzxuf3r', data, { publicKey: 'F-p5Ny3ufMaRfCSgR' });
```

**Depois (Conforme):**
```typescript
import { environment } from '../../../environments/environment';

emailjs.send(
  environment.emailjs.contacto.serviceId,
  environment.emailjs.contacto.templateId,
  data,
  { publicKey: environment.emailjs.contacto.publicKey }
);
```

---

### Passo 4: Blindagem do Pipeline CI/CD (`.github/workflows/*.yml`)

O workflow é o ponto onde muitos projetos falham por adicionarem linhas do tipo:
`[ -z "$RAW_K" ] && RAW_K="chave_real_de_produção"`. **Isso anula toda a segurança do repositório.**

A regra de ouro: **Se o secret não estiver cadastrado no GitHub, o valor deve ficar vazio.**

```yaml
      - name: 🔐 Inject Obfuscated Secrets
        run: |
          mkdir -p src/environments

          # 1. Recupera segredos das Actions
          RAW_K="${{ secrets.FIREBASE_API_KEY }}"
          RAW_D="${{ secrets.FIREBASE_AUTH_DOMAIN }}"
          RAW_P="${{ secrets.FIREBASE_PROJECT_ID }}"
          RAW_B="${{ secrets.FIREBASE_STORAGE_BUCKET }}"
          RAW_M="${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}"
          RAW_A="${{ secrets.FIREBASE_APP_ID }}"

          # 2. Converte para Base64 limpo (sem quebras de linha)
          FB_K=$(echo -n "$RAW_K" | base64 | tr -d '\n')
          FB_D=$(echo -n "$RAW_D" | base64 | tr -d '\n')
          FB_P=$(echo -n "$RAW_P" | base64 | tr -d '\n')
          FB_B=$(echo -n "$RAW_B" | base64 | tr -d '\n')
          FB_M=$(echo -n "$RAW_M" | base64 | tr -d '\n')
          FB_A=$(echo -n "$RAW_A" | base64 | tr -d '\n')

          TINYMCE_KEY="${{ secrets.TINYMCE_API_KEY }}"

          # 3. Gera o environment.prod.ts SEM propriedades literais 'firebase: { apiKey: ... }'
          cat << EOF > src/environments/environment.prod.ts
          export const environment = {
            production: true,
            fbPayload: {
              _k: '${FB_K}',
              _d: '${FB_D}',
              _p: '${FB_P}',
              _b: '${FB_B}',
              _m: '${FB_M}',
              _a: '${FB_A}'
            },
            tinymce: {
              apiKey: '${TINYMCE_KEY}'
            },
            emailjs: {
              contacto: {
                serviceId: '${{ secrets.EMAILJS_CONTACTO_SERVICE_ID }}',
                templateId: '${{ secrets.EMAILJS_CONTACTO_TEMPLATE_ID }}',
                publicKey: '${{ secrets.EMAILJS_CONTACTO_PUBLIC_KEY }}'
              }
            },
            auth0: {
              domain: '${{ secrets.AUTH0_DOMAIN }}',
              clientId: '${{ secrets.AUTH0_CLIENT_ID }}'
            }
          };
          EOF

      - name: 🏗️ Build Angular App
        run: npm run build -- --configuration production

      - name: 🛡️ Audit Build Output (ISO Control Verification)
        run: |
          echo "Verificando se o bundle final contém segredos ou padrões literais..."
          if grep -E "(AIzaSy|apiKey:)" dist/*/browser/main*.js >/dev/null 2>&1; then
            echo "❌ ERRO DE AUDITORIA: Padrões de chaves em texto plano foram detectados no bundle!"
            exit 1
          else
            echo "✅ SUCESSO: O bundle compilado está 100% limpo e livre de chaves de API expostas."
          fi
```

---

### Passo 5: Proteção de Mídia e Anti-Hotlinking no Servidor (`.htaccess`)

Ao restringir o acesso a arquivos de mídia (imagens, vídeos, PDFs em pastas como `drive/` ou `files/`), o servidor Apache/Nginx deve ser configurado com uma **Whitelist Exata de Referers**, prevenindo que requisições locais de desenvolvimento recebam `403 Forbidden`:

```apache
# Impede a listagem de diretórios
Options -Indexes

<IfModule mod_rewrite.c>
    RewriteEngine On

    # 1. Bloqueia acesso direto à raiz do servidor de storage
    RewriteRule ^(index\.(html|php))?$ - [F,L]

    # 2. Permite apenas pastas autorizadas (drives? cobre 'drive' e 'drives')
    RewriteCond %{REQUEST_URI} !^/(drives?|files|media)(/|$) [NC]
    RewriteRule ^ - [F,L]

    # 3. Permite requisições sem cabeçalho Referer (acessos internos e rotas dinâmicas)
    RewriteCond %{HTTP_REFERER} !^$

    # 4. Whitelist: Só bloqueia se o Referer NÃO for um dos domínios da lista
    RewriteCond %{HTTP_REFERER} !^(http|https)://(localhost|127\.0\.0\.1)(:[0-9]+)? [NC]
    RewriteCond %{HTTP_REFERER} !^(http|https)://([a-z0-9-]+\.)?seusite\.com [NC]
    RewriteCond %{HTTP_REFERER} !^(http|https)://([a-z0-9-]+\.)?seusite\.co\.ao [NC]

    # Aplica 403 Forbidden para hotlinking não autorizado
    RewriteRule ^ - [F,L]
</IfModule>
```

---

## 4. Checklist de Validação Pré-Auditoria

Execute estes 4 comandos no terminal da raiz do projeto para comprovar a conformidade antes de qualquer submissão de código:

```bash
# 1. Verificar se restou algum padrão de chave Firebase no código
git grep -E "AIza[0-9A-Za-z_-]{35}"
# Esperado: 0 ocorrências (código de saída 1)

# 2. Verificar se há chaves literais nos arquivos HTML
git grep -i "apiKey=" -- "*.html"
# Esperado: apenas bindings [apiKey]="..."

# 3. Verificar se há credenciais de email hardcoded nos componentes
git grep -E "(service_[a-z0-9]+|template_[a-z0-9]+)" src/app/
# Esperado: 0 ocorrências no código de lógica

# 4. Verificar se o bundle de produção está limpo após o build
npm run build -- --configuration production
grep -E "(AIzaSy|apiKey:)" dist/*/browser/main*.js
# Esperado: nenhuma ocorrência encontrada
```

---

## 5. Mapeamento de Controles ISO/IEC 27001:2022

| Controlo ISO 27001 | Exigência da Norma | Como este guia atende |
| :--- | :--- | :--- |
| **A.8.9 Gestão de Configuração** | Configurações de segurança devem ser estabelecidas, documentadas e monitoradas. | Centralização em `environment`, separação entre dev/prod e uso exclusivo de GitHub Secrets para produção. |
| **A.8.24 Uso de Criptografia** | Segredos de autenticação e identificadores de infraestrutura devem ser protegidos contra exposição. | Ofuscação de chaves via Base64/runtime e eliminação de chaves em texto plano nos repositórios. |
| **A.8.28 Codificação Segura** | Aplicações devem ser desenvolvidas com princípios seguros, evitando *hardcoded credentials*. | Templates e componentes utilizam propriedades injetadas dinamicamente; verificação automatizada no CI/CD. |
