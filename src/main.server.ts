import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import {VerbsTesterComponent} from './app/components/verbs-tester/verbs-tester.component';

const bootstrap = () => bootstrapApplication(VerbsTesterComponent, config);

export default bootstrap;
