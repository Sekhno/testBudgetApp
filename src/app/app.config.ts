import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatNativeDateModule} from '@angular/material/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC_d8huMG6ZwZSBe0ErETBXoRUi9yicNsM",
  authDomain: "hobby-afa88.firebaseapp.com",
  projectId: "hobby-afa88",
  storageBucket: "hobby-afa88.appspot.com",
  messagingSenderId: "823473123725",
  appId: "1:823473123725:web:19716b7571c8e958db0dc4",
  measurementId: "G-W1KWMMM37J"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(MatNativeDateModule),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ]
};
