import { StorageMap } from '@ngx-pwa/local-storage';
import {DefaultTransactionType} from '../models/TransactionsTypes';
import {afterRender, inject, Injectable, Injector, runInInjectionContext, signal} from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  collectionData,
  where,
  updateDoc,
  doc,
  getDoc,
  arrayUnion
} from '@angular/fire/firestore';
import {first, Subject, Observable, take} from 'rxjs';
import {DocumentData} from '@angular/fire/compat/firestore';

interface BudgetDocumentData {
  id: string,
  categories: {value: string}[],
  transactions: DefaultTransactionType[]
}

const USER_KEY = 'userId=';


@Injectable({providedIn: 'root'})
export class StorageService {

  public availableSignal = signal(false);

  private _firestore: Firestore = inject(Firestore);
  private _userId = '';
  private _userCollectionId = '';

  constructor()
  {
    afterRender(async () => {
      if (!this._userId) {
        const cookieValue = document.cookie
          .split('; ')
          .find((row) => row.startsWith(USER_KEY));

        if (cookieValue) {
          this._userId = cookieValue.replace(USER_KEY, '');

          const appRef = collection(this._firestore, 'users');
          const arr = await getDocs(
            query(appRef, where('id', '==', this._userId))
          );

          if (arr.size) {
            this._userCollectionId = arr.docs[0].id;
          }
          else {
            await addDoc(collection(this._firestore, 'users'), {
              id: this._userId,
              categories: [],
              transactions: []
            }  as DocumentData);
          }

          this.availableSignal.set(true);
        }
      }
    });
  }

  async saveTransAction({name, amount, category, type, date}: DefaultTransactionType)
  {
    const userRef = doc(this._firestore, 'users', this._userCollectionId);

    await updateDoc(userRef, {
      transactions: arrayUnion({name, amount, category, type, date: date.getTime()})
    });
  }

  async retrieveTransActions()
  {
    const userRef = doc(this._firestore, 'users', this._userCollectionId);
    const snap = await getDoc(userRef);
    const {transactions} = snap.data() as BudgetDocumentData;

    return transactions;
  }

  async saveCategory(category: string)
  {
    const userRef = doc(this._firestore, 'users', this._userCollectionId);

    await updateDoc(userRef, {
      categories: arrayUnion({value: category})
    });
  }

  async retrieveCategories()
  {
    const userRef = doc(this._firestore, 'users', this._userCollectionId);
    const snap = await getDoc(userRef);
    const {categories} = snap.data() as BudgetDocumentData;

    return categories;
  }
}
