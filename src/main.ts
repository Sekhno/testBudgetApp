import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
import {VerbsTesterComponent} from './app/components/verbs-tester/verbs-tester.component';

bootstrapApplication(VerbsTesterComponent, appConfig)
  .catch((err) => console.error(err));
