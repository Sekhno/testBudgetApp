import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed, effect,
  inject,
  signal,
  ViewChild
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {CategoryType, DefaultTransactionType} from './components/budget/models/TransactionsTypes';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DatePipe, DecimalPipe} from '@angular/common';
import {
  StorageService
} from './components/budget/storage/crud';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {combineLatest, forkJoin} from 'rxjs';
import {VerbsTesterComponent} from './components/verbs-tester/verbs-tester.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet]
})
export class AppComponent {

}
