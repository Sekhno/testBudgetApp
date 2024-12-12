import { StorageMap } from '@ngx-pwa/local-storage';



import {DefaultTransactionType} from '../models/TransactionsTypes';
import {afterNextRender, afterRender, inject, Injectable, Injector, runInInjectionContext} from '@angular/core';
import {first, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class StorageService {
  private _storage: any;
  constructor(private storage: StorageMap) {
    afterRender(() => {
      this._storage = window.localStorage;
    })
  }

  saveTransActions(transactions: DefaultTransactionType[])
  {
    const observer = new Subject();

    this._storage.setItem('[TRANSACTIONS]', JSON.stringify(transactions));
    observer.next('[TRANSACTIONS] SAVE COMPLETED');

    return observer.pipe(first())
  }

  retrieveTransActions()
  {
    const observer = new Subject();

    afterRender(() => {
      const value = localStorage.getItem('[TRANSACTIONS]');

      if (!value) observer.next([] as DefaultTransactionType[]);
      else observer.next(JSON.parse(value) as DefaultTransactionType[]);
    });

    return observer.pipe(first())
  }

  saveCategories(categories: string[])
  {
    const observer = new Subject();

    this._storage.setItem('[CATEGORIES]', JSON.stringify(categories));
    observer.next('[CATEGORIES] SAVE COMPLETED');

    return observer.pipe(first())
  }

  retrieveCategories()
  {
    const observer = new Subject();
    afterRender(() => {
      const value = localStorage.getItem('[CATEGORIES]');
      if (!value) observer.next(["Groceries", "Salary", "Entertainment"] as string[]);
      else observer.next(JSON.parse(value) as string[]);
    });
    // return this.storage.get('[CATEGORIES]');
    return observer.pipe(first())
  }
}

// export function saveTransActions(transactions: DefaultTransactionType[])
// {
//   localStorage.setItem('[TRANSACTIONS]', JSON.stringify(transactions));
// }

// export function retrieveTransActions()
// {
//   const value = localStorage.getItem('[TRANSACTIONS]');
//
//   if (!value) return [] as DefaultTransactionType[];
//   else return JSON.parse(value) as DefaultTransactionType[];
// }

// export function saveCategories(categories: string[])
// {
//   localStorage.setItem('[CATEGORIES]', JSON.stringify(categories));
// }

// export function retrieveCategories()
// {
//   const value = localStorage.getItem('[CATEGORIES]');
//
//   if (!value) return ["Groceries", "Salary", "Entertainment"] as string[];
//   else return JSON.parse(value) as string[];
// }
