import {Injectable} from '@angular/core';
import {
  updateDoc,
  doc,
  getDoc,
  arrayUnion
} from '@angular/fire/firestore';
import {UserStorage} from '../../../../core/storage';

export interface Result {
  total: number,
  wrong: number,
  right: number,
  date: number
}

@Injectable({providedIn: 'root'})
export class StorageService extends UserStorage {
  constructor() { super() }

  async saveResult(result: Result)
  {
    const userRef = doc(this._firestore, 'users', this._userCollectionId);

    await updateDoc(userRef, {
      statistics: arrayUnion(result)
    });
  }

  async retrieveStatistics()
  {
    const userRef = doc(this._firestore, 'users', this._userCollectionId);
    const snap = await getDoc(userRef);
    const {statistics} = snap.data() as {statistics : Result[]};

    return statistics;
  }

}
