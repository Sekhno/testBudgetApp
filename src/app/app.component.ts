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
import {CategoryType, DefaultTransactionType} from './models/TransactionsTypes';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DatePipe, DecimalPipe} from '@angular/common';
import {
  StorageService
} from './storage/crud';
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
  imports: [
    RouterOutlet, DatePipe, DecimalPipe, FormsModule,
    MatInputModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatIconButton, MatButtonModule,
    MatTableModule, MatDatepickerModule, MatExpansionModule, MatRadioModule, VerbsTesterComponent
  ]
})
export class AppComponent {
  private _fb = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);
  private _storage = inject(StorageService);

  public categories: CategoryType[] = [];
  public displayedColumns = ["name", "type", "category", "date", "amount"];
  public dataSource= new MatTableDataSource([] as DefaultTransactionType[]) ;
  public transGroup = this._fb.group
  ({
    name: this._fb.control('', { nonNullable: true, validators: [Validators.required] }),
    amount: this._fb.control(0, { nonNullable: true, validators: [Validators.required] }),
    category: this._fb.control('', {nonNullable: true,  validators: [Validators.required] }),
    type: this._fb.control('expenses', { nonNullable: true, validators: [Validators.required] }),
    date: this._fb.control(new Date(), { nonNullable: true, validators: [Validators.required] }),
  });
  public total = 0;
  public filters = {
    type: '',
    category: '',
    minAmount: null,
    maxAmount: null,
    startDate: null,
    endDate: null,
  };

  readonly panelOpenState = signal(false);

  constructor()
  {
    effect(async () => {
      if (this._storage.availableSignal()) {
        await this._initData();
      }
    });
  }

  public async addNewCategory(name: string)
  {
    this.categories.push(name);
    await this._storage.saveCategory(name);
  }

  public removeCategory(name: string)
  {
    this.categories.splice(this.categories.indexOf(name), 1);
  }

  public applyFilter()
  {
    const { type, category, minAmount, maxAmount, startDate, endDate } = this.filters;

    this.dataSource.filterPredicate = (data, filter) => {
      const matchType = !type || data.type.toLowerCase() === type.toLowerCase();
      const matchCategory = !category || data.category.toLowerCase().includes(category.toLowerCase());
      const matchAmount = (!minAmount || data.amount >= minAmount) && (!maxAmount || data.amount <= maxAmount);
      const matchDate =
        (!startDate || new Date(data.date) >= new Date(startDate)) &&
        (!endDate || new Date(data.date) <= new Date(endDate));

      return matchType && matchCategory && matchAmount && matchDate;
    };

    // Тригер фільтрації (передаємо довільний рядок, щоб оновити таблицю)
    this.dataSource.filter = JSON.stringify(this.filters);
    this._calcTotal();
  }

  public async addTransAction()
  {
    const value = this.transGroup.getRawValue() as DefaultTransactionType;
    this.dataSource.data = [...this.dataSource.data, value];
    this._calcTotal();
    this._resetForm();
    await this._storage.saveTransAction(value);
  }

  private async _initData()
  {
    this.categories =  (await this._storage.retrieveCategories()).map((c) => c.value );
    const data = await this._storage.retrieveTransActions();

    console.log(data);
    this.dataSource = new MatTableDataSource(data);
    this._calcTotal();
    this._cdr.detectChanges();
  }

  private _calcTotal()
  {
    const expenses = this.dataSource.filteredData
      .filter(({type}) => type === 'expenses')
      .map(({amount}) => amount)
      .reduce((acc, cur) => acc + cur, 0);
    const incomes = this.dataSource.filteredData
      .filter(({type}) => type === 'incomes')
      .map(({amount}) => amount)
      .reduce((acc, cur) => acc + cur, 0);

    this.total = incomes - expenses;
  }

  private _resetForm()
  {
    this.transGroup.reset({
      name: '',
      amount: 0,
      category: '',
      type: 'expenses',
      date: new Date(),
    })
  }
}
