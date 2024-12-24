import { Routes } from '@angular/router';
import {BudgetComponent} from './components/budget/budget.component';
import {VerbsTesterComponent} from './components/verbs-tester/verbs-tester.component';

export const routes: Routes = [
  {
    path: '', redirectTo: '/verbs', pathMatch: 'full'
  },
  {
    path: 'budget', loadComponent: () => import('./components/budget/budget.component').then(m => m.BudgetComponent),
  },
  {
    path: 'verbs', component: VerbsTesterComponent
  },

];
