import {DefaultTransactionType} from '../models/TransactionsTypes';
import {Injectable} from '@angular/core';
import {
  updateDoc,
  doc,
  getDoc,
  arrayUnion
} from '@angular/fire/firestore';
import {UserStorage} from '../../../../core/storage';

interface BudgetDocumentData {
  id: string,
  categories: {value: string}[],
  transactions: DefaultTransactionType[]
}

@Injectable({providedIn: 'root'})
export class StorageService extends UserStorage {
  constructor() { super() }

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
