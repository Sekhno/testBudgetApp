import {addDoc, collection, Firestore, getDocs, query, where} from '@angular/fire/firestore';
import {afterRender, inject, signal} from '@angular/core';
import {DocumentData} from '@angular/fire/compat/firestore';

const USER_KEY = 'userId=';

export class UserStorage {
  public availableSignal = signal(false);

  protected _firestore: Firestore = inject(Firestore);
  protected _userId = '';
  protected _userCollectionId = '';

  constructor(

  ) {
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
              transactions: [],
              statistics: []
            }  as DocumentData);
          }

          this.availableSignal.set(true);
        }
      }
    });
  }
}
