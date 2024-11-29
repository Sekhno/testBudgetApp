import {DefaultTransactionType} from '../models/TransactionsTypes';

export function saveTransActions(transactions: DefaultTransactionType[])
{
  localStorage.setItem('[TRANSACTIONS]', JSON.stringify(transactions));
}

export function retrieveTransActions()
{
  const value = localStorage.getItem('[TRANSACTIONS]');

  if (!value) return [] as DefaultTransactionType[];
  else return JSON.parse(value) as DefaultTransactionType[];
}
