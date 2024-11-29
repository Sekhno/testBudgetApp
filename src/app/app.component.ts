import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {CategoryType, DefaultTransactionType} from './models/TransactionsTypes';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DatePipe} from '@angular/common';
import {retrieveTransActions, saveTransActions} from './storage/crud';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet, DatePipe,
    MatInputModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatIconButton, MatButtonModule,
    MatTableModule, MatDatepickerModule
  ]
})
export class AppComponent {
  private _fb = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);

  public categories: CategoryType[] = ["Groceries", "Salary", "Entertainment"];
  public displayedColumns = ["name", "amount", "type", "category", "date"];
  public dataSource: DefaultTransactionType[] = retrieveTransActions();
  public transGroup = this._fb.group
  ({
    name: this._fb.control('', { nonNullable: true, validators: [Validators.required] }),
    amount: this._fb.control(0, { nonNullable: true, validators: [Validators.required] }),
    category: this._fb.control('', {nonNullable: true,  validators: [Validators.required] }),
    type: this._fb.control('expenses', { nonNullable: true, validators: [Validators.required] }),
    date: this._fb.control(new Date(), { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    this.transGroup.valueChanges
      .subscribe(change =>
      {
        console.log(change);
      })
  }

  public addNewCategory(name: string)
  {
    this.categories.push(name);
  }

  public removeCategory(name: string)
  {
    this.categories.splice(this.categories.indexOf(name), 1);
  }

  public addTransAction() {
    this.dataSource = [...this.dataSource, this.transGroup.getRawValue() as DefaultTransactionType];

    saveTransActions(this.dataSource)
  }
}
