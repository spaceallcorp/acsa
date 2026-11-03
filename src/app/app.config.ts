import { ApplicationConfig, provideAppInitializer, inject,  provideZoneChangeDetection } from "@angular/core";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { provideAuth0 } from "@auth0/auth0-angular";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from "./app.routes";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { TranslateLoader, provideTranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { environment } from '../environments/environment';
import { resolveFirebaseConfig } from './services/firebase-config.helper';
import { provideAuth } from "@angular/fire/auth";
import { getAuth } from "firebase/auth";


const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
    new TranslateHttpLoader(http, "./i18n/", ".json");

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'top', // This makes the page scroll to top on navigation
                anchorScrolling: 'enabled' // Optional: enables anchor scrolling
            })
        ),
        provideHttpClient(),
        provideTranslateService({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        provideAuth0({
            domain: environment.auth0.domain,
            clientId: environment.auth0.clientId,
            authorizationParams: {
                redirect_uri: window.location.origin
            },
        }),
        provideFirebaseApp(() => initializeApp(resolveFirebaseConfig((environment as any).fbPayload ?? (environment as any).firebase))),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore())
    ],
};